'use client';

import { cn } from '../../../lib/utils';
import { CloudUpload } from 'lucide-react';
import { type DropEvent, type DropzoneOptions, type FileRejection, useDropzone } from 'react-dropzone';

export interface DropzoneProps extends Pick<DropzoneOptions, 'maxFiles' | 'maxSize' | 'minSize'> {
  /* MIME type as key and array of file extensions as value */
  acceptedFiles?: Record<string, string[]>;

  description?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;

  /* Callback function to handle file upload */
  onDrop: (files: File[], fileRejections: FileRejection[], event: DropEvent) => void;
  /* Callback function to handle file rejection */
  onDropRejected?: (fileRejections: FileRejection[], event: DropEvent) => void;
}

export function Dropzone({
  maxFiles,
  acceptedFiles = {},
  onDrop,
  onDropRejected,
  disabled = false,
  description,
  className,
  maxSize,
  minSize,
}: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled,
    maxFiles,
    accept: acceptedFiles,
    onDrop,
    multiple: maxFiles !== 1,
    maxSize,
    minSize,
    onDropRejected,
  });

  return (
    <div
      {...getRootProps({
        'data-disabled': disabled,
        className:
          className ||
          cn(
            'group rounded-xl border border-gray-200 data-[disabled=true]:bg-gray-50 hover:cursor-pointer hover:data-[disabled=true]:cursor-not-allowed',
            isDragActive ? 'outline outline-2 outline-primary-600' : ''
          ),
      })}
    >
      <input
        {...getInputProps({
          disabled,
          'data-testid': 'dropzone-input',
        })}
      />
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-4">
        <div className="inline-flex size-10 items-center justify-center rounded-lg border border-gray-200 shadow-xs">
          <CloudUpload className={cn('size-5 text-primary-700 group-data-[disabled=true]:text-gray-400')} />
        </div>
        <section className="flex flex-col items-center justify-center gap-1 text-sm text-primary-700 group-data-[disabled=true]:text-gray-300">
          <p>
            <strong className="font-semibold text-primary group-data-[disabled=true]:text-gray-300">
              Klicken oder Drag & Drop
            </strong>{' '}
            um Dateien hochzuladen
          </p>
          <p className="text-xs">{description}</p>
        </section>
      </div>
    </div>
  );
}
