import 'server-only';
import { Hono } from 'hono';

import { prettyJSON } from 'hono/pretty-json';
import monitoring from './monitoring';
import webhooks from './webhooks';
import { cors } from 'hono/cors';

const router = new Hono()
  .use(prettyJSON())
  .use(
    cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
    }),
  )
  .notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
  .route('/webhooks', webhooks)
  .route('/monitoring', monitoring)

export default router;

export type AppRouter = typeof router;

