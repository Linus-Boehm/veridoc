import type { AppContext } from '../../domain/context';
import { createNewDocument } from '../../repository/document';
import { getSignedGetUrl, getSignedPutUrl } from '@repo/storage/server';
import { v7 as uuidv7 } from 'uuid';
import { Document } from '@taxel/domain/src/document';

export const createDocument = async (ctx: AppContext, fileName: string) => {
  const { organization, user } = ctx;

  const key = `${organization.id}/${uuidv7()}/${fileName}`;

  const newDocument = new Document({
    organizationId: organization.id,
    fileName,
    storagePath: key,
    type: 'invoice',
    processingStatus: 'waiting_for_upload',
  });

  const documentPromise = createNewDocument(newDocument);

  const putUrlPromise = getSignedPutUrl(key);
  const getUrlPromise = getSignedGetUrl(key);

  const [document, putUrl, getUrl] = await Promise.all([
    documentPromise,
    putUrlPromise,
    getUrlPromise,
  ]);

  document.setStorageResource({
    putUrl,
    getUrl,
  });

  return document;
};
