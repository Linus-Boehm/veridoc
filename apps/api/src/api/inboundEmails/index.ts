import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import type { InboundEmailDTO } from '@taxel/domain/src/inboundEmail';
import { InboundEmailService } from '#src/service/inboundEmails/inboundEmail.ts';
import { ensureAuthenticated, getAppContext } from '../middleware/auth';

const app = new Hono()
  .use(ensureAuthenticated)
  .get(
    '/',
    zValidator(
      'query',
      z.object({
        includeArchived: z.enum(['true', 'false']).optional(),
      })
    ),
    async (c) => {
      const ctx = getAppContext(c);
      const { includeArchived } = c.req.valid('query');

      const service = new InboundEmailService();
      const emails = await service.findAll(ctx, includeArchived === 'true');

      return c.json<InboundEmailDTO[]>(
        emails.map((email) => email.toJSON()),
        200
      );
    }
  )
  .get(
    '/:emailId',
    zValidator(
      'param',
      z.object({
        emailId: z.string().uuid(),
      })
    ),
    zValidator(
      'query',
      z.object({
        withDetails: z.enum(['true', 'false']).optional(),
      })
    ),
    async (c) => {
      const ctx = getAppContext(c);
      const service = new InboundEmailService();
      const { emailId } = c.req.valid('param');
      const { withDetails } = c.req.valid('query');

      const email = await service.findById(ctx, emailId);

      return c.json<InboundEmailDTO>(email.toJSON(withDetails === 'true'), 200);
    }
  )
  .post(
    '/:emailId/archive',
    zValidator(
      'param',
      z.object({
        emailId: z.string().uuid(),
      })
    ),
    async (c) => {
      const ctx = getAppContext(c);
      const service = new InboundEmailService();
      const { emailId } = c.req.valid('param');

      const archivedEmail = await service.archive(ctx, emailId);

      return c.json<InboundEmailDTO>(archivedEmail.toJSON(), 200);
    }
  );

export default app;
