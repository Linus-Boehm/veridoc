import * as ProgressPrimitive from '@radix-ui/react-progress';
import { type ComponentPropsWithoutRef, type ElementRef, type ForwardedRef, forwardRef } from 'react';
import { cn } from '../../../lib/utils';

const ProgressInner = (
  { className, value, ...props }: ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
  ref: ForwardedRef<ElementRef<typeof ProgressPrimitive.Root>>
) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="size-full flex-1 rounded-full bg-primary-600 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
);

ProgressInner.displayName = ProgressPrimitive.Root.displayName;
const Progress = forwardRef(ProgressInner);

export { Progress };
