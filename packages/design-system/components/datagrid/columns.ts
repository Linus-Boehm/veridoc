import type { ColDef as AGColdDef } from 'ag-grid-community';

type ColumnType =
  | 'boolean'
  | 'number'
  | 'percent'
  | 'currency'
  | 'text'
  | 'date'
  | 'dateTime'
  | 'singleSelect'
  | 'multiSelect'
  | 'richText';


  export type FilterType = 
    | 'text'
    | 'setMultiCellValue' // use when one cell can have multiple values
    | 'setSingleCellValue' // use when one cell can have only one value
    | 'number'
    | 'date'
    | 'boolean'
    | 'textAndSet'

interface BaseColumnDefinition<
  TData extends Record<string, unknown>,
  TType extends ColumnType,
  TFilter extends FilterType,
> extends AGColdDef<TData> {
  type?: TType;
  filter?: TFilter;
  colId: string;

}

export type CustomColDef<TData extends Record<string,unknown> = Record<string,unknown>> =
  
  | ({ type: 'boolean' } & BooleanColumnDefinition<TData>)
  | ({ type: 'number' } & DecimalColumnDefinition<TData>)
  | ({ type: 'percent' } & PercentageColumnDefinition<TData>)
  | ({ type: 'currency' } & CurrencyColumnDefinition<TData>)
  | ({ type: 'text' } & TextColumnDefinition<TData>)
  | ({ type: 'richText' } & RichTextColumnDefinition<TData>)
  | ({ type: 'date' } & DateColumnDefinition<TData>)
  | ({ type: 'dateTime' } & DateTimeColumnDefinition<TData>)
  | ({ type: 'singleSelect' } & SingleSelectColumnDefinition<TData>)
  | ({ type: 'multiSelect' } & MultiSelectColumnDefinition<TData>);


  type BooleanColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'boolean', 'boolean'>; 
  type DecimalColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'number', 'number'>; 
  type PercentageColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'percent', 'number'>; 
  type CurrencyColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'currency', 'number'>; 
  type TextColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'text', 'text'>; 
  type RichTextColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'richText', 'text'>; 
  type DateColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'date', 'date'>; 
  type DateTimeColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'dateTime', 'date'>; 
  type SingleSelectColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'singleSelect', 'text'>; 
  type MultiSelectColumnDefinition<TColumn extends Record<string,unknown>> =BaseColumnDefinition<TColumn, 'multiSelect', 'text'>; 
