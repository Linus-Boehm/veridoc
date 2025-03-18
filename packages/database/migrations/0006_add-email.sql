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
	"date" date NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "postboxes" ADD CONSTRAINT "postboxes_id_organizationId_unique" UNIQUE("id","organizationId");
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_postboxId_postboxes_id_fk" FOREIGN KEY ("postboxId") REFERENCES "public"."postboxes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_emails" ADD CONSTRAINT "inbound_emails_postboxId_organizationId_postboxes_id_organizationId_fk" FOREIGN KEY ("postboxId","organizationId") REFERENCES "public"."postboxes"("id","organizationId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
