import { InvoiceService } from '#src/service/invoices/invoice.ts';
import type { AppContext } from '../../domain/context';
import { DocumentRepository } from '../../repository/document';
import { extractDocumentFromUrl } from '@repo/ai/lib/extraction';
import { getSignedGetUrl } from '@repo/storage/server';

const getFileNameFromKey = (key: string) => {
  return key.split('/').pop();
};

export const onDocumentUploaded = async (ctx: AppContext, key: string) => {
  const url = await getSignedGetUrl(key);
  const repo = new DocumentRepository();
  const document = await repo.findByStoragePath(key, ctx.organization.id);

  if (!document) {
    throw new Error('Document not found');
  }
  try {
  const updatePromise = repo.updateProcessingStatus(document.id, 'processing');
  const extracted = await extractDocumentFromUrl(url, ctx.organization.id, document.id);
  const documentExtractionPromise = repo.createExtraction({
    organizationId: ctx.organization.id,
    documentId: document.id,
    extractionResult: extracted || {},
  });

  const invoiceService = new InvoiceService();

  const invoicesPromises = extracted.invoices.map(data => invoiceService.create(ctx, data));

  await Promise.all([updatePromise, documentExtractionPromise]);
    await repo.updateProcessingStatus(document.id, 'completed');
    return await Promise.all(invoicesPromises);
  } catch (error) {
    await repo.updateProcessingStatus(document.id, 'failed');
    throw error;
  }
};
