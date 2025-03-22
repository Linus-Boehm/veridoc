import { z } from 'zod';
import { Entity, type Timestamps, baseDTOschema } from '#base.ts';
import { type Document, documentSchema } from './document';
import { type Postbox, postBoxDTOschema } from './postbox';

export const emailStatusSchema = z.enum([
  'received',
  'processed',
  'partial_processed',
  'failed',
  'archived',
]);

export type EmailStatus = z.infer<typeof emailStatusSchema>;

export const inboundEmailSchema = z.object({
  organizationId: z.string().uuid(),
  postboxId: z.string().uuid(),
  from: z.string(),
  fromName: z.string(),
  to: z.string(),
  subject: z.string(),
  bodyText: z.string().default(''),
  bodyHtml: z.string().default(''),
  date: z.string().datetime(),
  messageId: z.string(),
  cc: z.string().default(''),
  bcc: z.string().default(''),
  status: emailStatusSchema.default('received'),
});

export type InboundEmailBase = z.infer<typeof inboundEmailSchema>;

export class InboundEmail extends Entity<InboundEmailBase> {
  private _documents: Document[] = [];
  private _postbox?: Postbox;

  constructor(props: InboundEmailBase);
  constructor(
    props: InboundEmailBase,
    id: string,
    timestamps: Timestamps,
    documents?: Document[],
    postbox?: Postbox
  );

  constructor(
    props: InboundEmailBase,
    id?: string,
    timestamps?: Timestamps,
    documents?: Document[],
    postbox?: Postbox
  ) {
    if (id && timestamps) {
      super(props, id, timestamps);
    } else {
      super(props);
    }
    this._documents = documents || [];
    this._postbox = postbox;
  }

  getDocuments(): Document[] {
    return this._documents;
  }

  setDocuments(documents: Document[]): void {
    this._documents = documents;
  }

  getPostbox(): Postbox | undefined {
    return this._postbox;
  }

  setPostbox(postbox: Postbox): void {
    this._postbox = postbox;
  }

  getStatus(): EmailStatus {
    return this.props.status;
  }

  setStatus(status: EmailStatus): void {
    this.props.status = status;
  }

  archive(): void {
    this.timestamps.archivedAt = new Date();
    this.setStatus('archived');
  }

  isArchived(): boolean {
    return !!this.timestamps.archivedAt;
  }

  updateStatusBasedOnDocuments(): void {
    if (this.isArchived()) {
      return; // Keep archived status if already archived
    }

    if (!this._documents || this._documents.length === 0) {
      this.setStatus('received');
      return;
    }

    const statuses = this._documents.map((doc) => doc.getProcessingStatus());

    if (statuses.every((status) => status === 'completed')) {
      this.setStatus('processed');
    } else if (statuses.some((status) => status === 'failed')) {
      this.setStatus('failed');
    } else if (
      statuses.some((status) => status === 'completed') &&
      statuses.some((status) => status !== 'completed')
    ) {
      this.setStatus('partial_processed');
    } else {
      this.setStatus('received');
    }
  }

  toJSON(withDetails = false): InboundEmailDTO {
    const baseJson = super.toJSON();

    // Create a new object with only the fields we want to include
    const result: InboundEmailDTO = {
      ...baseJson,
      documents: this._documents.map((doc) => doc.toJSON()),
      postbox: this._postbox?.toJSON(),
    };

    // Instead of using delete, create a new object without the fields if not needed
    if (!withDetails) {
      const { bodyText, bodyHtml, ...rest } = result;
      return rest as InboundEmailDTO;
    }

    return result;
  }
}

export const inboundEmailDTOschema = inboundEmailSchema.extend({
  ...baseDTOschema.shape,
  documents: z.array(documentSchema).optional(),
  postbox: postBoxDTOschema.optional(),
});

export type InboundEmailDTO = z.infer<typeof inboundEmailDTOschema>;
