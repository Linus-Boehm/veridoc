ALTER TABLE "invoices" ADD COLUMN "subTotal" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "subTotalCurrencyCode" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "subTotalConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "subTotalMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "totalTax" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "totalTaxCurrencyCode" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "totalTaxConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "totalTaxMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceNumber" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceNumberConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceNumberMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedVendorName" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedVendorNameConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedVendorNameMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceDate" date;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceDateConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceDateMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paymentTerm" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paymentTermConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "paymentTermMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendorTaxId" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendorTaxIdConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendorTaxIdMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedCustomerName" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedCustomerNameConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedCustomerNameMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceTotal" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceTotalCurrencyCode" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceTotalConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoiceTotalMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customerTaxId" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customerTaxIdConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customerTaxIdMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedPurchaseOrderNumber" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedPurchaseOrderNumberConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "matchedPurchaseOrderNumberMatchedContent" text;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dueDate";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dueDateConfidence";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "dueDateMatchedValue";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "creditorInvoiceNumber";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "creditorInvoiceNumberConfidence";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "creditorInvoiceNumberMatchedValue";