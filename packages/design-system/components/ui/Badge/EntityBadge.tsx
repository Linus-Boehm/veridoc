import { cloneElement, FC } from 'react';
import { Skeleton } from '../skeleton';
import { cn } from '#lib/utils.ts';
import { LinkWrapper } from '#components/CustomLink.tsx';

export interface BaseEntityBadgeProps {
  isLoading?: boolean;
  title?: string;
  className?: string;
  id?: string;
}

export interface EntityBadgeProps extends BaseEntityBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactElement<{ className?: string }>;
  isLoading?: boolean;
  href?: string;
}

export const EntityBadge: FC<EntityBadgeProps> = ({ children, icon, isLoading, href, className, ...props }) => {
    if(isLoading) {
        return <Skeleton className="h-6 w-32" />
    }
  return (
    <LinkWrapper href={href}>
      <span className={cn("inline-flex items-center max-w-full rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200", 
        href && "cursor-pointer hover:bg-gray-50 ring-gray-300 transition-colors", 
        className)} 
        {...props}
      >
        <span className="inline-flex w-full items-center gap-x-1.5 overflow-hidden">
          {icon && 
            cloneElement(icon, { 
              className: cn(icon.props.className, "h-4 w-4 flex-shrink-0")
            })
          }
          <span className="truncate min-w-0 w-full">{children}</span>
        </span>
      </span>
    </LinkWrapper>
  );
};




