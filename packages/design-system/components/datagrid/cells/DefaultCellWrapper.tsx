import type { CustomCellRendererProps } from 'ag-grid-react';
import type { ComponentType, FunctionComponent } from 'react';
import { cn } from '#lib/utils.ts';
import { CellErrorBoundary } from './CellErrorBoundary';

export interface DefaultCellWrapperCellProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  cellClass?: string | string[];
  cellRenderer?:
    | ComponentType<CustomCellRendererProps<TData>>
    | FunctionComponent<CustomCellRendererProps<TData>>;
}

export function DefaultCellWrapper<TData extends Record<string, unknown>>(
  props: CustomCellRendererProps<TData>
) {
  return ({
    cellClass,
    cellRenderer,
  }: DefaultCellWrapperCellProps<TData> & CustomCellRendererProps<TData>) => {
    const className =
      cellClass && Array.isArray(cellClass) ? cellClass.join(' ') : cellClass;
    const CellRenderer = cellRenderer;

    return (
      <div className={cn('cell-expand-grid-cell leading-normal', className)}>
        <CellErrorBoundary>
          {CellRenderer ? (
            <CellRenderer {...props} />
          ) : (
            <>{props.valueFormatted ?? props.value}</>
          )}
        </CellErrorBoundary>
      </div>
    );
  };
}
