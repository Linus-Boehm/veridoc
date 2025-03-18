import type {
  InsertInboundEmail,
  SelectInboundEmail,
} from '@repo/database/types';
import { InboundEmail } from '@taxel/domain/src/inboundEmail';
import { mapTimestampsToDomain } from '../type-mappers';

export const mapInboundEmailToDb = (
  inboundEmail: InboundEmail
): InsertInboundEmail => {
  // Get the full object with bodyText and bodyHtml by passing true to toJSON()
  const fullData = inboundEmail.toJSON(true);
  const { createdAt, updatedAt, archivedAt, documents, postbox, ...data } =
    fullData;

  // Convert date string to Date object if needed
  return {
    ...data,
    date: new Date(data.date),
  };
};

export const mapInboundEmailToDomain = (inboundEmail: SelectInboundEmail) => {
  // Convert Date object to string for the domain model
  const domainData = {
    ...inboundEmail,
    date: inboundEmail.date.toISOString(),
  };

  return new InboundEmail(
    domainData,
    inboundEmail.id,
    mapTimestampsToDomain(inboundEmail)
  );
};
