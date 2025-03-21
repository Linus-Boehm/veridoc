import { DocumentProcessingService } from '../documents/processing';
import { inngest } from './inngest/client';
import { extractDocumentSchema } from './inngest/events';

export const documentActionsExtract = inngest.createFunction(
  { id: 'documents/actions/extract' },
  { event: 'documents/actions/extract' },
  async ({ event: rawEvent, step }) => {
    const event = extractDocumentSchema.parse(rawEvent);

    const service = new DocumentProcessingService();

    await service.processInvoice(event.data.documentId);
  }
);
