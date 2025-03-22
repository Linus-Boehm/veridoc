CREATE TYPE "public"."document_extraction_model" AS ENUM('invoice', 'generic');--> statement-breakpoint
ALTER TABLE "document_extractions" DROP CONSTRAINT "document_extractions_organizationId_documentId_unique";--> statement-breakpoint
ALTER TABLE "document_extractions" ADD COLUMN "extractionModel" "document_extraction_model" DEFAULT 'generic' NOT NULL;--> statement-breakpoint
ALTER TABLE "public"."documents" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint

ALTER TYPE "public"."document_types" ADD VALUE 'payment_confirmation';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'reminder';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'contract';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'order_confirmation';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'internal_communication';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'advertising_newsletter';--> statement-breakpoint
ALTER TYPE "public"."document_types" ADD VALUE 'other';--> statement-breakpoint
ALTER TYPE "public"."document_types" RENAME VALUE 'receipt' TO 'order';--> statement-breakpoint