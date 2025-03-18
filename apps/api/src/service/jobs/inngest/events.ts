import { EventSchemas } from 'inngest';
import { z } from 'zod';

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

export const extractDocumentSchema = z.object({
  name: z.literal('documents/actions/extract'),
  data: z.object({
    organizationId: z.string(),
    documentId: z.string(),
  }),
});

export const schemas = new EventSchemas().fromZod([
  inboundEmailSchema,
  extractDocumentSchema,
]);
