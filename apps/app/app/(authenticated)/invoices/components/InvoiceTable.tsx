'use client';
import { DataGrid } from '@repo/design-system/components/datagrid/DataGrid';
import { CreateCompanyModal } from '#app/(authenticated)/companies/components/CreateCompanyModal.tsx';

export const InvoiceTable = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold text-lg">Rechnungen</h2>
        <CreateCompanyModal />
      </div>
      <DataGrid />
    </div>
  );
};
