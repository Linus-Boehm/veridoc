
import type { documentExtractions, documents, inboundEmails, invoiceItems, invoices, postboxes } from "./schema";

export type InsertInvoiceItem = typeof invoiceItems.$inferInsert;
export type SelectInvoiceItem = typeof invoiceItems.$inferSelect;

export type InsertInvoice = typeof invoices.$inferInsert;
export type SelectInvoice = typeof invoices.$inferSelect;

export type InsertDocument = typeof documents.$inferInsert;
export type SelectDocument = typeof documents.$inferSelect;

export type InsertDocumentExtraction = typeof documentExtractions.$inferInsert;
export type SelectDocumentExtraction = typeof documentExtractions.$inferSelect;

export type InsertPostbox = typeof postboxes.$inferInsert;
export type SelectPostbox = typeof postboxes.$inferSelect;

export type InsertInboundEmail = typeof inboundEmails.$inferInsert;
export type SelectInboundEmail = typeof inboundEmails.$inferSelect;
