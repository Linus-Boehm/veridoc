CREATE TYPE "public"."document_processing_status" AS ENUM('waiting_for_upload', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."document_types" AS ENUM('invoice', 'receipt', 'unknown');--> statement-breakpoint
CREATE TABLE "document_extractions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"documentId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"extractionResult" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_extractions_documentId_organizationId_unique" UNIQUE("documentId","organizationId")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"fileName" text NOT NULL,
	"storagePath" text NOT NULL,
	"type" "document_types" DEFAULT 'unknown' NOT NULL,
	"processingStatus" "document_processing_status" DEFAULT 'waiting_for_upload' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_storagePath_unique" UNIQUE("storagePath"),
	CONSTRAINT "documents_id_organizationId_unique" UNIQUE("id","organizationId")
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"invoiceId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"position" integer NOT NULL,
	"rawContent" text,
	"description" text,
	"descriptionConfidence" numeric,
	"descriptionMatchedContent" text,
	"unit" text,
	"unitConfidence" numeric,
	"unitMatchedContent" text,
	"quantity" numeric,
	"quantityConfidence" numeric,
	"quantityMatchedContent" text,
	"unitPrice" numeric,
	"unitPriceConfidence" numeric,
	"unitPriceMatchedContent" text,
	"totalPrice" numeric,
	"totalPriceConfidence" numeric,
	"totalPriceMatchedContent" text,
	"amount" numeric,
	"amountConfidence" numeric,
	"amountMatchedContent" text,
	"taxAmount" numeric,
	"taxCurrencyCode" text,
	"taxAmountConfidence" numeric,
	"taxAmountMatchedContent" text,
	"taxRate" numeric,
	"taxRateConfidence" numeric,
	"taxRateMatchedContent" text,
	"productCode" text,
	"productCodeConfidence" numeric,
	"productCodeMatchedContent" text,
	"date" date,
	"dateConfidence" numeric,
	"dateMatchedContent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"documentId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"dueDate" date,
	"dueDateConfidence" numeric,
	"dueDateMatchedValue" date,
	"creditorInvoiceNumber" text,
	"creditorInvoiceNumberConfidence" numeric,
	"creditorInvoiceNumberMatchedValue" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_documentId_unique" UNIQUE("documentId"),
	CONSTRAINT "invoices_id_organizationId_unique" UNIQUE("id","organizationId")
);
--> statement-breakpoint
CREATE TABLE "organization_memberships" (
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"clerkId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_memberships_user_id_organization_id_pk" PRIMARY KEY("user_id","organization_id"),
	CONSTRAINT "organization_memberships_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"clerkId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug"),
	CONSTRAINT "organizations_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"firstName" text,
	"lastName" text,
	"email" text NOT NULL,
	"clerkId" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId")
);
--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_documentId_organizationId_documents_id_organizationId_fk" FOREIGN KEY ("documentId","organizationId") REFERENCES "public"."documents"("id","organizationId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_organizationId_invoices_id_organizationId_fk" FOREIGN KEY ("invoiceId","organizationId") REFERENCES "public"."invoices"("id","organizationId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_documentId_organizationId_documents_id_organizationId_fk" FOREIGN KEY ("documentId","organizationId") REFERENCES "public"."documents"("id","organizationId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;