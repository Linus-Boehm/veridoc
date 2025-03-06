
import type { documentExtractions, documents, invoiceItems, invoices } from "./schema";

export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;
export type SelectInvoiceItem = typeof invoiceItems.$inferSelect;

export type InsertInvoice = typeof invoices.$inferInsert;
export type SelectInvoice = typeof invoices.$inferSelect;

export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;

export type InsertDocumentExtraction = typeof documentExtractions.$inferInsert;
export type SelectDocumentExtraction = typeof documentExtractions.$inferSelect;
