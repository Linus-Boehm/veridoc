import { database } from '@repo/database';
import { log } from '@repo/observability/log';
import { Hono } from 'hono';

const app = new Hono().get('/health', async (c) => {
  try {
    await database.execute('select 1');
    return c.json({ message: 'Application is healthy' }, 200);
  } catch (error) {
    log.error('Database is unhealthy', { error });
    return c.json({ message: 'Database is unhealthy' }, 500);
  }
});

export default app;