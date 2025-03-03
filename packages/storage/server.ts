import 'server-only';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { keys } from './keys';

// Promisify pipeline for async/await

const s3Client = new S3Client({
  region: keys().S3_REGION, // Specify the AWS region from environment variables
  credentials: {
    accessKeyId: keys().S3_ACCESS_KEY_ID, // Access key ID from environment variables
    secretAccessKey: keys().S3_SECRET_ACCESS_KEY, // Secret access key from environment variables
  },
});

export const getSignedPutUrl = async (storagePath: string) => {
  const command = new PutObjectCommand({
    Bucket: keys().S3_BUCKET_NAME,
    Key: storagePath,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 15,
  });

  return signedUrl;
};

export const getSignedGetUrl = async (storagePath: string) => {
  const command = new GetObjectCommand({
    Bucket: keys().S3_BUCKET_NAME,
    Key: storagePath,
  });

  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 60 * 15,
  });

  return signedUrl;
};

export const downloadFileFromS3 = async (
  key: string
): Promise<ReadableStream> => {
  const command = new GetObjectCommand({
    Bucket: keys().S3_BUCKET_NAME,
    Key: key,
  });

  const response = await s3Client.send(command);

  if (!response.Body) {
    throw new Error('No body in response');
  }

  const fileBuffer = response.Body.transformToWebStream();

  return fileBuffer;
};
