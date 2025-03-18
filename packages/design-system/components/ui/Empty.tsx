
import { cn } from '#lib/utils.ts';
import type { ReactElement } from 'react';
import { cloneElement, type HTMLAttributes, type ReactNode } from 'react';

type EmptyProps = {
  icon: ReactElement<HTMLAttributes<SVGElement>>;
  title: string;
  description?: string | ReactElement;
  button?: ReactNode;
} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

export const Empty = ({ icon, title, description, button, className }: EmptyProps) => {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      {cloneElement(icon, {
        ...icon.props,
        className: cn('mx-auto size-12 text-gray-400', icon.props.className),
      })}
      <h3 className="mt-2 text-sm font-semibold text-primary-text">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-secondary-text">{description}</p>}
      {button && <div className="mt-6">{button}</div>}
    </div>
  );
};
