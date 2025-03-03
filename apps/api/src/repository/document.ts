import { database } from "@repo/database";
import { documentExtractions, documents } from "@repo/database/schema";
import { Document, type ProcessingStatus } from '@taxel/domain/src/document';
import { eq, and } from "@repo/database/client";
import type { Timestamps } from "@taxel/domain/src/base";
export interface DocumentExtraction {
  id: string;
  organizationId: string;
  extractionResult: unknown;
  createdAt: Date;
  updatedAt: Date;
}

type SelectDocument = typeof documents.$inferSelect;

export const createNewDocument = async (
  createDocument: Document
): Promise<Document> => {
  const document = await database.insert(documents).values(
    {
      ...createDocument.toJSON(),
    }
  ).returning();
  return mapDocument(document[0]);
};

export const getDocumentByStorageKey = async (
  storagePath: string,
  organizationId: string
): Promise<Document | undefined> => {
  const document = await database.query.documents.findFirst({
    where: and(
      eq(documents.storagePath, storagePath),
      eq(documents.organizationId, organizationId)
    ),
  });
  return document ? mapDocument(document) : undefined;
};

export const updateDocumentProcessingStatus = async (
  documentId: string,
  processingStatus: ProcessingStatus
) => {
  await database
    .update(documents)
    .set({ processingStatus })
    .where(eq(documents.id, documentId));
};

export const createNewDocumentExtraction = async (
  organizationId: string,
  documentId: string,
  extractionResult: object
): Promise<DocumentExtraction> => {
  const documentExtraction = await database
    .insert(documentExtractions)
    .values({
      organizationId,
      documentId,
      extractionResult,
    })
    .returning();

  return documentExtraction[0];
};


const mapDocument = (document: SelectDocument): Document => {
  const timestamps: Timestamps = {
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    archivedAt: null,
  };
  return new Document(document, document.id, timestamps);
};