import type { AppContext } from '../../domain/context';
import { DocumentRepository } from '../../repository/document';
import { getSignedGetUrl, getSignedPutUrl } from '@repo/storage/server';
import { v7 as uuidv7 } from 'uuid';
import { Document, StorageResource } from '@taxel/domain/src/document';

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

  const repo = new DocumentRepository();

  const documentPromise = repo.create(newDocument);

  const resource = await getStorageResourceForKey(key);

  const document = await documentPromise;

  document.setStorageResource(resource);

  return document;
};


export const getStorageResourceForKey = async (
  key: string
): Promise<StorageResource> => {
  const putUrlPromise = getSignedPutUrl(key);
  const getUrlPromise = getSignedGetUrl(key);

  const [putUrl, getUrl] = await Promise.all([
    putUrlPromise,
    getUrlPromise,
  ]);

  return { putUrl, getUrl };
};
