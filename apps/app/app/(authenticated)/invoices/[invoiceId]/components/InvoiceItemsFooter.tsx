import { InvoiceDTO } from "@taxel/domain/src/invoice";

export interface InvoiceItemsFooterProps {
  invoice?: InvoiceDTO;
}

export const InvoiceItemsFooter = ({ invoice }: InvoiceItemsFooterProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex ml-auto">
          Summe: {invoice?.subTotal?.currency.amount}
        </div>
      </div>
      <div className="flex">
        <div className="flex ml-auto">
        Steuerbetrag: {invoice?.totalTax?.currency.amount}
        </div>
      </div>
      <div className="flex">
        <div className="flex ml-auto">
          Gesamtbetrag: {invoice?.invoiceTotal?.currency.amount}
        </div>
      </div>
    </div>
  );
};
