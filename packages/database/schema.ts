import { relations } from 'drizzle-orm';
import {
  boolean,
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

const softDeletion = {
  archivedAt: timestamp({ withTimezone: true }),
  archivedBy: uuid('archived_by').references(() => users.id),
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

export const addressTypes = pgEnum('address_types', [
  'billing',
  'shipping',
  'headquarters',
  'branch',
  'other',
]);

export const industries = pgTable('industries', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text().notNull(),
  code: text().notNull().unique(),
  ...timestamps,
});

export const companies = pgTable(
  'companies',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    name: text().notNull(),
    countryCode: text().notNull(), // 3-digit ISO code
    vatId: text(),
    industryId: uuid().references(() => industries.id),
    ext_vendor_number: text(),
    ...timestamps,
    ...softDeletion,
  },
  (t) => [
    unique().on(t.organizationId, t.id),
    unique().on(t.organizationId, t.ext_vendor_number),
  ]
);

export const companyDomains = pgTable(
  'company_domains',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    companyId: uuid()
      .references(() => companies.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    domain: text().notNull(),
    isPrimary: boolean().notNull().default(false),
    isVerified: boolean().notNull().default(false),
    ...timestamps,
    ...softDeletion,
  },
  (t) => [
    unique().on(t.organizationId, t.domain),
    foreignKey({
      columns: [t.organizationId, t.companyId],
      foreignColumns: [companies.organizationId, companies.id],
    }),
  ]
);

export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    addressName: text(),
    addressLine1: text().notNull(),
    addressLine2: text(),
    administrativeArea: text(), // state, province, county, etc.
    locality: text(), // city, town, village, etc.
    postalCode: text().notNull(),
    countryCode: text().notNull(), // 3-digit ISO code
    ...timestamps,
    ...softDeletion,
  },
  (t) => [unique().on(t.organizationId, t.id)]
);

export const companyAddresses = pgTable(
  'company_addresses',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    companyId: uuid()
      .references(() => companies.id, { onDelete: 'cascade' })
      .notNull(),
    addressId: uuid()
      .references(() => addresses.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    type: addressTypes().notNull().default('other'),
    isPrimary: boolean().notNull().default(false),
    ...timestamps,
  },
  (t) => [
    unique().on(t.organizationId, t.companyId, t.addressId),
    foreignKey({
      columns: [t.organizationId, t.companyId],
      foreignColumns: [companies.organizationId, companies.id],
    }),
    foreignKey({
      columns: [t.organizationId, t.addressId],
      foreignColumns: [addresses.organizationId, addresses.id],
    }),
  ]
);

export const bankAccounts = pgTable(
  'bank_accounts',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    companyId: uuid()
      .references(() => companies.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    accountName: text().notNull(), // The name of the account
    accountHolderName: text().notNull(), // The name of the account holder
    iban: text(),
    bic: text(),
    bankName: text(),
    routingNumber: text(), // The 9-digit ABA routing number
    accountNumber: text(),
    currencyCode: text(), // USD, EUR, GBP, etc.
    isPrimary: boolean().notNull().default(false),
    ...timestamps,
    ...softDeletion,
  },
  (t) => [
    foreignKey({
      columns: [t.organizationId, t.companyId],
      foreignColumns: [companies.organizationId, companies.id],
    }),
  ]
);

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

export const emailStatus = pgEnum('email_status', [
  'received',
  'processed',
  'partial_processed',
  'failed',
  'archived',
]);

export const documentTypes = pgEnum('document_types', [
  'invoice',
  'payment_confirmation',
  'reminder',
  'contract',
  'order',
  'order_confirmation',
  'internal_communication',
  'advertising_newsletter',
  'other',
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
    emailId: uuid().references(() => inboundEmails.id, { onDelete: 'cascade' }),
    fileName: text().notNull(),
    storagePath: text().notNull().unique(),
    type: documentTypes().notNull().default('unknown'),
    processingStatus: documentProcessingStatus()
      .notNull()
      .default('waiting_for_upload'),
    ...timestamps,
  },
  (t) => [
    unique().on(t.organizationId, t.id),
    foreignKey({
      columns: [t.organizationId, t.emailId],
      foreignColumns: [inboundEmails.organizationId, inboundEmails.id],
    }),
  ]
);

export const documentExtractionModel = pgEnum('document_extraction_model', [
  'invoice',
  'generic',
]);

export const documentExtractions = pgTable(
  'document_extractions',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    documentId: uuid()
      .references(() => documents.id, { onDelete: 'cascade' })
      .notNull(),
    extractionModel: documentExtractionModel().notNull().default('generic'),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    extractionResult: jsonb().notNull(),
    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.organizationId, t.documentId],
      foreignColumns: [documents.organizationId, documents.id],
    }),
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
    subTotal: numeric(),
    subTotalCurrencyCode: text(),
    subTotalConfidence: numeric(),
    subTotalMatchedContent: text(),

    totalTax: numeric(),
    totalTaxCurrencyCode: text(),
    totalTaxConfidence: numeric(),
    totalTaxMatchedContent: text(),

    invoiceNumber: text(),
    invoiceNumberConfidence: numeric(),
    invoiceNumberMatchedContent: text(),

    matchedVendorName: text(),
    matchedVendorNameConfidence: numeric(),
    matchedVendorNameMatchedContent: text(),

    invoiceDate: date(),
    invoiceDateConfidence: numeric(),
    invoiceDateMatchedContent: text(),

    paymentTerm: text(),
    paymentTermConfidence: numeric(),
    paymentTermMatchedContent: text(),

    vendorTaxId: text(),
    vendorTaxIdConfidence: numeric(),
    vendorTaxIdMatchedContent: text(),

    matchedCustomerName: text(),
    matchedCustomerNameConfidence: numeric(),
    matchedCustomerNameMatchedContent: text(),

    invoiceTotal: numeric(),
    invoiceTotalCurrencyCode: text(),
    invoiceTotalConfidence: numeric(),
    invoiceTotalMatchedContent: text(),

    customerTaxId: text(),
    customerTaxIdConfidence: numeric(),
    customerTaxIdMatchedContent: text(),

    matchedPurchaseOrderNumber: text(),
    matchedPurchaseOrderNumberConfidence: numeric(),
    matchedPurchaseOrderNumberMatchedContent: text(),

    ...timestamps,
  },
  (t) => [
    foreignKey({
      columns: [t.organizationId, t.documentId],
      foreignColumns: [documents.organizationId, documents.id],
    }),
    unique().on(t.organizationId, t.id),
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
      columns: [t.organizationId, t.invoiceId],
      foreignColumns: [invoices.organizationId, invoices.id],
    }),
  ]
);

export const postboxes = pgTable(
  'postboxes',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    name: text().notNull(),
    postmarkServerId: integer().unique(),
    postmarkInboundEmail: text().unique(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (t) => [unique().on(t.id, t.organizationId)]
);

export const inboundEmails = pgTable(
  'inbound_emails',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    postboxId: uuid()
      .references(() => postboxes.id, { onDelete: 'cascade' })
      .notNull(),
    organizationId: uuid()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    from: text().notNull(),
    fromName: text().notNull(),
    to: text().notNull(),
    cc: text().notNull(),
    bcc: text().notNull(),
    subject: text().notNull(),
    messageId: text().notNull(),
    bodyText: text().notNull(),
    bodyHtml: text().notNull(),
    date: timestamp({ withTimezone: true }).notNull(),
    status: emailStatus().notNull().default('received'),
    ...timestamps,
    ...softDeletion,
  },
  (t) => [
    foreignKey({
      columns: [t.organizationId, t.postboxId],
      foreignColumns: [postboxes.organizationId, postboxes.id],
    }),
    unique().on(t.organizationId, t.id),
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
  inboundEmails: many(inboundEmails),
  companies: many(companies),
  addresses: many(addresses),
}));

export const userMembershipsRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
  email: one(inboundEmails, {
    fields: [documents.emailId],
    references: [inboundEmails.id],
  }),
}));

export const documentExtractionsRelations = relations(
  documentExtractions,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [documentExtractions.organizationId],
      references: [organizations.id],
    }),
    document: one(documents, {
      fields: [documentExtractions.documentId],
      references: [documents.id],
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

export const postboxesRelations = relations(postboxes, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [postboxes.organizationId],
    references: [organizations.id],
  }),
  inboundEmails: many(inboundEmails),
}));

export const inboundEmailsRelations = relations(
  inboundEmails,
  ({ one, many }) => ({
    postbox: one(postboxes, {
      fields: [inboundEmails.postboxId],
      references: [postboxes.id],
    }),
    organization: one(organizations, {
      fields: [inboundEmails.organizationId],
      references: [organizations.id],
    }),
    documents: many(documents),
  })
);

export const industriesRelations = relations(industries, ({ many }) => ({
  companies: many(companies),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [companies.organizationId],
    references: [organizations.id],
  }),
  industry: one(industries, {
    fields: [companies.industryId],
    references: [industries.id],
  }),
  addresses: many(companyAddresses),
  bankAccounts: many(bankAccounts),
  domains: many(companyDomains),
}));

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [addresses.organizationId],
    references: [organizations.id],
  }),
  companies: many(companyAddresses),
}));

export const companyAddressesRelations = relations(
  companyAddresses,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyAddresses.companyId],
      references: [companies.id],
    }),
    address: one(addresses, {
      fields: [companyAddresses.addressId],
      references: [addresses.id],
    }),
    organization: one(organizations, {
      fields: [companyAddresses.organizationId],
      references: [organizations.id],
    }),
  })
);

export const bankAccountsRelations = relations(bankAccounts, ({ one }) => ({
  company: one(companies, {
    fields: [bankAccounts.companyId],
    references: [companies.id],
  }),
  organization: one(organizations, {
    fields: [bankAccounts.organizationId],
    references: [organizations.id],
  }),
}));

export const companyDomainsRelations = relations(companyDomains, ({ one }) => ({
  company: one(companies, {
    fields: [companyDomains.companyId],
    references: [companies.id],
  }),
  organization: one(organizations, {
    fields: [companyDomains.organizationId],
    references: [organizations.id],
  }),
}));
