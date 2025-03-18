import { documents, invoices } from "@repo/database/schema";
import { mapInvoiceItemToDomain, mapInvoiceToDomain } from "./type-mapper";
import { database } from "@repo/database";
import { Invoice } from "@taxel/domain/src/invoice";
import { mapInvoiceItemToDb, mapInvoiceToDb } from "./type-mapper";
import { invoiceItems } from "@repo/database/schema";
import { and, eq, gt, type SQL } from "@repo/database/client";
import type { Pagination } from "../base";


export interface FindInvoiceByIdOptions {
    organizationId?: string;
}

export interface ListInvoicesOptions {
  organizationId?: string;
  pagination?: Pagination;
}

export class InvoiceRepository {
  async create(newInvoice: Invoice): Promise<Invoice> {
    const result = await database.transaction(async (tx) => {
      const invoiceData = newInvoice.toJSON();
      const invoiceModel = await tx
        .insert(invoices)
        .values(mapInvoiceToDb(newInvoice))
        .returning();

      const items = newInvoice.items.map((item) =>
        mapInvoiceItemToDb(invoiceModel[0].id, item)
      );
      let invoiceItemsModels: typeof invoiceItems.$inferSelect[] = [];
      if(items.length > 0) {
        invoiceItemsModels = await tx
          .insert(invoiceItems)
          .values(items)
          .returning();
      }
      
      const documentModel = await tx.select().from(documents).where(and(eq(documents.id, newInvoice.documentId), eq(documents.organizationId, invoiceData.organizationId))).limit(1);
      return {
        invoice: invoiceModel[0],
        invoiceItems: invoiceItemsModels,
        document: documentModel[0],
      };
    });

    const invoice = mapInvoiceToDomain({...result.invoice, document: result.document, items: result.invoiceItems});

    return invoice;
  }

  async findById(
    id: string,
    opts: FindInvoiceByIdOptions = {}
  ): Promise<Invoice | null> {
    const where: SQL[] = [eq(invoices.id, id)];
    if (opts.organizationId) {
      where.push(eq(invoices.organizationId, opts.organizationId));
    }
    const invoice = await database.query.invoices.findFirst({
      where: and(...where),
      with: {
        items: true,
        document: true,
      },
    });
    return invoice ? mapInvoiceToDomain(invoice) : null;
  }

  async list(opts: ListInvoicesOptions = {}): Promise<Invoice[]> {
    if( opts.pagination?.limit && opts.pagination.limit > 1000) {
        throw new Error("Limit is too large");
    }
    const where: SQL[] = [];
    if (opts.organizationId) {
      where.push(eq(invoices.organizationId, opts.organizationId));
    }
    if(opts.pagination?.idPointer) {
      where.push(gt(invoices.id, opts.pagination.idPointer));
    }
    const newInvoices = await database.query.invoices.findMany({
      where: and(...where),
      limit: opts.pagination?.limit ?? 100,
      with: {
        items: true,
        document: true,
      },
      orderBy: (invoices, { desc }) => [desc(invoices.id)],
    });
    return newInvoices.map((invoice) => mapInvoiceToDomain(invoice));
  }
}
