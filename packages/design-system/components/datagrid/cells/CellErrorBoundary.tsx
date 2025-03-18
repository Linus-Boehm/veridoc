import { AlertTriangle } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';

const CellErrorDisplay = () => {

  return (
    <div className="flex items-center text-sm text-error">
      <AlertTriangle className="mr-1 size-3" />
      <span>Fehler</span>
    </div>
  );
};

interface CellErrorBoundaryProps {
  children: ReactNode;
}

interface CellErrorBoundaryState {
  hasError: boolean;
}

/**
 * CellErrorBoundary is a React component designed to catch and handle errors
 * specifically in AG Grid custom cell renderers. By wrapping the custom cell
 * renderer with this boundary, it ensures that errors in individual cells are
 * caught without crashing the entire grid or page.
 *
 * Usage:
 * - Wrap any custom AG Grid cell renderer with this component to ensure that
 *   errors are localized to the cell level.
 * - The component will render a simple fallback UI (e.g., "Error") in case an
 *   error occurs, and you can customize this fallback as needed.
 * - Error details will be logged to the console for debugging or reporting.
 *
 * Example:
 * ```tsx
 * const CustomCellRenderer = (props) => {
 *   return (
 *     <CellErrorBoundary>
 *       <div>{props.value}</div>
 *     </CellErrorBoundary>
 *   );
 * };
 * ```
 *
 * @component
 * @example
 * ```tsx
 * const columnDefs = [
 *   {
 *     headerName: 'Custom Column',
 *     field: 'customField',
 *     cellRendererFramework: CustomCellRenderer,
 *   },
 * ];
 * ```
 *
 * @param {ReactNode} children - The content of the cell renderer wrapped by the boundary.
 * @returns {ReactNode} Either the children or the fallback UI if an error occurs.
 */
class CellErrorBoundary extends Component<
  CellErrorBoundaryProps,
  CellErrorBoundaryState
> {
  constructor(props: CellErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): CellErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error in AG Grid Cell Renderer:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <CellErrorDisplay />;
    }
    return this.props.children;
  }
}

export { CellErrorBoundary };
