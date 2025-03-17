import createClient, {
  type AnalyzedDocumentOutput,
  type DocumentFieldOutput,
  type AnalyzeOperationOutput,
  type AnalyzeResultOutput,
} from '@azure-rest/ai-document-intelligence';
import {
  getLongRunningPoller,
  isUnexpected,
} from '@azure-rest/ai-document-intelligence';
import { AzureKeyCredential } from '@azure/core-auth';
import {
  type BaseInvoiceItem,
  type CurrencyItem,
  type DateItem,
  Invoice,
  InvoiceItem,
  type NumberItem,
  type StringItem,
} from '@taxel/domain/src/invoice';
import { keys } from '../keys';

export const FieldItems = {
  LineItems: 'Items',
  CustomerName: 'CustomerName',
  CustomerId: 'CustomerId',
  PurchaseOrder: 'PurchaseOrder',
  InvoiceId: 'InvoiceId',
  InvoiceDate: 'InvoiceDate',
  DueDate: 'DueDate',
  VendorName: 'VendorName',
  VendorAddress: 'VendorAddress',
  VendorAddressRecipient: 'VendorAddressRecipient',
  CustomerAddress: 'CustomerAddress',
  CustomerAddressRecipient: 'CustomerAddressRecipient',
  BillingAddress: 'BillingAddress',
  BillingAddressRecipient: 'BillingAddressRecipient',
  ShippingAddress: 'ShippingAddress',
  ShippingAddressRecipient: 'ShippingAddressRecipient',
  InvoiceTotal: 'InvoiceTotal',
  SubTotal: 'SubTotal',
  TotalTax: 'TotalTax',
  TotalDiscount: 'TotalDiscount',
  AmountDue: 'AmountDue',
  PreviousUnpaidBalance: 'PreviousUnpaidBalance',
  RemittanceAddress: 'RemittanceAddress',
  RemittanceAddressRecipient: 'RemittanceAddressRecipient',
  ServiceAddress: 'ServiceAddress',
  ServiceAddressRecipient: 'ServiceAddressRecipient',
  ServiceStartDate: 'ServiceStartDate',
  ServiceEndDate: 'ServiceEndDate',
  VendorTaxId: 'VendorTaxId',
  CustomerTaxId: 'CustomerTaxId',
  PaymentTerm: 'PaymentTerm',
  KVKNumber: 'KVKNumber',
  PaymentDetails: 'PaymentDetails',
  TaxDetails: 'TaxDetails',
  PaidInFourInstallments: 'PaidInFourInstallments',
};

export const LineItemFieldItems = {
  Unit: 'Unit',
  Amount: 'Amount',
  Quantity: 'Quantity',
  UnitPrice: 'UnitPrice',
  Description: 'Description',
  Tax: 'Tax',
  TaxRate: 'TaxRate',
  ProductCode: 'ProductCode',
  Date: 'Date',
};

const newDocumentIntelligenceClient = () => {
  return createClient(
    keys().AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT,
    new AzureKeyCredential(keys().AZURE_DOCUMENT_INTELLIGENCE_KEY)
  );
};

export const extractDocumentFromUrl = async (
  url: string,
  organizationId: string,
  documentId: string
) => {
  const client = newDocumentIntelligenceClient();

  const initialResponse = await client
    .path('/documentModels/{modelId}:analyze', 'prebuilt-invoice')
    .post({
      contentType: 'application/json',
      body: {
        urlSource: url,
      },
    });

  if (isUnexpected(initialResponse)) {
    throw initialResponse.body.error;
  }

  const poller = getLongRunningPoller(client, initialResponse);
  const analyzeResult = (
    (await poller.pollUntilDone()).body as AnalyzeOperationOutput
  ).analyzeResult;

  return computeAnalyzeResult(organizationId, documentId, analyzeResult);
};

export const extractStringItem = (
  item?: DocumentFieldOutput
): StringItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'string') {
    throw new Error(`Item is not a string: ${JSON.stringify(item)}`);
  }

  return {
    matchedContent: item.content ?? '',
    confidence: item.confidence ?? 0,
    value: item.valueString ?? '',
  };
};

export const extractDateItem = (
  item?: DocumentFieldOutput
): DateItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'date') {
    throw new Error(`Item is not a date: ${JSON.stringify(item)}`);
  }

  return {
    matchedContent: item.content ?? '',
    confidence: item.confidence ?? 0,
    value: item.valueDate ?? '',
  };
};

export const extractNumberItem = (
  item?: DocumentFieldOutput
): NumberItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'number') {
    throw new Error(`Item is not a number: ${JSON.stringify(item)}`);
  }

  return {
    matchedContent: item.content ?? '',
    confidence: item.confidence ?? 0,
    value: item.valueNumber ?? 0,
  };
};

export const extractCurrencyItem = (
  item?: DocumentFieldOutput
): CurrencyItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'currency') {
    throw new Error(`Item is not a currency: ${item.content}`);
  }

  return {
    matchedContent: item.content ?? '',
    confidence: item.confidence ?? 0,
    currency: {
      amount: item.valueCurrency?.amount ?? 0,
      currencyCode: item.valueCurrency?.currencyCode ?? '',
    },
  };
};

//See available fields here: https://github.com/Azure-Samples/document-intelligence-code-samples/blob/main/schema/2024-11-30-ga/invoice.md

export const extractLineItems = (
  document: AnalyzedDocumentOutput,
  organizationId: string
) => {
  const lineItems = document.fields?.[FieldItems.LineItems];

  if (!lineItems) {
    return [];
  }

  if (lineItems.type !== 'array' || !lineItems.valueArray) {
    throw new Error('Line items is not an array');
  }

  const lineItemResult: InvoiceItem[] = [];
  let position = 0;
  for (const item of lineItems.valueArray) {
    const lineItem: BaseInvoiceItem = {
      organizationId: organizationId,
      matchedRowContent: item.content || '',
      confidence: item.confidence || 0,
      position: ++position,
      unit: extractStringItem(item.valueObject?.[LineItemFieldItems.Unit]),
      amount: extractCurrencyItem(
        item.valueObject?.[LineItemFieldItems.Amount]
      ),
      quantity: extractNumberItem(
        item.valueObject?.[LineItemFieldItems.Quantity]
      ),
      unitPrice: extractCurrencyItem(
        item.valueObject?.[LineItemFieldItems.UnitPrice]
      ),
      description: extractStringItem(
        item.valueObject?.[LineItemFieldItems.Description]
      ),
      tax: extractCurrencyItem(item.valueObject?.[LineItemFieldItems.Tax]),
      taxRate: extractStringItem(
        item.valueObject?.[LineItemFieldItems.TaxRate]
      ),
      productCode: extractStringItem(
        item.valueObject?.[LineItemFieldItems.ProductCode]
      ),
      date: extractDateItem(item.valueObject?.[LineItemFieldItems.Date]),
    };

    lineItemResult.push(new InvoiceItem(lineItem));
  }

  return lineItemResult;
};

export const computeAnalyzeResult = (
  organizationId: string,
  documentId: string,
  result?: AnalyzeResultOutput
) => {
  return {
    raw: result,
    invoices:
      result?.documents?.map((document) =>
        computeInvoice(document, organizationId, documentId)
      ) || [],
  };
};

export const computeInvoice = (
  document: AnalyzedDocumentOutput,
  organizationId: string,
  documentId: string
) => {
  const lineItems = extractLineItems(document, organizationId);

  const invoice = new Invoice(
    {
      organizationId: organizationId,
      customerTaxId: extractStringItem(
        document.fields?.[FieldItems.CustomerTaxId]
      ),
      invoiceDate: extractDateItem(document.fields?.[FieldItems.InvoiceDate]),
      invoiceNumber: extractStringItem(document.fields?.[FieldItems.InvoiceId]),
      invoiceTotal: extractCurrencyItem(
        document.fields?.[FieldItems.InvoiceTotal]
      ),
      matchedCustomerName: extractStringItem(
        document.fields?.[FieldItems.CustomerName]
      ),
      matchedVendorName: extractStringItem(
        document.fields?.[FieldItems.VendorName]
      ),
      matchedPurchaseOrderNumber: extractStringItem(
        document.fields?.[FieldItems.PurchaseOrder]
      ),
      paymentTerm: extractStringItem(document.fields?.[FieldItems.PaymentTerm]),
      subTotal: extractCurrencyItem(document.fields?.[FieldItems.SubTotal]),
      totalTax: extractCurrencyItem(document.fields?.[FieldItems.TotalTax]),
      vendorTaxId: extractStringItem(document.fields?.[FieldItems.VendorTaxId]),
    },
    documentId
  );

  invoice.addItems(lineItems);

  return invoice;
};
