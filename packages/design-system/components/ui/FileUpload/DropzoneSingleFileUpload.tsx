'use client';

import { type FileRejection } from 'react-dropzone';
import { DropzoneProps, Dropzone } from './Dropzone';
import { FileButton } from './FileButton';

interface DropzoneUploadProps extends Omit<DropzoneProps, 'onDrop'> {
  description?: string;
  hasError?: boolean;
  onChange?: (files: File[], fileRejections: FileRejection[]) => void;
  file?: File;
}

export function DropzoneSingleFileUpload({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasError,
  onChange,
  file,
  description,
  ...props
}: DropzoneUploadProps) {
  const handleDrop = (files: File[], fileRejections: FileRejection[]) => {
    onChange?.(files, fileRejections);
  };

  const handleDelete = () => {
    onChange?.([], []);
  };

  return (
    <div className="space-y-2">
      {!file && (
        <Dropzone
          onDrop={(files, fileRejections) => handleDrop(files, fileRejections)}
          {...props}
          description={description}
        />
      )}
      {file && (
        <div>
          <FileButton fileName={file.name} onClickDelete={() => handleDelete()} />
        </div>
      )}
    </div>
  );
}
