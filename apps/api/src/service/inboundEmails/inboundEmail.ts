import { NotFoundError } from '@taxel/domain/src/errors/not-found';
import { type EmailStatus, InboundEmail } from '@taxel/domain/src/inboundEmail';
import type { Postbox } from '@taxel/domain/src/postbox';
import { z } from 'zod';
import { PostboxRepository } from '#src/repository/postbox/index.ts';
import type { AppContext } from '../../domain/context';
import { InboundEmailRepository } from '../../repository/inboundEmail';
import { getStorageResourceForKey } from '../documents/create_document';

const emailPersonSchema = z.object({
  Email: z.string().email(),
  Name: z.string(),
  MailboxHash: z.string(),
});

const headerSchema = z.object({
  Name: z.string(),
  Value: z.string(),
});

const attachmentSchema = z.object({
  Name: z.string(),
  Content: z.string(),
  ContentType: z.string(),
  ContentLength: z.number(),
  ContentID: z.string(),
});

export const emailBodySchema = z.object({
  From: z.string(),
  MessageStream: z.string(),
  FromName: z.string(),
  FromFull: emailPersonSchema,
  To: z.string(),
  ToFull: z.array(emailPersonSchema),
  Cc: z.string().optional().default(''),
  CcFull: z.array(emailPersonSchema),
  Bcc: z.string().optional().default(''),
  BccFull: z.array(emailPersonSchema),
  OriginalRecipient: z.string(),
  ReplyTo: z.string(),
  Subject: z.string(),
  MessageID: z.string(),
  Date: z.string(),
  MailboxHash: z.string(),
  TextBody: z.string().optional().default(''),
  HtmlBody: z.string().optional().default(''),
  StrippedTextReply: z.string(),
  Tag: z.string(),
  Headers: z.array(headerSchema),
  Attachments: z.array(attachmentSchema),
});

export const inboundEmailSchema = z.object({
  name: z.literal('webhooks/inbound-email'),
  data: z.object({
    postBoxId: z.string(),
    emailJson: emailBodySchema,
  }),
});

export type InboundEmailEvent = z.infer<typeof inboundEmailSchema>;

export class InboundEmailService {
  private readonly inboundEmailRepository: InboundEmailRepository;

  constructor() {
    this.inboundEmailRepository = new InboundEmailRepository();
  }

  async processEmail(webhook: InboundEmailEvent) {
    const postbox = await this._validatePostbox(webhook);

    const email = await this._createEmailFromWebhook(webhook, postbox);

    return { email, postbox };
  }

  private async _validatePostbox(webhook: InboundEmailEvent) {
    const postBoxId = webhook.data.postBoxId;
    const body = webhook.data.emailJson;
    const postboxRepo = new PostboxRepository();
    const postbox = await postboxRepo.findById(postBoxId);
    if (!postbox) {
      throw new Error(`Postbox not found: ${postBoxId}`);
    }
    const postboxdata = postbox.toJSON();
    if (postboxdata.postmarkInboundEmail !== body.To) {
      throw new Error(`Invalid postbox ${body.To} does not match ${postBoxId}`);
    }

    return postbox;
  }

  private _createEmailFromWebhook(
    webhook: InboundEmailEvent,
    postbox: Postbox
  ): Promise<InboundEmail> {
    const body = webhook.data.emailJson;
    const { organizationId, id: postBoxId } = postbox.toJSON();

    // Ensure TextBody is always a string, not null or undefined
    const textBody = typeof body.TextBody === 'string' ? body.TextBody : '';
    const htmlBody = typeof body.HtmlBody === 'string' ? body.HtmlBody : '';

    const email = new InboundEmail({
      organizationId: organizationId,
      postboxId: postBoxId,
      from: body.From,
      fromName: body.FromName,
      to: body.To,
      cc: body.Cc || '',
      bcc: body.Bcc || '',
      subject: body.Subject,
      messageId: body.MessageID,
      bodyText: textBody,
      bodyHtml: htmlBody,
      date: body.Date,
      status: 'received',
    });

    return this.createEmail(email);
  }

  async findAll(
    ctx: AppContext,
    includeArchived = false
  ): Promise<InboundEmail[]> {
    const { organization } = ctx;

    return this.inboundEmailRepository.list({
      organizationId: organization.id,
      includeArchived,
    });
  }

  async findById(ctx: AppContext, emailId: string): Promise<InboundEmail> {
    const { organization } = ctx;

    const email = await this.inboundEmailRepository.findById(emailId, {
      organizationId: organization.id,
    });

    if (!email) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = email.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return email;
  }

  createEmail(email: InboundEmail): Promise<InboundEmail> {
    return this.inboundEmailRepository.create(email);
  }

  async updateStatus(
    emailId: string,
    organizationId: string,
    status: EmailStatus
  ): Promise<InboundEmail> {
    const updatedEmail = await this.inboundEmailRepository.updateStatus(
      emailId,
      status,
      organizationId
    );

    if (!updatedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = updatedEmail.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return updatedEmail;
  }

  async updateStatusBasedOnDocuments(
    ctx: AppContext,
    emailId: string
  ): Promise<InboundEmail>;
  async updateStatusBasedOnDocuments(
    organizationId: string,
    emailId: string
  ): Promise<InboundEmail>;
  async updateStatusBasedOnDocuments(
    ctxOrOrgId: AppContext | string,
    emailId: string
  ): Promise<InboundEmail> {
    let organizationId: string;

    if (typeof ctxOrOrgId === 'string') {
      organizationId = ctxOrOrgId;
    } else {
      organizationId = ctxOrOrgId.organization.id;
    }

    // First get the email
    const email = await this.inboundEmailRepository.findById(emailId, {
      organizationId,
    });

    if (!email) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Set storage resources for all documents
    const documents = email.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    // Update the status based on document processing status
    email.updateStatusBasedOnDocuments();

    // Save the updated status
    const updatedEmail = await this.inboundEmailRepository.updateStatus(
      emailId,
      email.getStatus(),
      organizationId
    );

    if (!updatedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    return updatedEmail;
  }

  async archive(ctx: AppContext, emailId: string): Promise<InboundEmail> {
    const { organization, user } = ctx;

    const archivedEmail = await this.inboundEmailRepository.archive(
      emailId,
      organization.id,
      user.id
    );

    if (!archivedEmail) {
      throw new NotFoundError(`InboundEmail with id ${emailId} not found`);
    }

    // Update the status to archived
    await this.inboundEmailRepository.updateStatus(
      emailId,
      'archived',
      organization.id
    );

    // Set storage resources for all documents
    const documents = archivedEmail.getDocuments();
    if (documents.length > 0) {
      for (const document of documents) {
        const storageResource = await getStorageResourceForKey(
          document.getStoragePath()
        );
        document.setStorageResource(storageResource);
      }
    }

    return archivedEmail;
  }
}
