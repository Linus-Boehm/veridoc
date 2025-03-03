import { z } from 'zod';
import { Entity, type Timestamps } from '#base.ts';

export const stringItemSchema = z.object({
  matchedContent: z.string(),
  confidence: z.number(),
  value: z.string(),
});

export type StringItem = z.infer<typeof stringItemSchema>;

export const dateItemSchema = z.object({
  matchedContent: z.string(),
  confidence: z.number(),
  value: z.string(),
});

export type DateItem = z.infer<typeof dateItemSchema>;

export const numberItemSchema = z.object({
  matchedContent: z.string(),
  confidence: z.number(),
  value: z.number(),
});

export type NumberItem = z.infer<typeof numberItemSchema>;

export const currencyValueSchema = z.object({
  amount: z.number(),
  currencyCode: z.string(),
});

export const currencyItemSchema = z.object({
  matchedContent: z.string(),
  confidence: z.number(),
  currency: currencyValueSchema,
});

export type CurrencyItem = z.infer<typeof currencyItemSchema>;


export const baseInvoiceItemSchema = z.object({
  matchedRowContent: z.string(),
  confidence: z.number(),
  position: z.number().positive(),
  unit: stringItemSchema.optional(),
  amount: currencyItemSchema.optional(),
  quantity: numberItemSchema.optional(),
  unitPrice: currencyItemSchema.optional(),
  description: stringItemSchema.optional(),
  tax: currencyItemSchema.optional(),
  taxRate: numberItemSchema.optional(),
  productCode: stringItemSchema.optional(),
  date: dateItemSchema.optional(),
  organizationId: z.string().uuid(),
});

export type BaseInvoiceItem = z.infer<typeof baseInvoiceItemSchema>;


export const baseInvoiceSchema = z.object({
  organizationId: z.string().uuid(),
});

export type BaseInvoice = z.infer<typeof baseInvoiceSchema>;



export class InvoiceItem extends Entity<BaseInvoiceItem> {
  
}

export class Invoice extends Entity<BaseInvoice> {
  private _items: InvoiceItem[] = [];
  private _documentId: string;
  constructor(props: BaseInvoice, documentId: string);
  constructor(props: BaseInvoice, documentId: string, id: string, timestamps: Timestamps, items?: InvoiceItem[]);
  constructor(
    props: BaseInvoice,
    documentId: string,
    id?: string,
    timestamps?: Timestamps,
    items?: InvoiceItem[]
  ) {
    if(id && timestamps) {
      super(props, id, timestamps);
    } else {
      super(props);
    }
    this._items = items ?? [];
    this._documentId = documentId;
  }

  get items() {
    return this._items;
  }

  get documentId() {
    return this._documentId;
  }

  addItem(item: InvoiceItem) {
    this._items.push(item);
  }

  addItems(items: InvoiceItem[]) {
    this._items.push(...items);
  }

  removeItem(item: InvoiceItem) {
    this._items = this._items.filter((i) => i.equals(item));
  }

  updateItem(position: number, item: InvoiceItem) {
    this._items[position] = item;
  }

  itemCount() {
    return this._items.length;
  }
}



