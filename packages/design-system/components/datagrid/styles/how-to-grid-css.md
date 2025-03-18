# Grid CSS Styling Structure

This documentation provides a structured guide for organizing and using CSS files to style our AG Grid
components effectively. Each file targets a specific aspect of the grid styling, helping to maintain
consistency, reusability, and separation of concerns.

---

## Usage Guidelines

1. **Keep Files Focused**: Each file should only contain styles specific to its purpose. Avoid mixing styles
   across different functional areas.
2. **Utilize Variables**: Reference values from `_variables.css` whenever possible to maintain theme
   consistency.
3. **Avoid Inline Styles**: Keep styling in these CSS files instead of inline to ensure all grid styles are
   centralized and easy to maintain.
4. **Testing**: After modifying styles, test on all major grid tables (Articles, Suppliers, Documents, etc.)
   to verify consistency.

## Files and Their Purposes

### 1. `variables.module.css`

- **Purpose**: Holds all AG Grid custom properties and reusable global values.

- **Contents**:

  - AG Grid-specific custom properties
  - Global theme values
  - Any reusable variables used across grid styles

### 2. `theme.module.css`

- **Purpose**: Defines core visual styles and basic AG Grid theme overrides.

- **Contents**:

  - General AG Grid theme customizations
  - Core styling that affects the grid's look and feel

### 3. `cells.module.css`

- **Purpose**: Manages base cell appearance and layout.

- **Contents**:

  - Cell padding, borders, and basic cell structure
  - Styles for invalid states
  - Quick filter highlights

### 4. `cell_expansion.module.css`

- **Purpose**: Defines expansion behavior and content overflow management.

- **Contents**:

  - Expanded state styling for cells
  - Styling for different content types within expanded cells (e.g., text, badges)

### 5. `column_header.module.css`

- **Purpose**: Specifies header cell styling and structural layout.

- **Contents**:

  - Header cell styles, including alignment and separators
  - Header grouping styles and bottom alignment

### 6. `pinned_columns.module.css`

- **Purpose**: Manages styles for pinned columns and z-index layering.

- **Contents**:

  - Shadow effects and behavior for pinned columns
  - Z-index management specifically for pinned columns

### 7. `row_groups.module.css`

- **Purpose**: Provides styling for row groups and hierarchical indicators.

- **Contents**:

  - Group row styling, including hierarchy indicators
  - Group checkbox styling and expand/collapse behavior

### 8. `selection.module.css`

- **Purpose**: Manages styles related to row and range selection.

- **Contents**:

  - Row and range selection visuals
  - Focus states for selected rows or ranges

### 9. `interactive.module.css`

- **Purpose**: Defines styles for interactive elements within the grid.

- **Contents**:

  - Styling for select lists and menu items
  - Badge and tag styles within the grid context

### 10. `checkbox_column.module.css`

- **Purpose**: Manages styles for checkbox columns and selection behavior.

- **Contents**:

  - Checkbox column styling, including hover and selection states

### 11. `footer_row.module.css`

- **Purpose**: [Docs TBD]

### 12. `column_groups.module.css`

- **Purpose**: Defines styles for column groups and column group separators.
- **Contents**:
  - Defines separators between columns when there are column groups
  - Defines header behavior for column groups
