'use client';
import { DataGridProvider } from '@repo/design-system/components/datagrid/DataGridProvider';
import { NavigateToCellWrapper } from '@repo/design-system/components/datagrid/cells/NavigateToCellWrapper';
import type { CellRendererProps } from '@repo/design-system/components/datagrid/cells/types';
import { createColumn } from '@repo/design-system/components/datagrid/columnHelpers';
import { formatDate } from '@repo/design-system/lib/utils';
import type { CompanyDTO } from '@taxel/domain/src/company';
import { useCompanies } from '@taxel/queries/src/companies';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';
import { useMemo } from 'react';
import { CompanyTable } from './CompanyTable';
import { CreateCompanyModal } from './CreateCompanyModal';

export const CompanyOverview: FC = () => {
  const { data: companies } = useCompanies();

  const coldDefs = useMemo(() => {
    return [
      createColumn<CompanyDTO, string>({
        colId: 'ext_vendor_number',
        headerName: 'Lieferantennummer',
        type: 'text',
        valueGetter: (row) => row.data?.ext_vendor_number || '',
      }),
      createColumn<CompanyDTO, string>({
        colId: 'name',
        headerName: 'Name',
        type: 'text',
        valueGetter: (row) => row.data?.name,
        cellRenderer: (props: CellRendererProps<CompanyDTO, string>) => (
          <NavigateToCellWrapper
            element={props.eGridCell}
            openButton={
              <Link href={`/companies/${props.data?.id}`} prefetch={false}>
                Öffnen <ExternalLink className="ml-1 size-3 font-xs" />
              </Link>
            }
          >
            {props.value}
          </NavigateToCellWrapper>
        ),
      }),
      createColumn<CompanyDTO, string>({
        colId: 'countryCode',
        headerName: 'Land',
        type: 'text',
        valueGetter: (row) => row.data?.countryCode,
      }),
      createColumn<CompanyDTO, string>({
        colId: 'vatId',
        headerName: 'USt-ID',
        type: 'text',
        valueGetter: (row) => row.data?.vatId,
      }),
      createColumn<CompanyDTO, string>({
        colId: 'primaryAddress',
        headerName: 'Hauptadresse',
        type: 'text',
        valueGetter: (row) => {
          const primaryAddress = row.data?.addresses?.find((a) => a.isPrimary);
          return primaryAddress
            ? `${primaryAddress.addressLine1}, ${primaryAddress.postalCode} ${primaryAddress.locality || ''}`
            : '';
        },
      }),
      createColumn<CompanyDTO, string>({
        colId: 'primaryDomain',
        headerName: 'Domain',
        type: 'text',
        valueGetter: (row) => {
          const primaryDomain = row.data?.domains?.find((d) => d.isPrimary);
          return primaryDomain
            ? primaryDomain.domain
            : row.data?.domains?.[0]?.domain || '';
        },
      }),
      createColumn<CompanyDTO, string>({
        colId: 'createdAt',
        headerName: 'Erstellt am',
        type: 'date',
        valueGetter: (row) => formatDate(row.data?.createdAt),
      }),
    ];
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold text-lg">Unternehmen</h2>
        <CreateCompanyModal />
      </div>
      <DataGridProvider
        rows={companies ?? []}
        isLoading={false}
        colDefs={coldDefs}
      >
        <CompanyTable />
      </DataGridProvider>
    </div>
  );
};
