import { cn } from '../../../lib/utils';
import { FileText, Trash2 } from 'lucide-react';
import { FileType } from './types';
import { Spinner } from '../progress/Spinner';

type FileButtonProps = FileButtonContentsProps & {
  className?: string;
};

type FileButtonContentsProps = {
  fileName: string;
  onClickDelete?: () => void;
  onClick?: () => void;
  isLoading?: boolean;
};

export const FileButton = ({ fileName, onClickDelete, onClick, className, isLoading }: FileButtonProps) => {
  return (
    <div className={cn('rounded-lg border border-gray-200 p-2', className)}>
      <FileButtonContents {...{ fileName, onClickDelete, onClick, isLoading }} />
    </div>
  );
};

export const FileButtonContents = ({
  fileName,
  onClickDelete,
  onClick,
  isLoading,
}: FileButtonContentsProps) => {
  const { name, extension } = splitFileName(fileName);

  return (
    <div className="group flex w-full items-center justify-between gap-2">
      <div className="flex flex-row items-center gap-1">
        <div className="shrink-0 ">
          <FileText className="text-black h-5 w-5" />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
          className="flex cursor-pointer flex-row font-medium text-primary-600 underline hover:text-primary-800"
          title={fileName}
        >
          <span className="line-clamp-1 overflow-hidden text-ellipsis break-all text-left">{name}</span>
          <span className="text-left">{extension}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Trash2
          data-testid="delete"
          className={cn(
            'invisible size-4 cursor-pointer text-error-500',
            !isLoading && 'group-hover:visible'
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (isLoading) return;

            onClickDelete?.();
          }}
        />
        {isLoading && <Spinner />}
      </div>
    </div>
  );
};

export function splitFileName(fileName: string): { name: string; extension: string } {
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { name: fileName, extension: '' }; // No extension
  }

  return {
    name: fileName.substring(0, lastDotIndex + 1),
    extension: fileName.substring(lastDotIndex + 1),
  };
}
