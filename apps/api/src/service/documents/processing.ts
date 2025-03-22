import { extractInvoiceFromUrl } from '@repo/ai/lib/innvoice';
import {
  documentClassification,
  genericDocumentExtraction,
} from '@repo/ai/src/generic-document/modelQueries';
import type { SelectDocumentExtraction } from '@repo/database/types';
import { getSignedPutUrl } from '@repo/storage/server';
import {
  Document,
  type ProcessingStatus as DocumentProcessingStatus
} from '@taxel/domain/src/document.ts';
import type { InboundEmail } from '@taxel/domain/src/inboundEmail';
import { v7 as uuidv7 } from 'uuid';
import { z } from 'zod';
import { InvoiceRepository } from '#src/repository/invoice/index.ts';
import { PostboxRepository } from '#src/repository/postbox/index.ts';
import { DocumentRepository } from '../../repository/document';
import { InboundEmailService } from '../inboundEmails/inboundEmail';
import { getStorageResourceForKey } from './create_document';

const attachmentSchema = z.object({
  Name: z.string(),
  Content: z.string(),
  ContentType: z.string(),
  ContentLength: z.number(),
  ContentID: z.string(),
});

export type Attachment = z.infer<typeof attachmentSchema>;

const decodeBase64 = (base64String: string): Buffer => {
  return Buffer.from(base64String, 'base64');
};

export class DocumentProcessingService {
  private docRepo: DocumentRepository;
  private invoiceRepository: InvoiceRepository;
  private emailService: InboundEmailService;
  private postboxRepo: PostboxRepository;

  constructor() {
    this.docRepo = new DocumentRepository();
    this.invoiceRepository = new InvoiceRepository();
    this.emailService = new InboundEmailService();
    this.postboxRepo = new PostboxRepository();
  }

  async createFromEmailAttachment(attachment: Attachment, emailId: string, organizationId: string) {
    const documentId = uuidv7();

    const key = `${organizationId}/${documentId}/${attachment.Name}`;
    const putUrl = await getSignedPutUrl(key);
    const fileContent = decodeBase64(attachment.Content);
    const response = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': attachment.ContentType,
        'Content-Length': attachment.ContentLength.toString(),
      },
      body: fileContent,
    });
    if (!response.ok) {
      throw new Error(`Failed to upload attachment ${attachment.Name}`);
    }

    const newDocument = new Document({
      organizationId,
      emailId,
      fileName: attachment.Name,
      storagePath: key,
      type: 'unknown',
      processingStatus: 'processing',
    });

    return this.docRepo.create(newDocument);
  }

  private async receiveDocument(documentId: string): Promise<Document> {
    const document = await this.docRepo.findById(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }
    const resource = await getStorageResourceForKey(document.getStoragePath());
    document.setStorageResource(resource);
    return document;
  }

  async processInvoice(documentId: string) {
    const document = await this.receiveDocument(documentId);

    try {
      const updatePromise = this.docRepo.updateProcessingStatus(
        document.id,
        'processing'
      );
      const resource = document.getStorageResource();
      if (!resource) {
        throw new Error(`Document has no storage resource: ${documentId}`);
      }

      const extracted = await extractInvoiceFromUrl(
        resource.getUrl,
        document.getOrganizationId(),
        document.id
      );
      const documentExtractionPromise = this.docRepo.createExtraction({
        organizationId: document.getOrganizationId(),
        documentId: document.id,
        extractionResult: extracted || {},
        extractionModel: 'invoice',
      });

      const invoicesPromises = extracted.invoices.map((data) =>
        this.invoiceRepository.create(data)
      );

      await Promise.all([updatePromise, documentExtractionPromise]);
      await this.docRepo.updateProcessingStatus(document.id, 'completed');

      return await Promise.all(invoicesPromises);
    } catch (error) {
      await this.docRepo.updateProcessingStatus(document.id, 'failed');

      throw error;
    }
  }

  async extractGenericDocument(documentId: string, attachment: Attachment) {
    const document = await this.receiveDocument(documentId);
    const extracted = await genericDocumentExtraction(attachment);

    if (!extracted) {
      throw new Error(`Failed to extract document: ${documentId}`);
    }

    const documentExtraction = await this.docRepo.createExtraction({
      organizationId: document.getOrganizationId(),
      documentId: document.id,
      extractionResult: extracted || {},
      extractionModel: 'generic',
    });

    return documentExtraction;
  }

  async classifyDocument(extraction: SelectDocumentExtraction) {
    const extractionString = JSON.stringify(extraction.extractionResult);
    console.log('Classify Document with content', extractionString);
    const type = await documentClassification(extractionString);

    const document = await this.docRepo.updateType(extraction.documentId, type);

    return document;
  }

  updateDocumentProcessingStatus(documentId: string, status: DocumentProcessingStatus) {
    return this.docRepo.updateProcessingStatus(documentId, status);
  }
}
