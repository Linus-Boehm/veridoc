import type { DocumentType } from '@taxel/domain/src/document';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { openaiClient } from '../../lib/models';
import {
  type DocumentCategory,
  documentClassificationPrompt,
} from './prompts/documentClassification';
import {
  type DocumentExtractionResponse,
  documentExtractionPrompt,
} from './prompts/documentExtraction';

const attachmentSchema = z.object({
  Name: z.string(),
  Content: z.string(),
  ContentType: z.string(),
  ContentLength: z.number(),
  ContentID: z.string(),
});

export type Attachment = z.infer<typeof attachmentSchema>;

/**
 * Extracts data from a generic document using OpenAI's GPT-4o-mini model.
 * @param fileData - The base64 encoded file data as a string.
 * @returns The parsed JSON object from the model's response.
 */
export const genericDocumentExtraction = async (
  attachment: Attachment
): Promise<DocumentExtractionResponse | null> => {
  const response = await openaiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: documentExtractionPrompt.prompt,
      },
      {
        role: 'user',
        content: [
          {
            type: 'file',
            file: {
              //The base64 encoded file data as string
              filename: attachment.Name,
              file_data: `data:${attachment.ContentType};base64,${attachment.Content}`,
            },
          },
          {
            type: 'text',
            text: 'Extract the data from the document',
          },
        ],
      },
    ],
    response_format: zodResponseFormat(
      documentExtractionPrompt.responseSchema,
      'documentExtraction'
    ),
  });

  return response.choices[0].message.parsed;
};

const mapDocumentType = (category: DocumentCategory): DocumentType => {
  switch (category) {
    case 'Rechnung':
      return 'invoice';
    case 'Zahlungsbestätigung':
      return 'payment_confirmation';
    case 'Mahnung':
      return 'reminder';
    case 'Vertrag':
      return 'contract';
    case 'Bestellung':
      return 'order';
    case 'Bestellbestätigung':
      return 'order_confirmation';
    case 'InterneKommunikation':
      return 'internal_communication';
    case 'WerbungNewsletter':
      return 'advertising_newsletter';
    case 'Sonstiges':
      return 'other';
    case 'Error':
      return 'unknown';
  }
};

export const documentClassification = async (
  formatedDocument: string
): Promise<DocumentType> => {
  const response = await openaiClient.beta.chat.completions.parse({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: documentClassificationPrompt.prompt,
      },
      {
        role: 'user',
        content: formatedDocument,
      },
    ],
    response_format: zodResponseFormat(
      documentClassificationPrompt.responseSchema,
      'documentClassification'
    ),
  });

  const type = response.choices[0].message.parsed;

  if (!type) {
    return 'unknown';
  }

  return mapDocumentType(type.category);
};
