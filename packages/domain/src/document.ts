import { z } from 'zod';
import { Entity, timestampDTOSchema, type Timestamps, timestampsSchema } from '#base.ts';

export const processingStatusSchema = z.enum([
  'waiting_for_upload',
  'processing',
  'completed',
  'failed',
]);

export const documentTypesSchema = z.enum(['invoice', 'receipt', 'unknown']);
export type ProcessingStatus = z.infer<typeof processingStatusSchema>;
export type DocumentType = z.infer<typeof documentTypesSchema>;

export const storageResourceSchema = z.object({
  putUrl: z.string().url(),
  getUrl: z.string().url(),
});

export type StorageResource = z.infer<typeof storageResourceSchema>;

export const baseDocumentSchema = z.object({
  organizationId: z.string().uuid(),
  fileName: z.string(),
  storagePath: z.string(),
  emailId: z.string().optional(),
  processingStatus: processingStatusSchema,
  type: documentTypesSchema,
});

export const documentSchema = baseDocumentSchema
  .extend({
    id: z.string().uuid(),
    storageResource: storageResourceSchema.optional(),
  })
  .extend(timestampDTOSchema.shape);

export type DocumentDTO = z.infer<typeof documentSchema>;

export type BaseDocument = z.infer<typeof baseDocumentSchema>;

export class Document extends Entity<BaseDocument> {
  private _storageResource: StorageResource | undefined;

  constructor(props: BaseDocument);
  constructor(
    props: BaseDocument,
    id: string,
    timestamps: Timestamps,
    storageResource?: StorageResource
  );

  constructor(
    props: BaseDocument,
    id?: string,
    timestamps?: Timestamps,
    storageResource?: StorageResource
  ) {
    if (id && timestamps) {
      super(props, id, timestamps);
    } else {
      super(props);
    }
    this._storageResource = storageResource;
  }

  getStorageResource() {
    return this._storageResource;
  }

  setStorageResource(storageResource: StorageResource) {
    this._storageResource = storageResource;
  }

  startProcessing() {
    this.props.processingStatus = 'processing';
  }

  completeProcessing() {
    this.props.processingStatus = 'completed';
  }

  failProcessing() {
    this.props.processingStatus = 'failed';
  }

  getStoragePath() {
    return this.props.storagePath;
  }

  getOrganizationId() {
    return this.props.organizationId;
  }

  toJSON(): DocumentDTO {
    return {
      ...super.toJSON(),
      storageResource: this._storageResource,
    };
  }
}
