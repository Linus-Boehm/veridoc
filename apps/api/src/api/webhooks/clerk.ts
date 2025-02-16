import 'server-only';
import {
  handleOrganizationCreated,
  handleOrganizationDeleted,
  handleOrganizationMembershipCreated,
  handleOrganizationMembershipDeleted,
  handleOrganizationUpdated,
  handleUserCreated,
  handleUserDeleted,
  handleUserUpdated,
} from '@/src/service/webhooks/clerk';
import type { WebhookResponse } from '@/src/service/webhooks/types';
import { DEFAULT_WEBHOOK_RESPONSE } from '@/src/service/webhooks/utils';
import { analytics } from '@repo/analytics/posthog/server';
import type { WebhookEvent } from '@repo/auth/server';
import { log } from '@repo/observability/log';
import { Hono } from 'hono';
import { Webhook } from 'svix';
import { env } from '@/env';

const app = new Hono().post('/', async (c) => {
  if (!env.CLERK_WEBHOOK_SECRET) {
    return c.json({ message: 'Not configured', ok: false }, 500);
  }

  const svixId = c.req.header('svix-id');
  const svixTimestamp = c.req.header('svix-timestamp');
  const svixSignature = c.req.header('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return c.json({ message: 'Error occured -- no svix headers' }, 400);
    }

    // Get the raw body as string directly
    const body = await c.req.raw.text();

    // Create a new SVIX instance with your secret.
    const webhook = new Webhook(env.CLERK_WEBHOOK_SECRET);

    let event: WebhookEvent | undefined;

    // Verify the payload with the headers
    try {
      event = webhook.verify(body, {
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      log.error('Error verifying webhook:', { error });
      return c.json({ message: 'Error occurred - verifycation failed' }, 400);
    }

    // Get the ID and type
    const { id } = event.data;
    const eventType = event.type;

    log.debug('Webhook', { id, eventType, body });

    let response: WebhookResponse = DEFAULT_WEBHOOK_RESPONSE;

    try {
      switch (eventType) {
        case 'user.created': {
          response = await handleUserCreated(event.data);
          break;
        }
        case 'user.updated': {
          response = await handleUserUpdated(event.data);
          break;
        }
        case 'user.deleted': {
          response = await handleUserDeleted(event.data);
          break;
        }
        case 'organization.created': {
          response = await handleOrganizationCreated(event.data);
          break;
        }
        case 'organization.updated': {
          response = await handleOrganizationUpdated(event.data);
          break;
        }
        case 'organization.deleted': {
          response = await handleOrganizationDeleted(event.data);
          break;
        }
        case 'organizationMembership.created': {
          response = await handleOrganizationMembershipCreated(event.data);
          break;
        }
        case 'organizationMembership.deleted': {
          response = await handleOrganizationMembershipDeleted(event.data);
          break;
        }
        default: {
          break;
        }
      }
    } catch (error) {
      log.error('Error handling webhook:', { error, event });
      response = {
        content: { message: 'Error occurred - handler failed' },
        status: 500,
      };
    }

    await analytics.shutdown();

    return c.json(response.content, response.status as 200 | 400 | 500);
});

export default app;
