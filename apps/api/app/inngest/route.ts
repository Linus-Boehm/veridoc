import { serve } from 'inngest/next';
import { inngest } from '#src/service/jobs/inngest/client.ts';
import { functions } from '#src/service/jobs/index.ts';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions,
});