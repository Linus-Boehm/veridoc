import { database } from '@repo/database';
import { type SQL, and, eq, gt, isNull } from '@repo/database/client';
import { inboundEmails } from '@repo/database/schema';
import type { EmailStatus, InboundEmail } from '@taxel/domain/src/inboundEmail';
import type { Pagination } from '../base';
import { mapInboundEmailToDb, mapInboundEmailToDomain } from './type-mapper';

export interface FindInboundEmailByIdOptions {
  organizationId?: string;
}

export interface ListInboundEmailsOptions {
  organizationId?: string;
  pagination?: Pagination;
  includeArchived?: boolean;
}

export class InboundEmailRepository {
  async create(inboundEmail: InboundEmail): Promise<InboundEmail> {
    const result = await database
      .insert(inboundEmails)
      .values(mapInboundEmailToDb(inboundEmail))
      .returning();
    return mapInboundEmailToDomain(result[0]);
  }

  
  async findById(
    id: string,
    opts: FindInboundEmailByIdOptions = {}
  ): Promise<InboundEmail | null> {
    const where: SQL[] = [eq(inboundEmails.id, id)];
    if (opts.organizationId) {
      where.push(eq(inboundEmails.organizationId, opts.organizationId));
    }

    // Query with relations
    const result = await database.query.inboundEmails.findFirst({
      where: and(...where),
      with: {
        postbox: true,
        documents: true,
      },
    });

    if (!result) {
      return null;
    }

    return mapInboundEmailToDomain(result);
  }

  async list(opts: ListInboundEmailsOptions = {}): Promise<InboundEmail[]> {
    if (opts.pagination?.limit && opts.pagination.limit > 1000) {
      throw new Error('Limit is too large');
    }

    const where: SQL[] = [];
    if (opts.organizationId) {
      where.push(eq(inboundEmails.organizationId, opts.organizationId));
    }

    // Only include non-archived emails by default
    if (!opts.includeArchived) {
      where.push(isNull(inboundEmails.archivedAt));
    }

    if (opts.pagination?.idPointer) {
      where.push(gt(inboundEmails.id, opts.pagination.idPointer));
    }

    // Query emails with relations
    const emails = await database.query.inboundEmails.findMany({
      where: and(...where),
      limit: opts.pagination?.limit ?? 100,
      with: {
        postbox: true,
        documents: true,
      },
      orderBy: (emails, { desc }) => [desc(emails.createdAt)],
    });

    // Map to domain models
    return emails.map((email) => mapInboundEmailToDomain(email));
  }

  async archive(
    id: string,
    organizationId: string,
    userId?: string
  ): Promise<InboundEmail | null> {
    const now = new Date();

    const updateData: { archivedAt: Date; archivedBy?: string } = {
      archivedAt: now,
    };
    if (userId) {
      updateData.archivedBy = userId;
    }

    const [updatedEmail] = await database
      .update(inboundEmails)
      .set(updateData)
      .where(
        and(
          eq(inboundEmails.id, id),
          eq(inboundEmails.organizationId, organizationId)
        )
      )
      .returning();

    if (!updatedEmail) {
      return null;
    }

    // Fetch the complete email with relations
    return this.findById(id, { organizationId });
  }

  async updateStatus(
    id: string,
    status: EmailStatus,
    organizationId: string
  ): Promise<InboundEmail | null> {
    const [updatedEmail] = await database
      .update(inboundEmails)
      .set({ status })
      .where(
        and(
          eq(inboundEmails.id, id),
          eq(inboundEmails.organizationId, organizationId)
        )
      )
      .returning();

    if (!updatedEmail) {
      return null;
    }

    // Fetch the complete email with relations
    return this.findById(id, { organizationId });
  }
}
