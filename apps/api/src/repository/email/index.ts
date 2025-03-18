import { database } from "@repo/database";
import { inboundEmails } from "@repo/database/schema";
import { InboundEmail } from "@taxel/domain/src/inboundEmail";
import { mapInboundEmailToDb, mapInboundEmailToDomain } from "./type-mapper";
import { and, eq, inArray, SQL } from "@repo/database/client";

export interface FindByIdOptions {
  organizationId?: string;
}

export interface ListOptions {
  postBoxIds?: string[];
  organizationId: string;
}

export class EmailRepository {
  async create(inboundEmail: InboundEmail) {
    const result = await database
      .insert(inboundEmails)
      .values(mapInboundEmailToDb(inboundEmail))
      .returning();
    return mapInboundEmailToDomain(result[0]);
  }

  async findById(
    id: string,
    opts: FindByIdOptions = {}
  ): Promise<InboundEmail | undefined> {
    const where: SQL[] = [eq(inboundEmails.id, id)];
    if (opts.organizationId) {
      where.push(eq(inboundEmails.organizationId, opts.organizationId));
    }
    const result = await database.query.inboundEmails.findFirst({
      where: and(...where),
    });
    return result ? mapInboundEmailToDomain(result) : undefined;
  }

  async list(opts: ListOptions): Promise<InboundEmail[]> {
    const where: SQL[] = [eq(inboundEmails.organizationId, opts.organizationId)];
    if (opts.postBoxIds) {
      where.push(inArray(inboundEmails.postboxId, opts.postBoxIds));
    }
    const result = await database.query.inboundEmails.findMany({
      where: and(...where),
    });
    return result.map(mapInboundEmailToDomain);
  }

}