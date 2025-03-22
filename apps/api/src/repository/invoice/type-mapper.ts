import type {
  InsertInvoice,
  InsertInvoiceItem,
  SelectDocument,
  SelectInvoice,
  SelectInvoiceItem,
} from '@repo/database/types';
import { Invoice, InvoiceItem } from '@taxel/domain/src/invoice';
import { mapDocumentToDomain } from '../document/type-mapper';
import {
  createDomainCurrencyItem,
  createDomainDateItem,
  mapTimestampsToDomain,
  parseToDecimal,
  removeTimestamps,
} from '../type-mappers';
import { createDomainNumberItem } from '../type-mappers';
import { createDomainStringItem } from '../type-mappers';

export const mapInvoiceItemToDb = (
  invoiceId: string,
  invoiceItem: InvoiceItem
): InsertInvoiceItem => {
  const invoiceItemData = invoiceItem.toJSON();
  return {
    invoiceId,
    organizationId: invoiceItemData.organizationId,
    position: invoiceItemData.position,
    matchedRowContent: invoiceItemData.matchedRowContent,
    rowConfidence: String(invoiceItemData.confidence),

    description: invoiceItemData.description?.value,
    descriptionConfidence: parseToDecimal(invoiceItemData.description?.confidence),
    descriptionMatchedContent: invoiceItemData.description?.matchedContent,
    unit: invoiceItemData.unit?.value,
    unitConfidence: parseToDecimal(invoiceItemData.unit?.confidence),
    unitMatchedContent: invoiceItemData.unit?.matchedContent,
    quantity: parseToDecimal(invoiceItemData.quantity?.value),
    quantityConfidence: parseToDecimal(invoiceItemData.quantity?.confidence),
    quantityMatchedContent: invoiceItemData.quantity?.matchedContent,
    amountValue: parseToDecimal(invoiceItemData.amount?.currency.amount),
    amountCurrencyCode: invoiceItemData.amount?.currency.currencyCode,
    amountConfidence: parseToDecimal(invoiceItemData.amount?.currency.amount),
    amountMatchedContent: parseToDecimal(invoiceItemData.amount?.currency.amount),
    date: invoiceItemData.date?.value,
    dateConfidence: parseToDecimal(invoiceItemData.date?.confidence),
    dateMatchedContent: invoiceItemData.date?.matchedContent,
    productCode: invoiceItemData.productCode?.value,
    productCodeConfidence: parseToDecimal(invoiceItemData.productCode?.confidence),
    productCodeMatchedContent: invoiceItemData.productCode?.matchedContent,
    taxAmount: parseToDecimal(invoiceItemData.tax?.currency.amount),
    taxAmountConfidence: parseToDecimal(invoiceItemData.tax?.currency.amount),
    taxAmountMatchedContent: parseToDecimal(invoiceItemData.tax?.currency.amount),
    taxCurrencyCode: invoiceItemData.tax?.currency.currencyCode,
    taxRate: invoiceItemData.taxRate?.value,
    taxRateConfidence: parseToDecimal(invoiceItemData.taxRate?.confidence),
    taxRateMatchedContent: invoiceItemData.taxRate?.matchedContent,

    unitPriceValue: parseToDecimal(invoiceItemData.unitPrice?.currency.amount),
    unitPriceConfidence: parseToDecimal(invoiceItemData.unitPrice?.currency.amount),
    unitPriceMatchedContent: parseToDecimal(invoiceItemData.unitPrice?.currency.amount),
    unitPriceCurrencyCode: invoiceItemData.unitPrice?.currency.currencyCode,
  };
};

export const mapInvoiceItemToDomain = (
  invoiceItem: SelectInvoiceItem,
  id: string
) => {
  let dateValue: string | undefined;
  if (invoiceItem.date) {
    dateValue =
      typeof invoiceItem.date === 'string'
        ? invoiceItem.date
        : new Date(invoiceItem.date).toISOString().split('T')[0];
  }

  return new InvoiceItem(
    {
      matchedRowContent: invoiceItem.matchedRowContent || '',
      confidence: Number(invoiceItem.rowConfidence),
      position: invoiceItem.position,
      organizationId: invoiceItem.organizationId,
      description: createDomainStringItem(
        invoiceItem.descriptionMatchedContent,
        invoiceItem.description,
        invoiceItem.descriptionConfidence
      ),
      unit: createDomainStringItem(
        invoiceItem.unitMatchedContent,
        invoiceItem.unit,
        invoiceItem.unitConfidence
      ),
      quantity: createDomainNumberItem(
        invoiceItem.quantityMatchedContent,
        invoiceItem.quantity,
        invoiceItem.quantityConfidence
      ),
      amount: createDomainCurrencyItem(
        invoiceItem.amountMatchedContent,
        invoiceItem.amountValue,
        invoiceItem.amountConfidence,
        invoiceItem.amountCurrencyCode
      ),
      unitPrice: createDomainCurrencyItem(
        invoiceItem.unitPriceMatchedContent,
        invoiceItem.unitPriceValue,
        invoiceItem.unitPriceConfidence,
        invoiceItem.unitPriceCurrencyCode
      ),
      tax: createDomainCurrencyItem(
        invoiceItem.taxAmountMatchedContent,
        invoiceItem.taxAmount,
        invoiceItem.taxAmountConfidence,
        invoiceItem.taxCurrencyCode
      ),
      taxRate: createDomainStringItem(
        invoiceItem.taxRateMatchedContent,
        invoiceItem.taxRate,
        invoiceItem.taxRateConfidence
      ),
      productCode: createDomainStringItem(
        invoiceItem.productCodeMatchedContent,
        invoiceItem.productCode,
        invoiceItem.productCodeConfidence
      ),
      date: invoiceItem.date
        ? {
            matchedContent: invoiceItem.dateMatchedContent || '',
            confidence: invoiceItem.dateConfidence
              ? Number(invoiceItem.dateConfidence)
              : 0,
            value: dateValue || '',
          }
        : undefined
    },
    id,
    mapTimestampsToDomain(invoiceItem)
  );
};

export const mapInvoiceToDomain = (
  invoice: SelectInvoice & {
    items: SelectInvoiceItem[];
    document?: SelectDocument;
  }
) => {
  return new Invoice(
    {
      organizationId: invoice.organizationId,
      invoiceNumber: createDomainStringItem(
        invoice.invoiceNumberMatchedContent,
        invoice.invoiceNumber,
        invoice.invoiceNumberConfidence
      ),
      invoiceDate: createDomainDateItem(
        invoice.invoiceDateMatchedContent,
        invoice.invoiceDate,
        invoice.invoiceDateConfidence
      ),
      paymentTerm: createDomainStringItem(
        invoice.paymentTermMatchedContent,
        invoice.paymentTerm,
        invoice.paymentTermConfidence
      ),
      vendorTaxId: createDomainStringItem(
        invoice.vendorTaxIdMatchedContent,
        invoice.vendorTaxId,
        invoice.vendorTaxIdConfidence
      ),
      customerTaxId: createDomainStringItem(
        invoice.customerTaxIdMatchedContent,
        invoice.customerTaxId,
        invoice.customerTaxIdConfidence
      ),
      matchedCustomerName: createDomainStringItem(
        invoice.matchedCustomerNameMatchedContent,
        invoice.matchedCustomerName,
        invoice.matchedCustomerNameConfidence
      ),
      invoiceTotal: createDomainCurrencyItem(
        invoice.invoiceTotalMatchedContent,
        invoice.invoiceTotal,
        invoice.invoiceTotalConfidence,
        invoice.invoiceTotalCurrencyCode
      ),
      subTotal: createDomainCurrencyItem(
        invoice.subTotalMatchedContent,
        invoice.subTotal,
        invoice.subTotalConfidence,
        invoice.subTotalCurrencyCode
      ),
      totalTax: createDomainCurrencyItem(
        invoice.totalTaxMatchedContent,
        invoice.totalTax,
        invoice.totalTaxConfidence,
        invoice.totalTaxCurrencyCode
      ),
      matchedPurchaseOrderNumber: createDomainStringItem(
        invoice.matchedPurchaseOrderNumberMatchedContent,
        invoice.matchedPurchaseOrderNumber,
        invoice.matchedPurchaseOrderNumberConfidence
      ),
      matchedVendorName: createDomainStringItem(
        invoice.matchedVendorNameMatchedContent,
        invoice.matchedVendorName,
        invoice.matchedVendorNameConfidence
      ),
    },
    invoice.documentId,
    invoice.id,
    mapTimestampsToDomain(invoice),
    invoice.items.map((item) => mapInvoiceItemToDomain(item, invoice.id)),
    invoice.document ? mapDocumentToDomain(invoice.document) : undefined
  );
};

export const mapInvoiceToDb = (invoice: Invoice): InsertInvoice => {
  const invoiceData = removeTimestamps(invoice);
  return {
    organizationId: invoiceData.organizationId,
    invoiceNumber: invoiceData.invoiceNumber?.value,
    invoiceNumberMatchedContent: invoiceData.invoiceNumber?.matchedContent,
    invoiceNumberConfidence: parseToDecimal(
      invoiceData.invoiceNumber?.confidence
    ),

    invoiceDate: invoiceData.invoiceDate?.value,
    invoiceDateMatchedContent: invoiceData.invoiceDate?.matchedContent,
    invoiceDateConfidence: parseToDecimal(invoiceData.invoiceDate?.confidence),

    paymentTerm: invoiceData.paymentTerm?.value,
    paymentTermMatchedContent: invoiceData.paymentTerm?.matchedContent,
    paymentTermConfidence: parseToDecimal(invoiceData.paymentTerm?.confidence),

    vendorTaxId: invoiceData.vendorTaxId?.value,
    vendorTaxIdMatchedContent: invoiceData.vendorTaxId?.matchedContent,
    vendorTaxIdConfidence: parseToDecimal(invoiceData.vendorTaxId?.confidence),

    customerTaxId: invoiceData.customerTaxId?.value,
    customerTaxIdMatchedContent: invoiceData.customerTaxId?.matchedContent,
    customerTaxIdConfidence: parseToDecimal(
      invoiceData.customerTaxId?.confidence
    ),

    matchedCustomerName: invoiceData.matchedCustomerName?.value,
    matchedCustomerNameMatchedContent:
      invoiceData.matchedCustomerName?.matchedContent,
    matchedCustomerNameConfidence: parseToDecimal(
      invoiceData.matchedCustomerName?.confidence
    ),

    invoiceTotal: parseToDecimal(invoiceData.invoiceTotal?.currency.amount),
    invoiceTotalCurrencyCode: invoiceData.invoiceTotal?.currency.currencyCode,
    invoiceTotalMatchedContent: invoiceData.invoiceTotal?.matchedContent,
    invoiceTotalConfidence: parseToDecimal(
      invoiceData.invoiceTotal?.confidence
    ),

    matchedPurchaseOrderNumber: invoiceData.matchedPurchaseOrderNumber?.value,
    matchedPurchaseOrderNumberMatchedContent:
      invoiceData.matchedPurchaseOrderNumber?.matchedContent,
    matchedPurchaseOrderNumberConfidence: parseToDecimal(
      invoiceData.matchedPurchaseOrderNumber?.confidence
    ),

    matchedVendorName: invoiceData.matchedVendorName?.value,
    matchedVendorNameMatchedContent:
      invoiceData.matchedVendorName?.matchedContent,
    matchedVendorNameConfidence: parseToDecimal(
      invoiceData.matchedVendorName?.confidence
    ),

    subTotal: parseToDecimal(invoiceData.subTotal?.currency.amount),
    subTotalCurrencyCode: invoiceData.subTotal?.currency.currencyCode,
    subTotalMatchedContent: invoiceData.subTotal?.matchedContent,
    subTotalConfidence: parseToDecimal(invoiceData.subTotal?.confidence),

    totalTax: parseToDecimal(invoiceData.totalTax?.currency.amount),
    totalTaxCurrencyCode: invoiceData.totalTax?.currency.currencyCode,
    totalTaxMatchedContent: invoiceData.totalTax?.matchedContent,
    totalTaxConfidence: parseToDecimal(invoiceData.totalTax?.confidence),

    documentId: invoiceData.documentId,
    id: invoiceData.id,
  };
};
