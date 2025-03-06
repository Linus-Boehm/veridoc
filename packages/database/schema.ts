import { relations } from 'drizzle-orm';
import {
  date,
  foreignKey,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { v7 as uuidv7 } from 'uuid';
const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const organizations = pgTable('organizations', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text().notNull(),
  slug: text().notNull().unique(),
  clerkId: text().notNull().unique(),
  ...timestamps,
});

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  firstName: text(),
  lastName: text(),
  email: text().notNull().unique(),
  clerkId: text().notNull().unique(),
  ...timestamps,
});

export const organizationMemberships = pgTable(
  'organization_memberships',
  {
    organizationId: uuid('organization_id')
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    clerkId: text().notNull().unique(),
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.organizationId] }),
  })
);

export const documentProcessingStatus = pgEnum('document_processing_status', [
  'waiting_for_upload',
  'processing',
  'completed',
  'failed',
]);

export const documentTypes = pgEnum('document_types', [
  'invoice',
  'receipt',
  'unknown',
]);

export const documents = pgTable(
  'documents',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    fileName: text().notNull(),
    storagePath: text().notNull().unique(),
    type: documentTypes().notNull().default('unknown'),
    processingStatus: documentProcessingStatus()
      .notNull()
      .default('waiting_for_upload'),
    ...timestamps,
  },
  (t) => [unique().on(t.id, t.organizationId)]
);

export const documentExtractions = pgTable(
  'document_extractions',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    documentId: uuid()
      .references(() => documents.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    extractionResult: jsonb().notNull(),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.documentId, t.organizationId],
      foreignColumns: [documents.id, documents.organizationId],
    }),
    unique().on(t.documentId, t.organizationId),
  ]
);

export const invoices = pgTable(
  'invoices',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    documentId: uuid()
      .references(() => documents.id, { onDelete: 'cascade' })
      .notNull()
      .unique(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    dueDate: date(),
    dueDateConfidence: numeric(),
    dueDateMatchedValue: date(),

    creditorInvoiceNumber: text(),
    creditorInvoiceNumberConfidence: numeric(),
    creditorInvoiceNumberMatchedValue: text(),

    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.documentId, t.organizationId],
      foreignColumns: [documents.id, documents.organizationId],
    }),
    unique().on(t.id, t.organizationId),
  ]
);

export const invoiceItems = pgTable(
  'invoice_items',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    invoiceId: uuid()
      .references(() => invoices.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    position: integer().notNull(),
    matchedRowContent: text(),
    rowConfidence: numeric(),

    description: text(),
    descriptionConfidence: numeric(),
    descriptionMatchedContent: text(),

    unit: text(),
    unitConfidence: numeric(),
    unitMatchedContent: text(),

    quantity: numeric(),
    quantityConfidence: numeric(),
    quantityMatchedContent: text(),

    unitPriceValue: numeric(),
    unitPriceCurrencyCode: text(),
    unitPriceConfidence: numeric(),
    unitPriceMatchedContent: text(),

    // Amount of the invoice item 
    amountCurrencyCode: text(),
    amountValue: numeric(),
    amountConfidence: numeric(),
    amountMatchedContent: text(),

    taxAmount: numeric(),
    // ISO currency code
    taxCurrencyCode: text(),
    taxAmountConfidence: numeric(),
    taxAmountMatchedContent: text(),

    taxRate: text(),
    taxRateConfidence: numeric(),
    taxRateMatchedContent: text(),

    productCode: text(),
    productCodeConfidence: numeric(),
    productCodeMatchedContent: text(),

    date: date(),
    dateConfidence: numeric(),
    dateMatchedContent: text(),

    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.invoiceId, t.organizationId],
      foreignColumns: [invoices.id, invoices.organizationId],
    }),
    0,
  ]
);

// ############################################################
// #### Relations definitions after all tables are defined ####
// ############################################################

export const organizationMembershipsRelations = relations(
  organizationMemberships,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [organizationMemberships.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [organizationMemberships.userId],
      references: [users.id],
    }),
  })
);

export const organizationsRelations = relations(organizations, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
  documents: many(documents),
  documentExtractions: many(documentExtractions),
  invoices: many(invoices),
}));

export const userMembershipsRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
}));

export const documentExtractionsRelations = relations(
  documentExtractions,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [documentExtractions.organizationId],
      references: [organizations.id],
    }),
  })
);

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  document: one(documents, {
    fields: [invoices.documentId],
    references: [documents.id],
  }),
  organization: one(organizations, {
    fields: [invoices.organizationId],
    references: [organizations.id],
  }),
  items: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  organization: one(organizations, {
    fields: [invoiceItems.organizationId],
    references: [organizations.id],
  }),
}));
