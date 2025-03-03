import { Loader2 } from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../../lib/utils';

export function Spinner({ className, ...props }: ComponentPropsWithoutRef<typeof Loader2>) {
  return <Loader2 className={cn('size-4 animate-spin text-secondary-text', className)} {...props} />;
}
