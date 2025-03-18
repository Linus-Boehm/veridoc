import { cn } from '#lib/utils.ts';

import cellExpansion from './components/cell_expansion.module.css';
import cells from './components/cells.module.css';
import checkboxColumn from './components/checkbox_column.module.css';
import columnGroups from './components/column_groups.module.css';
import columnHeader from './components/column_header.module.css';
import footerRow from './components/footer_row.module.css';
import interactive from './components/interactive.module.css';
import pinnedColumns from './components/pinned_columns.module.css';
import row from './components/row.module.css';
import rowGroups from './components/row_groups.module.css';
import selection from './components/selection.module.css';
import theme from './theme.module.css';
import variables from './variables.module.css';

export const DataGridStyles = cn(
  variables.variables,
  theme.theme,
  cells.cells,
  cellExpansion.cellExpansion,
  selection.selection,
  rowGroups.rowGroups,
  pinnedColumns.pinnedColumns,
  interactive.interactive,
  footerRow.footerRow,
  columnHeader.columnHeader,
  checkboxColumn.checkbox,
  row.row,
  columnGroups.columnGroups
);
