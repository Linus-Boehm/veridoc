import { getSignedPutUrl } from '@repo/storage/server';
import { Document } from '@taxel/domain/src/document';
import { InboundEmail } from '@taxel/domain/src/inboundEmail';
import { NonRetriableError } from 'inngest';
import { v7 as uuidv7 } from 'uuid';
import { DocumentRepository } from '#src/repository/document/index.ts';
import { EmailRepository } from '#src/repository/email/index.ts';
import { PostboxRepository } from '#src/repository/postbox/index.ts';
import { DocumentProcessingService } from '../documents/processing';
import { inngest } from './inngest/client';
import { type InboundEmailEvent, inboundEmailSchema } from './inngest/events';
// Helper function to decode base64 content to Buffer
const decodeBase64 = (base64String: string): Buffer => {
  return Buffer.from(base64String, 'base64');
};

export const inboundEmail = inngest.createFunction(
  { id: 'webhooks/inbound-email' },
  { event: 'webhooks/inbound-email' },
  async ({ event: rawEvent, step, logger }) => {
    const { email, body, organizationId } = await step.run(
      'process-email',
      async () => {
        let event: InboundEmailEvent;
        try {
          event = inboundEmailSchema.parse(rawEvent);
        } catch (error) {
          throw new NonRetriableError('Invalid event', {
            cause: error,
          });
        }

        const postBoxId = event.data.postBoxId;
        const body = event.data.emailJson;
        const postboxRepo = new PostboxRepository();
        const postbox = await postboxRepo.findById(postBoxId);
        if (!postbox) {
          throw new Error(`Postbox not found: ${postBoxId}`);
        }
        const postboxdata = postbox.toJSON();
        if (postboxdata.postmarkInboundEmail !== body.To) {
          throw new Error(
            `Invalid postbox ${body.To} does not match ${postBoxId}`
          );
        }

        const organizationId = postboxdata.organizationId;

        const emailRepo = new EmailRepository();
        const email = await emailRepo.create(
          new InboundEmail({
            organizationId: organizationId,
            postboxId: postbox.id,
            from: body.From,
            fromName: body.FromName,
            to: body.To,
            cc: body.Cc || '',
            bcc: body.Bcc || '',
            subject: body.Subject,
            messageId: body.MessageID,
            bodyText: body.TextBody || '',
            bodyHtml: body.HtmlBody || '',
            date: body.Date,
            status: 'received',
          })
        );
        logger.info('Email created', { emailId: email.id });

        return {
          email,
          body,
          organizationId,
        };
      }
    );
    logger.info('Email processed', { emailId: email.id });

    const uploadSteps = body.Attachments.map(async (attachment) =>
      step.run('upload-attachments', async () => {
        logger.info('Processing attachment', {
          emailId: email.id,
          attachmentName: attachment.Name,
        });
        const documentRepo = new DocumentRepository();
        const key = `${organizationId}/${uuidv7()}/${attachment.Name}`;
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
          logger.error('Failed to upload attachment', {
            emailId: email.id,
            attachmentName: attachment.Name,
            response,
          });
          throw new Error(`Failed to upload attachment ${attachment.Name}`);
        }
        logger.info('Attachment uploaded', {
          emailId: email.id,
          attachmentName: attachment.Name,
        });

        const doc = await documentRepo.create(
          new Document({
            organizationId: organizationId,
            emailId: email.id,
            fileName: attachment.Name,
            storagePath: key,
            type: 'unknown',
            processingStatus: 'processing',
          })
        );
        logger.info('Document created', {
          emailId: email.id,
          documentId: doc.id,
        });
        const service = new DocumentProcessingService();
        const invoice = await service.extractDocument(doc.id);
        logger.info('Invoice extracted', {
          emailId: email.id,
          documentId: doc.id,
          invoiceIds: invoice.map((i) => i.id),
        });
      })
    );

    await Promise.all(uploadSteps);
  }
);
