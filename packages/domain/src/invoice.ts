import { z } from 'zod';
import { Entity, type Timestamps, timestampDTOSchema } from '#base.ts';
import { type Document, documentSchema } from './document';

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
  taxRate: stringItemSchema.optional(),
  productCode: stringItemSchema.optional(),
  date: dateItemSchema.optional(),
  organizationId: z.string().uuid(),
});

export type BaseInvoiceItem = z.infer<typeof baseInvoiceItemSchema>;

export const baseInvoiceSchema = z.object({
  organizationId: z.string().uuid(),
  subTotal: currencyItemSchema.optional(),
  totalTax: currencyItemSchema.optional(),
  invoiceNumber: stringItemSchema.optional(),
  matchedVendorName: stringItemSchema.optional(),
  invoiceDate: dateItemSchema.optional(),
  paymentTerm: stringItemSchema.optional(),
  vendorTaxId: stringItemSchema.optional(),
  matchedCustomerName: stringItemSchema.optional(),
  invoiceTotal: currencyItemSchema.optional(),
  customerTaxId: stringItemSchema.optional(),
  matchedPurchaseOrderNumber: stringItemSchema.optional(),
});

export type BaseInvoice = z.infer<typeof baseInvoiceSchema>;

export class InvoiceItem extends Entity<BaseInvoiceItem> {}

export class Invoice extends Entity<BaseInvoice> {
  private _items: InvoiceItem[] = [];
  private _documentId: string;
  private _document: Document | undefined;

  constructor(props: BaseInvoice, documentId: string);
  constructor(
    props: BaseInvoice,
    documentId: string,
    id: string,
    timestamps: Timestamps,
    items?: InvoiceItem[],
    document?: Document
  );
  constructor(
    props: BaseInvoice,
    documentId: string,
    id?: string,
    timestamps?: Timestamps,
    items?: InvoiceItem[],
    document?: Document
  ) {
    if (id && timestamps) {
      super(props, id, timestamps);
    } else {
      super(props);
    }
    this._items = items ?? [];
    if (document) {
      this.document = document;
      this._documentId = document.id;
    } else {
      this._documentId = documentId;
    }
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

  get document(): Document | undefined {
    return this._document;
  }

  set document(document: Document) {
    this._document = document;
    this._documentId = document.id;
  }

  toJSON(): InvoiceDTO {
    return {
      ...super.toJSON(),
      documentId: this._documentId,
      document: this._document?.toJSON(),
      items: this._items.map((item) => item.toJSON()),
    };
  }
}

export const invoiceItemSchema = baseInvoiceItemSchema
  .extend(timestampDTOSchema.shape)
  .extend({
    id: z.string().uuid(),
  });

export type InvoiceItemDTO = z.infer<typeof invoiceItemSchema>;

export const invoiceSchema = baseInvoiceSchema
  .extend(timestampDTOSchema.shape)
  .extend({
    items: z.array(invoiceItemSchema),
    documentId: z.string().uuid(),
    document: documentSchema.optional(),
    id: z.string().uuid(),
  });

export type InvoiceDTO = z.infer<typeof invoiceSchema>;
