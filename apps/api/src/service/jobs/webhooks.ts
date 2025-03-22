import { NonRetriableError } from 'inngest';
import { InboundEmailRepository } from '../../repository/inboundEmail';
import { DocumentProcessingService } from '../documents/processing';
import {
  type InboundEmailEvent,
  InboundEmailService,
  inboundEmailSchema,
} from '../inboundEmails/inboundEmail';
import { inngest } from './inngest/client';

export const inboundEmail = inngest.createFunction(
  { id: 'webhooks/inbound-email' },
  { event: 'webhooks/inbound-email' },
  async ({ event: rawEvent, step, logger }) => {
    const documentProcessing = new DocumentProcessingService();
    const emailService = new InboundEmailService();
    let event: InboundEmailEvent;
    try {
      event = inboundEmailSchema.parse(rawEvent);
    } catch (error) {
      throw new NonRetriableError('Invalid event', {
        cause: error,
      });
    }
    /*
     * This step will create the initial email record
     */
    const { emailId, postboxId, organizationId } = await step.run(
      'process-email',
      async () => {
        // Add debugging to see what's in the email data
        logger.info('Processing email with data', {
          textBody: event.data.emailJson.TextBody,
          textBodyType: typeof event.data.emailJson.TextBody,
          hasTextBody: 'TextBody' in event.data.emailJson,
        });

        // Make sure TextBody exists and is a string before processing
        if (
          event.data.emailJson.TextBody === null ||
          event.data.emailJson.TextBody === undefined
        ) {
          event.data.emailJson.TextBody = '';
        }

        const { postbox, email } = await emailService.processEmail(event);

        logger.info('Email created', { emailId: email.id });

        return {
          emailId: email.id,
          postboxId: postbox.id,
          organizationId: postbox.toJSON().organizationId,
        };
      }
    );

    const uploadSteps = event.data.emailJson.Attachments.map(
      async (attachment) => {
        const document = await step.run('upload-attachments', async () => {
          logger.info('Processing attachment', {
            emailId: emailId,
            attachmentName: attachment.Name,
          });

          // Get the InboundEmail directly from the repository
          const emailRepo = new InboundEmailRepository();
          const freshEmail = await emailRepo.findById(emailId, {
            organizationId: organizationId,
          });

          if (!freshEmail) {
            throw new Error(`Email not found: ${emailId}`);
          }

          const document = await documentProcessing.createFromEmailAttachment(
            attachment,
            emailId,
            organizationId
          );
          logger.info('Document created', {
            emailId: emailId,
            documentId: document.id,
          });
          return document;
        });

        const classifiedDocument = await step.run('document-ocr', async () => {
          const service = new DocumentProcessingService();

          const extraction = await service.extractGenericDocument(
            document.id,
            attachment
          );
          return await service.classifyDocument(extraction);
        });

        await step.run('extract-invoice', async () => {
          if (classifiedDocument.type !== 'invoice') {
            return;
          }
          const service = new DocumentProcessingService();
          const data = await service.processInvoice(document.id);
          return data;
        });

        await step.run('finish-document-processing', async () => {
          const service = new DocumentProcessingService();
          await service.updateDocumentProcessingStatus(
            document.id,
            'completed'
          );
        });
      }
    );

    await Promise.all(uploadSteps);

    await step.run('update-email-status', async () => {
      const service = new InboundEmailService();
      await service.updateStatus(emailId, organizationId, 'processed');
    });
  }
);
