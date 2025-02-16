import type { StatusCode } from 'hono/utils/http-status';

export interface WebhookResponseContent {
  message: string;
}

export interface WebhookResponse {
  content: WebhookResponseContent;
  status: StatusCode;
}

export type WebhookResponseHandler<T> = (data: T) => Promise<WebhookResponse>;
