import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
      AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT: z.string().url().min(1),
      AZURE_DOCUMENT_INTELLIGENCE_KEY: z.string().min(1),
    },
    runtimeEnv: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT:
        process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
      AZURE_DOCUMENT_INTELLIGENCE_KEY:
        process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY,
    },
  });
