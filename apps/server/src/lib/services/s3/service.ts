// import {
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
//   HeadObjectCommand,
//   ListObjectsV2Command,
//   CopyObjectCommand,
// } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { getClient, getConfig } from './client.js';
// import type { Readable } from 'stream';

// type BucketType = 'default' | 'audio';

// function getBucketName(bucketType: BucketType): string {
//   const config = getConfig();
//   return bucketType === 'audio' ? config.audioBucket : config.bucket;
// }

// // ============================================
// // UPLOAD OPERATIONS
// // ============================================

// export async function upload(
//   key: string,
//   body: Buffer | Readable | string,
//   contentType: string,
//   bucketType: BucketType = 'default'
// ): Promise<string> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   await client.send(
//     new PutObjectCommand({
//       Bucket: bucket,
//       Key: key,
//       Body: body,
//       ContentType: contentType,
//     })
//   );

//   return `${getConfig().publicUrl}/${key}`;
// }

// export async function uploadWithMetadata(
//   key: string,
//   body: Buffer | Readable | string,
//   contentType: string,
//   metadata: Record<string, string>,
//   bucketType: BucketType = 'default'
// ): Promise<string> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   await client.send(
//     new PutObjectCommand({
//       Bucket: bucket,
//       Key: key,
//       Body: body,
//       ContentType: contentType,
//       Metadata: metadata,
//     })
//   );

//   return `${getConfig().publicUrl}/${key}`;
// }

// // ============================================
// // DOWNLOAD OPERATIONS
// // ============================================

// export async function download(key: string, bucketType: BucketType = 'default'): Promise<Readable> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   const response = await client.send(
//     new GetObjectCommand({
//       Bucket: bucket,
//       Key: key,
//     })
//   );

//   return response.Body as Readable;
// }

// export async function downloadAsBuffer(
//   key: string,
//   bucketType: BucketType = 'default'
// ): Promise<Buffer> {
//   const stream = await download(key, bucketType);
//   const chunks: Buffer[] = [];

//   for await (const chunk of stream) {
//     chunks.push(Buffer.from(chunk));
//   }

//   return Buffer.concat(chunks);
// }

// // ============================================
// // DELETE OPERATIONS
// // ============================================

// export async function remove(key: string, bucketType: BucketType = 'default'): Promise<void> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   await client.send(
//     new DeleteObjectCommand({
//       Bucket: bucket,
//       Key: key,
//     })
//   );
// }

// export async function removeMany(
//   keys: string[],
//   bucketType: BucketType = 'default'
// ): Promise<void> {
//   await Promise.all(keys.map(key => remove(key, bucketType)));
// }

// // ============================================
// // SIGNED URL OPERATIONS
// // ============================================

// export async function getSignedUploadUrl(
//   key: string,
//   contentType: string,
//   expiresIn?: number,
//   bucketType: BucketType = 'default'
// ): Promise<string> {
//   const client = getClient();
//   const config = getConfig();
//   const bucket = getBucketName(bucketType);

//   const command = new PutObjectCommand({
//     Bucket: bucket,
//     Key: key,
//     ContentType: contentType,
//   });

//   return getSignedUrl(client, command, {
//     expiresIn: expiresIn || config.signedUrlExpiry,
//   });
// }

// export async function getSignedDownloadUrl(
//   key: string,
//   expiresIn?: number,
//   bucketType: BucketType = 'default'
// ): Promise<string> {
//   const client = getClient();
//   const config = getConfig();
//   const bucket = getBucketName(bucketType);

//   const command = new GetObjectCommand({
//     Bucket: bucket,
//     Key: key,
//   });

//   return getSignedUrl(client, command, {
//     expiresIn: expiresIn || config.signedUrlExpiry,
//   });
// }

// // ============================================
// // METADATA / CHECK OPERATIONS
// // ============================================

// export async function exists(key: string, bucketType: BucketType = 'default'): Promise<boolean> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   try {
//     await client.send(
//       new HeadObjectCommand({
//         Bucket: bucket,
//         Key: key,
//       })
//     );
//     return true;
//   } catch {
//     return false;
//   }
// }

// export async function getMetadata(
//   key: string,
//   bucketType: BucketType = 'default'
// ): Promise<{
//   contentType?: string;
//   contentLength?: number;
//   lastModified?: Date;
//   metadata?: Record<string, string>;
// } | null> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   try {
//     const response = await client.send(
//       new HeadObjectCommand({
//         Bucket: bucket,
//         Key: key,
//       })
//     );

//     return {
//       contentType: response.ContentType,
//       contentLength: response.ContentLength,
//       lastModified: response.LastModified,
//       metadata: response.Metadata,
//     };
//   } catch {
//     return null;
//   }
// }

// // ============================================
// // LIST OPERATIONS
// // ============================================

// export async function list(
//   prefix: string,
//   maxKeys: number = 1000,
//   bucketType: BucketType = 'default'
// ): Promise<string[]> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   const response = await client.send(
//     new ListObjectsV2Command({
//       Bucket: bucket,
//       Prefix: prefix,
//       MaxKeys: maxKeys,
//     })
//   );

//   return (response.Contents || []).map(obj => obj.Key!).filter(Boolean);
// }

// // ============================================
// // COPY OPERATIONS
// // ============================================

// export async function copy(
//   sourceKey: string,
//   destinationKey: string,
//   bucketType: BucketType = 'default'
// ): Promise<void> {
//   const client = getClient();
//   const bucket = getBucketName(bucketType);

//   await client.send(
//     new CopyObjectCommand({
//       Bucket: bucket,
//       CopySource: `${bucket}/${sourceKey}`,
//       Key: destinationKey,
//     })
//   );
// }

// export async function move(
//   sourceKey: string,
//   destinationKey: string,
//   bucketType: BucketType = 'default'
// ): Promise<void> {
//   await copy(sourceKey, destinationKey, bucketType);
//   await remove(sourceKey, bucketType);
// }

// // ============================================
// // UTILITY
// // ============================================

// export function getPublicUrl(key: string): string {
//   const config = getConfig();
//   return `${config.publicUrl}/${key}`;
// }

// export function validateFileSize(size: number): boolean {
//   const config = getConfig();
//   return size <= config.maxFileSize;
// }

// export function validateMimeType(mimeType: string): boolean {
//   const config = getConfig();
//   return config.allowedMimeTypes.includes(mimeType);
// }
