import { useApiClient } from './ApiClient';


export const useCreateUpload = () => {
  const apiClient = useApiClient();
 return async (
  file: File,
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
) => {
  const response = await apiClient.documents.uploads.$post({
    json: {
      file_name: file.name,
    },
  });
  const upload = await response.json();

  if(!upload.storageResource.putUrl) {
    throw new Error('Document creation failed: No put URL');
  }
  
  try {
    await uploadToS3(file, new URL(upload.storageResource.putUrl), onProgress, abortSignal);
    await apiClient.documents['upload-acknoledge'].$post({
      json: {
        key: upload.storageResource.key,
      },
    });
  } catch (e) {
    console.error(e);
    //TODO: Update the upload status to failed
    throw e;
  }

  return upload;
  };
};

const uploadToS3 = (
  file: File,
  uploadUrl: URL,
  onProgress?: (progress: number) => void,
  abortSignal?: AbortSignal
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);

    let lastProgressTime = Date.now();
    const CONNECTION_TIMEOUT = 30_000; // 30 second timeout for no progress

    xhr.upload.onprogress = (event) => {
      lastProgressTime = Date.now();
      onProgress?.(event.loaded);
    };

    // Check for connection loss every 5 seconds
    const connectionCheckInterval = setInterval(() => {
      if (Date.now() - lastProgressTime > CONNECTION_TIMEOUT) {
        clearInterval(connectionCheckInterval);
        xhr.abort();
        reject(
          new Error(
            'Upload failed: Connection lost - no progress for 30 seconds'
          )
        );
      }
    }, 5000);

    abortSignal?.addEventListener('abort', () => {
      clearInterval(connectionCheckInterval);
      xhr.abort();
      console.warn('Upload aborted');
    });

    xhr.onload = () => {
      clearInterval(connectionCheckInterval);
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(xhr.response);
      } else {
        console.error('Upload failed:', xhr.statusText);
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      clearInterval(connectionCheckInterval);
      console.error('Upload error:', xhr.statusText);
      reject(new Error(`Upload error: ${xhr.statusText}`));
    };

    xhr.send(file);
  });
};
