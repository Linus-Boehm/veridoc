'use client';
import { ArrowRightIcon, PenLineIcon } from 'lucide-react';
import { useEventListener } from '#hooks/useHandler.ts';
import { useHotkeys } from '#hooks/useHotKeys.ts';
import { useMutationObserver } from '#hooks/useMutationObserver.ts';
import { cn } from '#lib/utils.ts';

import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '#components/ui/button.tsx';

interface NavigateToCellWrapperProps extends HTMLAttributes<HTMLDivElement> {
  element: HTMLElement;
  children?: ReactNode;
  openButton?: ReactNode;
  onClick?: () => void;
  mode?: 'open' | 'edit';
}

export const NavigateToCellWrapper: FC<NavigateToCellWrapperProps> = ({
  children,
  className,
  element,
  onClick,
  openButton = 'Öffnen',
  mode = 'open',
  ...divProps
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const [parentHasFocus, setParentHasFocus] = useState(false);
  const [parentClassList, setParentClassList] = useState<string[]>([]);
  const [nonPinnedRowHover, setNonPinnedRowHover] = useState(false);
  const cellWrapperRef = useRef(element);

  const Icon = mode === 'edit' ? PenLineIcon : ArrowRightIcon;

  useHotkeys(
    cellWrapperRef,
    [
      [
        'Enter',
        () =>
          !onClick || (!hasFocus && !parentHasFocus) ? undefined : onClick(),
      ],
    ],
    { dependencies: [onClick, hasFocus] }
  );

  const handleFocus = useCallback(() => {
    setHasFocus(true);
  }, []);
  const handleBlur = useCallback(() => {
    setHasFocus(false);
  }, []);

  useEventListener(cellWrapperRef, 'focus', handleFocus, [
    cellWrapperRef.current,
  ]);
  useEventListener(cellWrapperRef, 'blur', handleBlur, [
    cellWrapperRef.current,
  ]);

  const updateClassList = useCallback((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        setParentClassList([
          ...((mutation.target as HTMLElement)?.classList ?? []),
        ]);
      }
    });
  }, []);

  useMutationObserver(cellWrapperRef.current.parentElement, updateClassList, {
    attributes: true,
    attributeFilter: ['class'],
  });

  useEffect(() => {
    // check if the parent (row) has focus as sometimes we have wrapper cells around this cell
    if (parentClassList.includes('ag-row-focus')) {
      setParentHasFocus(true);
    } else {
      setParentHasFocus(false);
    }

    // ag-grid divides the row into pinned and non-pinned cells, which live in different containers but the class will be set regardless even if you hover on the non-pinned cell of the same row
    if (parentClassList.includes('ag-row-hover')) {
      setNonPinnedRowHover(true);
    } else {
      setNonPinnedRowHover(false);
    }
  }, [parentClassList]);

  return (
    <div
      className={cn('cell-expand-text group/cell relative w-full', className)}
      {...divProps}
    >
      {children}
      <Button
        asChild
        variant={'outline'}
        size={'sm'}
        className={cn(
          // custom
          'group/openButton',
          // Base layout
          'flex h-6 flex-none items-center justify-center',
          // Spacing
          'gap-0.5 px-1.5 py-0.5',
          // Typography
          'whitespace-nowrap',
          
          // Disabled states
          'disabled:pointer-events-none disabled:border-primary-200 disabled:bg-primary-200',
    
          '-translate-y-1/2 absolute top-1/2 right-1 group-focus/cell:right-[-3px]',
          nonPinnedRowHover ? 'flex' : 'hidden',
          parentHasFocus ? 'group-hover/cell:flex' : ''
        )}
      >
          {openButton}
          
      </Button>
    </div>
  );
};
