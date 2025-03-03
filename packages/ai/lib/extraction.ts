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
import { keys } from '../keys';
import { type StringItem, type DateItem, type NumberItem, type CurrencyItem, InvoiceItem, type BaseInvoiceItem, Invoice } from "@taxel/domain/src/invoice"

export const FieldItems = {
  LineItems: 'Items',
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

export const extractDocumentFromUrl = async (url: string, organizationId: string, documentId: string) => {
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
    throw new Error(`Item is not a string: ${item.content}`);
  }

  return {
    matchedContent: item.content || '',
    confidence: item.confidence || 0,
    value: item.valueString || '',
  };
};

export const extractDateItem = (
  item?: DocumentFieldOutput
): DateItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'date') {
    throw new Error(`Item is not a date: ${item.content}`);
  }

  return {
    matchedContent: item.content || '',
    confidence: item.confidence || 0,
    value: item.valueDate || '',
  };
};

export const extractNumberItem = (
  item?: DocumentFieldOutput
): NumberItem | undefined => {
  if (!item) {
    return undefined;
  }

  if (item.type !== 'number') {
    throw new Error(`Item is not a number: ${item.content}`);
  }

  return {
    matchedContent: item.content || '',
    confidence: item.confidence || 0,
    value: item.valueNumber || 0,
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
    matchedContent: item.content || '',
    confidence: item.confidence || 0,
    currency: {
      amount: item.valueCurrency?.amount || 0,
      currencyCode: item.valueCurrency?.currencyCode || '',
    },
  };
};

export const extractLineItems = (document: AnalyzedDocumentOutput, organizationId: string) => {
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
      taxRate: extractNumberItem(
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

export const computeAnalyzeResult = (organizationId: string, documentId: string, result?: AnalyzeResultOutput) => {
  return {
    raw: result,
    invoices: result?.documents?.map((document) => computeInvoice(document, organizationId, documentId)) || [],
  };
};

export const computeInvoice = (document: AnalyzedDocumentOutput, organizationId: string, documentId: string) => {
  const lineItems = extractLineItems(document, organizationId);

  const invoice = new Invoice({
    organizationId: organizationId,
  }, documentId);

  invoice.addItems(lineItems);

  return invoice;
};
