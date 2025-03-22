import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { inngest } from '#src/service/jobs/inngest/client.ts';
import { emailBodySchema } from '#src/service/inboundEmails/inboundEmail.ts';



const app = new Hono().post(
  '/inbound/:postboxId',
  zValidator('json', emailBodySchema),
  async (c) => {
    const body = c.req.valid('json');
    await inngest.send({
      name: 'webhooks/inbound-email',
      data: {
        postBoxId: c.req.param('postboxId'),
        emailJson: body,
      },
    });

    return c.json(
      {
        message: 'Email received successfully',
      },
      200
    );
  }
);

export default app;
