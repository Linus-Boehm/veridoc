import { validationMiddleware } from '@inngest/middleware-validation';
import { Inngest } from 'inngest';
import { schemas } from './events';

export const inngest = new Inngest({
  id: 'root',
  schemas,
});
