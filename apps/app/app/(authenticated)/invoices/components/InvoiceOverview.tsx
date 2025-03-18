'use client';
import { DataGridProvider } from '@repo/design-system/components/datagrid/DataGridProvider';
import { NavigateToCellWrapper } from '@repo/design-system/components/datagrid/cells/NavigateToCellWrapper';
import type { CellRendererProps } from '@repo/design-system/components/datagrid/cells/types';
import { createColumn } from '@repo/design-system/components/datagrid/columnHelpers';
import type { ColDef } from '@repo/design-system/components/datagrid/columns';
import type { InvoiceDTO } from '@taxel/domain/src/invoice';
import { useInvoices } from '@taxel/queries/src/invoices';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';
import { InvoiceTable } from './InvoiceTable';


export const InvoiceOverview: FC = () => {
  const { data: invoices } = useInvoices();

  const coldDefs = useMemo((): ColDef<InvoiceDTO>[] => {
    return [
      createColumn<InvoiceDTO, string>({
        colId: 'fileName',
        headerName: 'Name',
        type: 'text',
        valueGetter: (row) => row.data?.document?.fileName,
        cellRenderer: (props: CellRendererProps<InvoiceDTO, string>) => (
          <NavigateToCellWrapper
            element={props.eGridCell}
            openButton={
              <Link href={`/invoices/${props.data?.id}`} prefetch={false}>
                Öffnen <ExternalLink className="ml-1 size-3 font-xs" />
              </Link>
            }
          >
            {props.value}
          </NavigateToCellWrapper>
        ),
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'invoiceDate',
        headerName: 'Invoice Date',
        type: 'date',
        valueGetter: (row) => row.data?.invoiceDate?.value,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'invoiceTotal',
        headerName: 'Invoice Total',
        type: 'currency',
        valueGetter: (row) => row.data?.invoiceTotal?.currency.amount,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'invoiceNumber',
        headerName: 'Invoice Number',
        type: 'text',
        valueGetter: (row) => row.data?.invoiceNumber?.value,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'paymentTerm',
        headerName: 'Payment Term',
        type: 'text',
        valueGetter: (row) => row.data?.paymentTerm?.value,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'matchedCustomerName',
        headerName: 'Customer',
        type: 'text',
        valueGetter: (row) => row.data?.matchedCustomerName?.value,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'matchedPurchaseOrderNumber',
        headerName: 'Purchase Order Number',
        type: 'text',
        valueGetter: (row) => row.data?.matchedPurchaseOrderNumber?.value,
      }),
      createColumn<InvoiceDTO, string>({
        colId: 'matchedVendorName',
        headerName: 'Vendor',
        type: 'text',
        valueGetter: (row) => row.data?.matchedVendorName?.value,
      }),
    ];
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <DataGridProvider
        rows={invoices ?? []}
        isLoading={false}
        colDefs={coldDefs}
      >
        <InvoiceTable />
      </DataGridProvider>
    </div>
  );
};
