import { inboundEmailSchema } from '#src/service/inboundEmails/inboundEmail.ts';
import { EventSchemas } from 'inngest';
import { z } from 'zod';


export const extractDocumentSchema = z.object({
  name: z.literal('documents/actions/extract'),
  data: z.object({
    organizationId: z.string(),
    documentId: z.string(),
  }),
});

// New schema for document analysis
export const analyzeDocumentSchema = z.object({
  name: z.literal('documents/actions/analyze'),
  data: z.object({
    organizationId: z.string(),
    documentId: z.string(),
    documentUrl: z.string(),
  }),
});

export type AnalyzeDocumentEvent = z.infer<typeof analyzeDocumentSchema>;

export const schemas = new EventSchemas().fromZod([
  inboundEmailSchema,
  extractDocumentSchema,
  analyzeDocumentSchema,
]);
