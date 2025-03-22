
import type { addresses, bankAccounts, companies, companyAddresses, companyDomains, documentExtractions, documents, inboundEmails, industries, invoiceItems, invoices, postboxes } from "./schema";

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

export type InsertCompany = typeof companies.$inferInsert;
export type SelectCompany = typeof companies.$inferSelect;

export type InsertCompanyAddress = typeof companyAddresses.$inferInsert;
export type SelectCompanyAddress = typeof companyAddresses.$inferSelect;

export type InsertCompanyDomain = typeof companyDomains.$inferInsert;
export type SelectCompanyDomain = typeof companyDomains.$inferSelect;

export type InsertBankAccount = typeof bankAccounts.$inferInsert;
export type SelectBankAccount = typeof bankAccounts.$inferSelect;

export type InsertIndustry = typeof industries.$inferInsert;
export type SelectIndustry = typeof industries.$inferSelect;

export type InsertAddress = typeof addresses.$inferInsert;
export type SelectAddress = typeof addresses.$inferSelect;
