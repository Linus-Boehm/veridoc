import { database } from "@repo/database";
import { invoices, invoiceItems } from "@repo/database/schema";
import type { Invoice, InvoiceItem } from '@taxel/domain/src/invoice';
import type { InsertInvoiceItem } from '@repo/database/types';
export const createInvoice = async (newInvoice: Invoice) => {
    database.transaction(async (tx) => {
        const invoiceData = newInvoice.toJSON();
        const invoice = await tx
          .insert(invoices)
          .values({
            organizationId: invoiceData.organizationId,
            documentId: newInvoice.documentId,
          })
          .returning();
    });
};


/*const mapInvoiceItemToDb = (invoiceId: string, invoiceItem: InvoiceItem): InsertInvoiceItem[] => {
  return {
    invoiceId,
    organizationId: invoiceItem.organizationId,
    position: invoiceItem.position,
    rawContent: invoiceItem.rawContent,
    description: invoiceItem.description,
    descriptionConfidence: invoiceItem.descriptionConfidence,
    descriptionMatchedContent: invoiceItem.descriptionMatchedContent,
  };
};
*/