import type { ColDef as AGColdDef } from 'ag-grid-community';
import type { CustomColDef } from './columns';

export function createColumn<TData extends Record<string, unknown>, TValue>(
  colDef: CustomColDef<TData>
): AGColdDef<TData, TValue> {
  const { cellRenderer, type, ...rest } = colDef;
  return {
    ...rest,
    type,
    cellRenderer: cellRenderer ? cellRenderer : undefined,
  };
}
