import { relations } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const organizations = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  clerkId: text().notNull().unique(),
  ...timestamps,
});

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: text(),
  lastName: text(),
  email: text().notNull().unique(),
  clerkId: text().notNull().unique(),

  ...timestamps,
});

export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    organizationId: integer()
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer()
      .references(() => users.id, { onDelete: "cascade" })
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

export const organizationMembershipsRelations = relations(
  organizations,
  ({ many }) => ({
    organizationMemberships: many(organizationMemberships),
  })
);
