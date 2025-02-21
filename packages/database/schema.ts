import { relations } from 'drizzle-orm';
import {
  foreignKey,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const organizations = pgTable('organizations', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  clerkId: text().notNull().unique(),
  ...timestamps,
});

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: text(),
  lastName: text(),
  email: text().notNull().unique(),
  clerkId: text().notNull().unique(),

  ...timestamps,
});

export const organizationMemberships = pgTable(
  'organization_memberships',
  {
    organizationId: integer()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer()
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    clerkId: text().notNull().unique(),
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.organizationId] }),
  })
);

export const userMembershipsRelations = relations(users, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  organizationMemberships: many(organizationMemberships),
  documents: many(documents),
}));

export const storageFiles = pgTable(
  'storage_files',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fileName: text().notNull(),
    storagePath: text().notNull(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    ...timestamps,
  },
  (table) => ({
    organizationFileUnique: unique().on(table.organizationId, table.id),
  })
);

export const storageFilesRelations = relations(storageFiles, ({ one }) => ({
  organization: one(organizations, {
    fields: [storageFiles.organizationId],
    references: [organizations.id],
  }),
}));

export const documents = pgTable(
  'documents',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    fileName: text().notNull(),
    organizationId: integer()
      .references(() => organizations.id, { onDelete: 'cascade' })
      .notNull(),
    storageFileId: integer().notNull(),
    ...timestamps,
  },
  (table) => [
    foreignKey({
      columns: [table.organizationId, table.storageFileId],
      foreignColumns: [storageFiles.organizationId, storageFiles.id],
      name: 'documents_storage_file_fk',
    }),
    unique('documents_storage_file_unique').on(
      table.organizationId,
      table.storageFileId
    ),
  ]
);

export const documentsRelations = relations(documents, ({ one }) => ({
  organization: one(organizations, {
    fields: [documents.organizationId],
    references: [organizations.id],
  }),
  storageFile: one(storageFiles, {
    fields: [documents.storageFileId, documents.organizationId],
    references: [storageFiles.id, storageFiles.organizationId],
  }),
}));
