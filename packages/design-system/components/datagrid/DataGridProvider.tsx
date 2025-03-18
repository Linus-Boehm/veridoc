'use client';
import type {} from 'ag-grid-community';
import type { AgGridReact } from 'ag-grid-react';
import {
  type PropsWithChildren,
  type RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import type { ColDef } from './columns';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export interface DataGridContextValue<TData extends Record<string, unknown>> {
  gridRef: RefObject<AgGridReact<TData> | null>;
  rows: TData[] | null | undefined;
  isLoading: boolean | undefined;
  colDefs: ColDef<TData>[];
}

const DataGridContext = createContext<
  DataGridContextValue<any> | undefined
>(undefined);


export interface DataGridProviderProps<TData extends Record<string, unknown>> {
  rows?: TData[] | null;
  isLoading?: boolean;
  colDefs: ColDef<TData>[];
}

export function DataGridProvider<TData extends Record<string, unknown>>({
  rows,
  isLoading,
  colDefs,
  children,
}: PropsWithChildren<DataGridProviderProps<TData>>) {
  const gridRef = useRef<AgGridReact<TData>>(null);

  const value = useMemo((): DataGridContextValue<TData> => ({ gridRef, rows, isLoading, colDefs }), [rows, isLoading, colDefs]);

  return (
    <DataGridContext.Provider
      value={value as unknown as DataGridContextValue<Record<string, unknown>>}
    >
      {children}
    </DataGridContext.Provider>
  );
}

export function useDataGridContext<
  TData extends Record<string, unknown>,
>(): DataGridContextValue<TData> {
  const context = useContext<DataGridContextValue<TData> | undefined>(
    DataGridContext
  );
  if (!context) {
    throw new Error(
      'useDataGridContext must be used within a DataGridProvider'
    );
  }
  return context;
}