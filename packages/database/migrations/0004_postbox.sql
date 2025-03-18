CREATE TABLE "postboxes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"postmarkServerId" integer,
	"postmarkInboundEmail" text,
	"organizationId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "postboxes" ADD CONSTRAINT "postboxes_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;