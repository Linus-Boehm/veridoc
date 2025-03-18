import { parseError } from '@repo/observability/error';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};

/**
 * Formats a date to German standards (DD.MM.YYYY)
 * Uses Temporal API with fallback for browsers without support
 * @param date - Date to format (ISO string, Date object, or timestamp)
 * @param options - Options for formatting (defaults to German date format)
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number | undefined | null,
  options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  if (!date) return "";
  
  // Convert any input to a Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Check if the date is valid
  if (isNaN(dateObj.getTime())) return "";
  
  // Use standard Intl formatting (Temporal API support would require a polyfill)
  return new Intl.DateTimeFormat("de-DE", options).format(dateObj);
}
