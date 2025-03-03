import { Hono } from 'hono';

import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createDocument } from '../../service/documents/create_document';
import { onDocumentUploaded } from '../../service/documents/document_processing';
import { ensureAuthenticated, getAppContext } from '../middleware/auth';

const CreateDocumentUploadSchema = z.object({
  file_name: z.string().min(1),
});

const CreateDocumentUploadAcknoledgeSchema = z.object({
  key: z.string().min(1),
});

const app = new Hono()
  .use(ensureAuthenticated)
  .post(
    '/uploads',
    zValidator('json', CreateDocumentUploadSchema),
    async (c) => {
      const { file_name } = c.req.valid('json');

      const ctx = getAppContext(c);

      const document = await createDocument(ctx, file_name);

      return c.json(document.toJSON(), 201);
    }
  )
  .post(
    '/upload-acknoledge',
    zValidator('json', CreateDocumentUploadAcknoledgeSchema),
    async (c) => {
      // This is not at all restful, we would like to use a event here from the storage provider that triggers then the processing of the document
      const { key } = c.req.valid('json');

      const ctx = getAppContext(c);

      await onDocumentUploaded(ctx, key);

      return c.json({ message: 'Document uploaded' }, 201);
    }
  );

export default app;
