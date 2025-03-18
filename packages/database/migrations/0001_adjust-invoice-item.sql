ALTER TABLE "invoice_items" RENAME COLUMN "rawContent" TO "matchedRowContent";--> statement-breakpoint
ALTER TABLE "invoice_items" RENAME COLUMN "unitPrice" TO "unitPriceValue";--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "rowConfidence" numeric;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "unitPriceCurrencyCode" text;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "amountCurrencyCode" text;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD COLUMN "amountValue" numeric;--> statement-breakpoint
ALTER TABLE "invoice_items" DROP COLUMN "totalPrice";--> statement-breakpoint
ALTER TABLE "invoice_items" DROP COLUMN "totalPriceConfidence";--> statement-breakpoint
ALTER TABLE "invoice_items" DROP COLUMN "totalPriceMatchedContent";--> statement-breakpoint
ALTER TABLE "invoice_items" DROP COLUMN "amount";