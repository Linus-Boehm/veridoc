import type {
  documents,
  inboundEmails,
  postboxes,
} from '@repo/database/schema';
import type { InsertInboundEmail } from '@repo/database/types';
import { Document } from '@taxel/domain/src/document';
import { InboundEmail } from '@taxel/domain/src/inboundEmail';
import { Postbox } from '@taxel/domain/src/postbox';
import { removeTimestamps } from '../type-mappers';

type InboundEmailWithRelations = typeof inboundEmails.$inferSelect & {
  documents?: (typeof documents.$inferSelect)[];
  postbox?: typeof postboxes.$inferSelect;
};

export function mapInboundEmailToDomain(
  dbModel: InboundEmailWithRelations
): InboundEmail {
  const { id, createdAt, updatedAt, archivedAt, archivedBy, ...props } =
    dbModel;

  // Map documents if they exist
  const documentEntities = dbModel.documents
    ? dbModel.documents.map(
        (doc) =>
          new Document(
            {
              organizationId: doc.organizationId,
              fileName: doc.fileName,
              storagePath: doc.storagePath,
              emailId: doc.emailId || undefined,
              processingStatus: doc.processingStatus,
              type: doc.type,
            },
            doc.id,
            {
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
              archivedAt: null,
            }
          )
      )
    : [];

  // Map postbox if it exists
  const postboxEntity = dbModel.postbox
    ? new Postbox(
        {
          name: dbModel.postbox.name,
          organizationId: dbModel.postbox.organizationId,
          postmarkServerId: dbModel.postbox.postmarkServerId,
          postmarkInboundEmail: dbModel.postbox.postmarkInboundEmail,
        },
        dbModel.postbox.id,
        {
          createdAt: dbModel.postbox.createdAt,
          updatedAt: dbModel.postbox.updatedAt,
          archivedAt: null,
        }
      )
    : undefined;

  return new InboundEmail(
    {
      organizationId: props.organizationId,
      postboxId: props.postboxId,
      from: props.from,
      fromName: props.fromName,
      to: props.to,
      subject: props.subject,
      bodyText: props.bodyText,
      bodyHtml: props.bodyHtml,
      date: props.date.toISOString(),
      messageId: props.messageId,
      cc: props.cc,
      bcc: props.bcc,
      status: props.status,
    },
    id,
    {
      createdAt,
      updatedAt,
      archivedAt,
    },
    documentEntities,
    postboxEntity
  );
}

export function mapInboundEmailToDb(
  inboundEmail: InboundEmail
): InsertInboundEmail {
  const data = removeTimestamps(inboundEmail);
  const { createdAt, updatedAt, archivedAt } = inboundEmail.getTimestamps();

  // Ensure bodyText and bodyHtml are always non-null strings
  // This is required because inboundEmail.toJSON() may exclude these fields
  // when withDetails=false, but the database schema requires them to be NOT NULL
  // Access directly from the full entity JSON with withDetails=true
  const fullData = inboundEmail.toJSON(true);

  return {
    ...data,
    bodyText: data.bodyText ?? fullData.bodyText ?? '',
    bodyHtml: data.bodyHtml ?? fullData.bodyHtml ?? '',
    date: new Date(data.date),
    archivedAt,
  };
}
