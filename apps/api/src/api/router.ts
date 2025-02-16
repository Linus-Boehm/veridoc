import 'server-only';
import { Hono } from 'hono';

import { prettyJSON } from 'hono/pretty-json';
import monitoring from './monitoring';
import webhooks from './webhooks';

const router = new Hono()
  .use(prettyJSON())
  .notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))
  .route('/webhooks', webhooks)
  .route('/monitoring', monitoring)

export default router;

export type AppType = typeof router;