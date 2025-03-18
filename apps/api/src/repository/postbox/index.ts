import { database } from "@repo/database";
import { postboxes } from "@repo/database/schema";
import { mapPostboxToDb, mapPostboxToDomain } from './type-mapper';
import type { Postbox } from '@taxel/domain/src/postbox';
import { and, eq, type SQL } from '@repo/database/client';

export interface FindByIdOptions {
  organizationId?: string;
}

export class PostboxRepository {
  async create(postbox: Postbox) {
    const result = await database.insert(postboxes).values(mapPostboxToDb(postbox)).returning();
    return mapPostboxToDomain(result[0]);
  }

  async findById(id: string, opts: FindByIdOptions = {}): Promise<Postbox | undefined> {
    const where: SQL[] = [eq(postboxes.id, id)];
    if (opts.organizationId) {
      where.push(eq(postboxes.organizationId, opts.organizationId));
    }
    const result = await database.query.postboxes.findFirst({
      where: and(...where),
    });
    return result ? mapPostboxToDomain(result) : undefined;
  }

  async listByOrganizationId(organizationId: string): Promise<Postbox[]> {
    const result = await database.query.postboxes.findMany({
      where: eq(postboxes.organizationId, organizationId),
    });
    return result.map(mapPostboxToDomain);
  }

  async findByPostmarkId(postmarkId: number): Promise<Postbox | undefined> {
    const result = await database.query.postboxes.findFirst({
      where: eq(postboxes.postmarkServerId, postmarkId),
    });
    return result ? mapPostboxToDomain(result) : undefined;
  }
}
