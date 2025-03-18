'use client';
import { AgGridReact } from 'ag-grid-react';
import { Grid2x2X } from 'lucide-react';
import type { FC } from 'react';
import { Empty } from '#components/ui/Empty.tsx';
import { cn } from '#lib/utils.ts';
import { useDataGridContext } from './DataGridProvider';

interface DataGridProps {
  className?: string;
}

export const DataGrid: FC<DataGridProps> = ({ className }) => {
  const { gridRef, rows, isLoading, colDefs } = useDataGridContext();
  return (
    <div className={cn('flex flex-1 flex-1 flex-col', className)}>
      <div className={cn('relative h-full w-full')}>
        <AgGridReact
          animateRows={false}
          ref={gridRef}
          rowData={rows}
          columnDefs={colDefs}
          noRowsOverlayComponent={() => (
            <Empty
              icon={<Grid2x2X />}
              title={'Keine Ergebnisse gefunden'}
              description={
                'Bitte ändern Sie Ihre Suchkriterien und versuchen Sie es erneut.'
              }
            />
          )}
        />
      </div>
    </div>
  );
};
