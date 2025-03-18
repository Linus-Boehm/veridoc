import { cn } from "#lib/utils.ts";
import { cloneElement, FC } from "react";
import { tv } from 'tailwind-variants';
import { Skeleton } from "../skeleton";

export interface StatusBadgeProps {
    children: React.ReactNode;
    className?: string;
    color?: ColorVariants;
    isLoading?: boolean;
    title?: string;
    icon?: React.ReactElement<{ className?: string }>;
}

export type ColorVariants = 'neutral' | 'error' | 'warning' | 'success' | 'info' | 'primary' | 'accent_purple' | 'accent_pink'


 
const statusBadge = tv({
  base: 'inline-flex items-center max-w-full rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
  variants: {
    color: {
      neutral: 'bg-gray-50 text-gray-600 ring-gray-500/10 dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20',
      error: 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20',
      warning: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20',
      success: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20',
      info: 'bg-blue-50 text-blue-700 ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30',
      primary: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10 dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30',
      accent_purple: 'bg-purple-50 text-purple-700 ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30',
      accent_pink: 'bg-pink-50 text-pink-700 ring-pink-700/10 dark:bg-pink-400/10 dark:text-pink-400 dark:ring-pink-400/20',
    }
  },
  defaultVariants: {
    color: 'neutral'
  }
});

export const StatusBadge: FC<StatusBadgeProps> = ({ children, className, color, isLoading, title, icon }) => {
    if (isLoading) {
        return <Skeleton className="h-6 w-32" />;
    }
    return <span className={statusBadge({ color, className })} title={title}>
        <span className="inline-flex w-full items-center gap-x-1.5 overflow-hidden">
            {icon && 
            cloneElement(icon, { 
              className: cn(icon.props.className, "h-4 w-4 flex-shrink-0")
            })
          }
            <span className="truncate min-w-0 w-full">{children}</span>
        </span>
      </span>;
};

