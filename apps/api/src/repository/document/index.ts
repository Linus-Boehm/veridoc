import { database } from '@repo/database';
import { and, eq } from '@repo/database/client';
import { documentExtractions, documents } from '@repo/database/schema';
import type {
  InsertDocumentExtraction,
  SelectDocumentExtraction,
} from '@repo/database/types';
import type { Document, ProcessingStatus } from '@taxel/domain/src/document';
import { NotFoundError } from '@taxel/domain/src/errors/not-found';
import { mapDocumentToDb, mapDocumentToDomain } from './type-mapper';

export class DocumentRepository {
  async create(createDocument: Document): Promise<Document> {
    const data = mapDocumentToDb(createDocument);
    const document = await database.insert(documents).values(data).returning();
    return mapDocumentToDomain(document[0]);
  }

  async batchCreate(createDocuments: Document[]): Promise<Document[]> {
    const data = createDocuments.map(mapDocumentToDb);
    const result = await database.insert(documents).values(data).returning();
    return result.map(mapDocumentToDomain);
  }

  async findByStoragePath(
    storagePath: string,
    organizationId: string
  ): Promise<Document> {
    const document = await database.query.documents.findFirst({
      where: and(
        eq(documents.storagePath, storagePath),
        eq(documents.organizationId, organizationId)
      ),
    });
    if (!document) {
      throw new NotFoundError(
        `Document with storage path ${storagePath} not found`
      );
    }
    return mapDocumentToDomain(document);
  }

  async findById(documentId: string): Promise<Document | undefined> {
    const document = await database.query.documents.findFirst({
      where: eq(documents.id, documentId),
    });
    return document ? mapDocumentToDomain(document) : undefined;
  }

  async updateProcessingStatus(
    documentId: string,
    processingStatus: ProcessingStatus
  ): Promise<Document> {
    const document = await database
      .update(documents)
      .set({ processingStatus })
      .where(eq(documents.id, documentId))
      .returning();
    if (!document) {
      throw new NotFoundError(`Document with id ${documentId} not found`);
    }
    return mapDocumentToDomain(document[0]);
  }

  async createExtraction(
    createExtraction: InsertDocumentExtraction
  ): Promise<SelectDocumentExtraction> {
    const extraction = await database
      .insert(documentExtractions)
      .values(createExtraction)
      .returning();
    return extraction[0];
  }
}
