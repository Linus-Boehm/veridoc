import 'server-only';
import { Hono } from 'hono';

import { honoAuthMiddleware } from '@repo/auth/honoMiddleware';
import { keys } from '@repo/auth/keys';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import documents from './documents';
import monitoring from './monitoring';
import webhooks from './webhooks';

const router = new Hono()
  .use(prettyJSON())
  .use(
    cors({
      origin: ['*', 'http://localhost:3000', 'http://localhost:3002'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'Sec-Ch-*'],
      credentials: true,
      maxAge: 600,
    })
  )
  .notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
  .route('/monitoring', monitoring)
  .use(
    honoAuthMiddleware({
      publishableKey: keys().NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      secretKey: keys().CLERK_SECRET_KEY,
    })
  )
  .route('/webhooks', webhooks)
  .route('/documents', documents);

export default router;

export type AppRouter = typeof router;
