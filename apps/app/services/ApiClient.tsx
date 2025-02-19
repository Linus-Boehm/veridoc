import { env } from '@/env';
import type { AppRouter } from '@repo/api-client/src/client-types';
import { hc } from 'hono/client';

export const ApiClient = hc<AppRouter>(env.NEXT_PUBLIC_API_URL);
