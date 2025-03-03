import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      S3_BUCKET_NAME: z.string().min(1),
      S3_ACCESS_KEY_ID: z.string().min(1),
      S3_SECRET_ACCESS_KEY: z.string().min(1),
      S3_REGION: z.string().min(1),
    },
    runtimeEnv: {
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
      S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
      S3_REGION: process.env.S3_REGION,
      },
  });
