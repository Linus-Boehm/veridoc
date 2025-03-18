import { Hono } from 'hono';

import type { InvoiceDTO } from '@taxel/domain/src/invoice';
import { InvoiceService } from '#src/service/invoices/invoice.ts';
import { ensureAuthenticated, getAppContext } from '../middleware/auth';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
const app = new Hono().use(ensureAuthenticated).get('/', async (c) => {
  const ctx = getAppContext(c);

  const service = new InvoiceService();
  const invoices = await service.findAll(ctx);

  return c.json<InvoiceDTO[]>(
    invoices.map((invoice) => invoice.toJSON()),
    200
  );
}).get('/:invoiceId', zValidator('param', z.object({
  invoiceId: z.string().uuid(),
})), async (c) => {
  const ctx = getAppContext(c);
  const service = new InvoiceService();
  const { invoiceId } = c.req.valid('param');
  const invoice = await service.findById(ctx, invoiceId);
  return c.json<InvoiceDTO>(invoice.toJSON(), 200);
});

export default app;
