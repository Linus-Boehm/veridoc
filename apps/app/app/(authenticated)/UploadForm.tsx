'use client';
import { useCreateUpload } from '../../services/upload';
import { DropzoneSingleFileUpload } from '@repo/design-system/components/ui/FileUpload/DropzoneSingleFileUpload';
import { Button } from '@repo/design-system/components/ui/button';
import { type FC, useState } from 'react';
import { ErrorCode, type FileRejection } from 'react-dropzone';

interface FormError {
  code: string;
  message: string;
}

export const UploadForm: FC = () => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const createUpload = useCreateUpload();
  const [uploading, setUploading] = useState<boolean>(false);
  const handleFileChange = (files: File[], fileRejections: FileRejection[]) => {
    if (files.length > 0) {
      setFile(files[0]);
    }
  };
  const handleUpload = async () => {
    if (!file) {
      return;
    }

    const upload = await createUpload(file, (progress) => {
      console.log(progress);
    });

    console.log(upload);
  };

  const [error, setError] = useState<FormError | null>(null);

  const hasTooManyFilesError = (fileRejections: FileRejection[]) => {
    return fileRejections.some((error) =>
      error.errors.some((error) => error.code === ErrorCode.TooManyFiles)
    );
  };

  const handleFileErrors = (fileRejections: FileRejection[]) => {
    if (fileRejections.length === 0) {
      return;
    }
    // we can only display one error, if there is `ErrorCode.TooManyFiles` we display that one with priority
    if (hasTooManyFilesError(fileRejections)) {
      setFileError(ErrorCode.TooManyFiles);
    } else {
      // pick any other error
      setFileError(fileRejections[0].errors[0].code as ErrorCode);
    }
  };

  const handleDropRejected = (fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      handleFileErrors(fileRejections);
    }
  };

  const setFileError = (errorCode: ErrorCode) => {
    switch (errorCode) {
      case ErrorCode.TooManyFiles:
        setError({
          code: errorCode,
          message: 'You can only upload one file at a time',
        });
        break;
      case ErrorCode.FileTooLarge:
        setError({
          code: errorCode,
          message: 'The file is too large',
        });
        break;
      case ErrorCode.FileTooSmall:
        setError({
          code: errorCode,
          message: 'The file is too small',
        });
        break;
      case ErrorCode.FileInvalidType:
        setError({
          code: errorCode,
          message: 'The file type is not supported',
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <DropzoneSingleFileUpload
        onDropRejected={handleDropRejected}
        maxFiles={1}
        hasError={!!error}
        onChange={handleFileChange}
        file={file}
      />
      {file && (
        <div className="flex flex-col gap-2">
          <p>{file.name}</p>

          <Button onClick={handleUpload}>Upload</Button>
        </div>
      )}
    </div>
  );
};
