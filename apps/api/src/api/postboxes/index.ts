import { zValidator } from '@hono/zod-validator';
import { Postbox, createPostboxSchema } from '@taxel/domain/src/postbox';
import { Hono } from 'hono';
import { env } from '#env.ts';
import { PostboxService } from '#src/service/email/postbox.ts';
import { ensureAuthenticated, getAppContext } from '../middleware/auth';

const initPostboxService = () => {
  const postmarkApiKey = env.POSTMARK_API_KEY;
  const apiUrl = env.NEXT_PUBLIC_API_URL;
  if (!postmarkApiKey || !apiUrl) {
    throw new Error('POSTMARK_API_KEY and NEXT_PUBLIC_API_URL must be set');
  }
  return new PostboxService(postmarkApiKey, apiUrl);
};

const app = new Hono()
  .use(ensureAuthenticated)
  .get('/', async (c) => {
    const ctx = getAppContext(c);
    const service = initPostboxService();
    const postboxes = await service.list(ctx);
    return c.json(postboxes);
  })
  .post('/', zValidator('json', createPostboxSchema), async (c) => {
    const ctx = getAppContext(c);
    const body = c.req.valid('json');
    const service = initPostboxService();

    const newPostbox = new Postbox({
      name: body.name,
      organizationId: ctx.organization.id,
      postmarkServerId: null,
      postmarkInboundEmail: null,
    });

    const postbox = await service.createServer(ctx, newPostbox);
    return c.json(postbox.toJSON());
  });

export default app;
