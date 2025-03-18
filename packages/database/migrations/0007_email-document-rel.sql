ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_organizationId_id_unique" UNIQUE("organizationId","id");--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "emailId" uuid;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_emailId_inbound_emails_id_fk" FOREIGN KEY ("emailId") REFERENCES "public"."inbound_emails"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_emailId_inbound_emails_organizationId_id_fk" FOREIGN KEY ("organizationId","emailId") REFERENCES "public"."inbound_emails"("organizationId","id") ON DELETE no action ON UPDATE no action;
