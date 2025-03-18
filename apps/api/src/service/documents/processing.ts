import { extractDocumentFromUrl } from '@repo/ai/lib/extraction';
import { InvoiceRepository } from '#src/repository/invoice/index.ts';
import { DocumentRepository } from '../../repository/document';
import { InboundEmailService } from '../inboundEmails/inboundEmail';
import { getStorageResourceForKey } from './create_document';

export class DocumentProcessingService {
  private docRepo: DocumentRepository;
  private invoiceRepository: InvoiceRepository;
  private emailService: InboundEmailService;

  constructor() {
    this.docRepo = new DocumentRepository();
    this.invoiceRepository = new InvoiceRepository();
    this.emailService = new InboundEmailService();
  }

  async extractDocument(documentId: string) {
    const document = await this.docRepo.findById(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }
    const resource = await getStorageResourceForKey(document.getStoragePath());
    document.setStorageResource(resource);

    try {
      const updatePromise = this.docRepo.updateProcessingStatus(
        document.id,
        'processing'
      );
      const extracted = await extractDocumentFromUrl(
        resource.getUrl,
        document.getOrganizationId(),
        document.id
      );
      const documentExtractionPromise = this.docRepo.createExtraction({
        organizationId: document.getOrganizationId(),
        documentId: document.id,
        extractionResult: extracted || {},
      });

      const invoicesPromises = extracted.invoices.map((data) =>
        this.invoiceRepository.create(data)
      );

      await Promise.all([updatePromise, documentExtractionPromise]);
      await this.docRepo.updateProcessingStatus(document.id, 'completed');

      // Update the email status if this document is associated with an email
      const emailId = document.getEmailId();
      if (emailId) {
        await this.updateEmailStatus(emailId, document.getOrganizationId());
      }

      return await Promise.all(invoicesPromises);
    } catch (error) {
      await this.docRepo.updateProcessingStatus(document.id, 'failed');

      // Update the email status if this document is associated with an email
      const emailId = document.getEmailId();
      if (emailId) {
        await this.updateEmailStatus(emailId, document.getOrganizationId());
      }

      throw error;
    }
  }

  private async updateEmailStatus(emailId: string, organizationId: string) {
    try {
      // Update the email status based on its documents using just the organization ID
      await this.emailService.updateStatusBasedOnDocuments(
        organizationId,
        emailId
      );
    } catch (error) {
      console.error(
        `Failed to update email status for email ${emailId}:`,
        error
      );
      // Don't throw the error as this is a secondary operation
    }
  }
}
