'use client';
import { DataGridProvider } from '@repo/design-system/components/datagrid/DataGridProvider';
import { createColumn } from '@repo/design-system/components/datagrid/columnHelpers';
import type { ColDef } from '@repo/design-system/components/datagrid/columns';
import type { InvoiceItemDTO } from '@taxel/domain/src/invoice';
import type { FC } from 'react';
import { useMemo } from 'react';
import { LineItemTable } from './LineItemTable';

export interface LineItemOverviewProps {
  invoice?: InvoiceDTO;
}

export const LineItemOverview: FC<LineItemOverviewProps> = ({ invoice }) => {
  const coldDefs = useMemo((): ColDef<InvoiceItemDTO>[] => {
    return [
      createColumn<InvoiceItemDTO, string>({
        colId: 'position',
        headerName: 'Position',
        type: 'text',
        valueGetter: (row) => row.data?.position,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'productCode',
        headerName: 'Artikelnummer',
        type: 'text',
        valueGetter: (row) => row.data?.productCode?.value,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'description',
        headerName: 'Beschreibung',
        type: 'text',
        valueGetter: (row) => row.data?.description?.value,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'quantity',
        headerName: 'Menge',
        type: 'text',
        valueGetter: (row) => row.data?.quantity?.value,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'taxRate',
        headerName: 'MwSt',
        type: 'text',
        valueGetter: (row) => row.data?.taxRate?.value,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'tax',
        headerName: 'Steuerbetrag',
        type: 'text',
        valueGetter: (row) =>
          `${row.data?.tax?.currency.amount ?? ''} ${row.data?.tax?.currency.currencyCode || ''}`,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'total',
        headerName: 'Stückpreis',
        type: 'text',
        valueGetter: (row) =>
          `${row.data?.unitPrice?.currency.amount ?? ''} ${row.data?.unitPrice?.currency.currencyCode || ''}`,
      }),
      createColumn<InvoiceItemDTO, string>({
        colId: 'total',
        headerName: 'Gesamtpreis',
        type: 'text',
        valueGetter: (row) =>
          `${row.data?.amount?.currency.amount ?? ''} ${row.data?.amount?.currency.currencyCode || ''}`,
      }),
    ];
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <DataGridProvider
        rows={invoice?.items ?? []}
        isLoading={false}
        colDefs={coldDefs}
      >
        <LineItemTable />
      </DataGridProvider>
    </div>
  );
};
