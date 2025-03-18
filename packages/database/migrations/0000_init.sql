CREATE TYPE "public"."address_types" AS ENUM('billing', 'shipping', 'headquarters', 'branch', 'other');--> statement-breakpoint
CREATE TYPE "public"."document_processing_status" AS ENUM('waiting_for_upload', 'processing', 'completed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."document_types" AS ENUM('invoice', 'receipt', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."email_status" AS ENUM('received', 'processed', 'partial_processed', 'failed', 'archived');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"addressName" text,
	"addressLine1" text NOT NULL,
	"addressLine2" text,
	"administrativeArea" text,
	"locality" text,
	"postalCode" text NOT NULL,
	"countryCode" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archivedAt" timestamp with time zone,
	"archived_by" uuid,
	CONSTRAINT "addresses_organizationId_id_unique" UNIQUE("organizationId","id")
);
--> statement-breakpoint
CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"companyId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"accountName" text NOT NULL,
	"accountHolderName" text NOT NULL,
	"iban" text,
	"bic" text,
	"bankName" text,
	"routingNumber" text,
	"accountNumber" text,
	"currencyCode" text,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archivedAt" timestamp with time zone,
	"archived_by" uuid
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"name" text NOT NULL,
	"countryCode" text NOT NULL,
	"vatId" text,
	"industryId" uuid,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archivedAt" timestamp with time zone,
	"archived_by" uuid,
	CONSTRAINT "companies_organizationId_id_unique" UNIQUE("organizationId","id")
);
--> statement-breakpoint
CREATE TABLE "company_addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"companyId" uuid NOT NULL,
	"addressId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"type" "address_types" DEFAULT 'other' NOT NULL,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "company_addresses_organizationId_companyId_addressId_unique" UNIQUE("organizationId","companyId","addressId")
);
--> statement-breakpoint
CREATE TABLE "company_domains" (
	"id" uuid PRIMARY KEY NOT NULL,
	"companyId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"domain" text NOT NULL,
	"isPrimary" boolean DEFAULT false NOT NULL,
	"isVerified" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archivedAt" timestamp with time zone,
	"archived_by" uuid,
	CONSTRAINT "company_domains_organizationId_domain_unique" UNIQUE("organizationId","domain")
);
--> statement-breakpoint
CREATE TABLE "document_extractions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"documentId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"extractionResult" jsonb NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_extractions_organizationId_documentId_unique" UNIQUE("organizationId","documentId")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organizationId" uuid NOT NULL,
	"emailId" uuid,
	"fileName" text NOT NULL,
	"storagePath" text NOT NULL,
	"type" "document_types" DEFAULT 'unknown' NOT NULL,
	"processingStatus" "document_processing_status" DEFAULT 'waiting_for_upload' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "documents_storagePath_unique" UNIQUE("storagePath"),
	CONSTRAINT "documents_organizationId_id_unique" UNIQUE("organizationId","id")
);
--> statement-breakpoint
CREATE TABLE "inbound_emails" (
	"id" uuid PRIMARY KEY NOT NULL,
	"postboxId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"from" text NOT NULL,
	"fromName" text NOT NULL,
	"to" text NOT NULL,
	"cc" text NOT NULL,
	"bcc" text NOT NULL,
	"subject" text NOT NULL,
	"messageId" text NOT NULL,
	"bodyText" text NOT NULL,
	"bodyHtml" text NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"status" "email_status" DEFAULT 'received' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"archivedAt" timestamp with time zone,
	"archived_by" uuid,
	CONSTRAINT "inbound_emails_organizationId_id_unique" UNIQUE("organizationId","id")
);
--> statement-breakpoint
CREATE TABLE "industries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "industries_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "invoice_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"invoiceId" uuid NOT NULL,
	"organizationId" uuid NOT NULL,
	"position" integer NOT NULL,
	"matchedRowContent" text,
	"rowConfidence" numeric,
	"description" text,
	"descriptionConfidence" numeric,
	"descriptionMatchedContent" text,
	"unit" text,
	"unitConfidence" numeric,
	"unitMatchedContent" text,
	"quantity" numeric,
	"quantityConfidence" numeric,
	"quantityMatchedContent" text,
	"unitPriceValue" numeric,
	"unitPriceCurrencyCode" text,
	"unitPriceConfidence" numeric,
	"unitPriceMatchedContent" text,
	"amountCurrencyCode" text,
	"amountValue" numeric,
	"amountConfidence" numeric,
	"amountMatchedContent" text,
	"taxAmount" numeric,
	"taxCurrencyCode" text,
	"taxAmountConfidence" numeric,
	"taxAmountMatchedContent" text,
	"taxRate" text,
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
	"subTotal" numeric,
	"subTotalCurrencyCode" text,
	"subTotalConfidence" numeric,
	"subTotalMatchedContent" text,
	"totalTax" numeric,
	"totalTaxCurrencyCode" text,
	"totalTaxConfidence" numeric,
	"totalTaxMatchedContent" text,
	"invoiceNumber" text,
	"invoiceNumberConfidence" numeric,
	"invoiceNumberMatchedContent" text,
	"matchedVendorName" text,
	"matchedVendorNameConfidence" numeric,
	"matchedVendorNameMatchedContent" text,
	"invoiceDate" date,
	"invoiceDateConfidence" numeric,
	"invoiceDateMatchedContent" text,
	"paymentTerm" text,
	"paymentTermConfidence" numeric,
	"paymentTermMatchedContent" text,
	"vendorTaxId" text,
	"vendorTaxIdConfidence" numeric,
	"vendorTaxIdMatchedContent" text,
	"matchedCustomerName" text,
	"matchedCustomerNameConfidence" numeric,
	"matchedCustomerNameMatchedContent" text,
	"invoiceTotal" numeric,
	"invoiceTotalCurrencyCode" text,
	"invoiceTotalConfidence" numeric,
	"invoiceTotalMatchedContent" text,
	"customerTaxId" text,
	"customerTaxIdConfidence" numeric,
	"customerTaxIdMatchedContent" text,
	"matchedPurchaseOrderNumber" text,
	"matchedPurchaseOrderNumberConfidence" numeric,
	"matchedPurchaseOrderNumberMatchedContent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_documentId_unique" UNIQUE("documentId"),
	CONSTRAINT "invoices_organizationId_id_unique" UNIQUE("organizationId","id")
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
CREATE TABLE "postboxes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"postmarkServerId" integer,
	"postmarkInboundEmail" text,
	"organizationId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "postboxes_postmarkServerId_unique" UNIQUE("postmarkServerId"),
	CONSTRAINT "postboxes_postmarkInboundEmail_unique" UNIQUE("postmarkInboundEmail"),
	CONSTRAINT "postboxes_id_organizationId_unique" UNIQUE("id","organizationId")
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
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_archived_by_users_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_archived_by_users_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_organizationId_companyId_companies_organizationId_id_fk" FOREIGN KEY ("organizationId","companyId") REFERENCES "public"."companies"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_industryId_industries_id_fk" FOREIGN KEY ("industryId") REFERENCES "public"."industries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_archived_by_users_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_addressId_addresses_id_fk" FOREIGN KEY ("addressId") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_organizationId_companyId_companies_organizationId_id_fk" FOREIGN KEY ("organizationId","companyId") REFERENCES "public"."companies"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_addresses" ADD CONSTRAINT "company_addresses_organizationId_addressId_addresses_organizationId_id_fk" FOREIGN KEY ("organizationId","addressId") REFERENCES "public"."addresses"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_domains" ADD CONSTRAINT "company_domains_companyId_companies_id_fk" FOREIGN KEY ("companyId") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_domains" ADD CONSTRAINT "company_domains_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_domains" ADD CONSTRAINT "company_domains_archived_by_users_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_domains" ADD CONSTRAINT "company_domains_organizationId_companyId_companies_organizationId_id_fk" FOREIGN KEY ("organizationId","companyId") REFERENCES "public"."companies"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_extractions" ADD CONSTRAINT "document_extractions_organizationId_documentId_documents_organizationId_id_fk" FOREIGN KEY ("organizationId","documentId") REFERENCES "public"."documents"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_emailId_inbound_emails_id_fk" FOREIGN KEY ("emailId") REFERENCES "public"."inbound_emails"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_emailId_inbound_emails_organizationId_id_fk" FOREIGN KEY ("organizationId","emailId") REFERENCES "public"."inbound_emails"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_postboxId_postboxes_id_fk" FOREIGN KEY ("postboxId") REFERENCES "public"."postboxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_archived_by_users_id_fk" FOREIGN KEY ("archived_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_organizationId_postboxId_postboxes_organizationId_id_fk" FOREIGN KEY ("organizationId","postboxId") REFERENCES "public"."postboxes"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_organizationId_invoiceId_invoices_organizationId_id_fk" FOREIGN KEY ("organizationId","invoiceId") REFERENCES "public"."invoices"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_organizationId_documentId_documents_organizationId_id_fk" FOREIGN KEY ("organizationId","documentId") REFERENCES "public"."documents"("organizationId","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_memberships" ADD CONSTRAINT "organization_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "postboxes" ADD CONSTRAINT "postboxes_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;