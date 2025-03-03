import type { PgInsertValue } from "drizzle-orm/pg-core";
import type { invoiceItems } from "./schema";

export type InsertInvoiceItem = PgInsertValue<typeof invoiceItems>;
