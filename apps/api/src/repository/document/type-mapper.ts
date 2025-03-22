import type { InsertDocument, SelectDocument } from "@repo/database/types";
import { BaseDocument, Document } from "@taxel/domain/src/document";
import type { Timestamps } from "@taxel/domain/src/base";
import { mapTimestampsToDomain } from "../type-mappers";
import { removeTimestamps } from "../type-mappers";

export const mapDocumentToDomain = (document: SelectDocument): Document => {
  const timestamps: Timestamps = mapTimestampsToDomain(document);
  const doc: BaseDocument = {
    ...document,
    emailId: document.emailId ?? undefined,
  };
  return new Document(doc, document.id, timestamps);
};

export const mapDocumentToDb = (document: Document): InsertDocument => {
  const data = removeTimestamps(document);
  return {
    ...data,
    emailId: data.emailId ?? null,
  };
};