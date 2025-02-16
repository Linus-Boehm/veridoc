import type { WebhookResponse } from './types';

export const DEFAULT_WEBHOOK_RESPONSE: WebhookResponse = {
  content: { message: 'OK' },
  status: 201,
};
