import type { AppContext } from '../../domain/context';
import { createNewDocumentExtraction, getDocumentByStorageKey, updateDocumentProcessingStatus } from '../../repository/document';
import { extractDocumentFromUrl } from '@repo/ai/lib/extraction';
import { getSignedGetUrl } from '@repo/storage/server';

const getFileNameFromKey = (key: string) => {
  return key.split('/').pop();
};

export const onDocumentUploaded = async (ctx: AppContext, key: string) => {
  const url = await getSignedGetUrl(key);
  const document = await getDocumentByStorageKey(key, ctx.organization.id);

  if (!document) {
    throw new Error('Document not found');
  }
  try {
  const updatePromise = updateDocumentProcessingStatus(document.id, 'processing');
  const extracted = await extractDocumentFromUrl(url, ctx.organization.id, document.id);
  const documentExtractionPromise = createNewDocumentExtraction(
    ctx.organization.id,
    document.id,
    extracted || {}
  );

  await Promise.all([updatePromise, documentExtractionPromise]);
    await updateDocumentProcessingStatus(document.id, 'completed');
  } catch (error) {
    await updateDocumentProcessingStatus(document.id, 'failed');
    throw error;
  }
};
