import { v2 as cloudinary } from 'cloudinary';
import { createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import { pipeline } from 'stream/promises';
import fetch from 'node-fetch';
import path from 'path';
import os from 'os';
import type { CloudinaryConfig } from '@config/services/cloudinary/index.js';

type FileType = 'image' | 'audio' | 'video' | 'document' | 'raw';

interface UploadResult {
  url: string;
  publicId: string;
  duration?: number;   // audio/video only
  width?: number;      // image only
  height?: number;     // image only
  format: string;
  bytes: number;
}

// Cloudinary resource_type mapping
const RESOURCE_TYPE_MAP: Record<FileType, 'image' | 'video' | 'raw'> = {
  image: 'image',
  audio: 'video',   // Cloudinary uses 'video' for audio too
  video: 'video',
  document: 'raw',
  raw: 'raw',
};

let _folder = 'awaazai';

export async function init(config: CloudinaryConfig) {
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
  });

  _folder = config.folder;

  return { uploadFile, deleteFile, downloadFile, deleteTempFile, getFileUrl };
}

// ─── Upload ────────────────────────────────────────────────────────────────

export async function uploadFile(
  buffer: Buffer,
  subfolder: string,
  type: FileType,
  options?: { publicId?: string; format?: string }
): Promise<UploadResult> {
  const resourceType = RESOURCE_TYPE_MAP[type];
  const folder = `${_folder}/${subfolder}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options?.publicId,
        resource_type: resourceType,
        format: options?.format,
        // Auto face crop for images
        ...(type === 'image' && {
          transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
        }),
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error('Upload failed'));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration != null ? Math.round(result.duration) : undefined,
          width: result.width,
          height: result.height,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

// ─── Delete ────────────────────────────────────────────────────────────────

export async function deleteFile(publicId: string, type: FileType): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: RESOURCE_TYPE_MAP[type],
  });
}

// ─── Download to temp ─────────────────────────────────────────────────────

export async function downloadFile(url: string, filename: string): Promise<string> {
  const ext = path.extname(new URL(url).pathname) || '';
  const tempPath = path.join(os.tmpdir(), `${filename}${ext}`);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download file: ${response.statusText}`);

  await pipeline(response.body!, createWriteStream(tempPath));
  return tempPath;
}

export async function deleteTempFile(filePath: string): Promise<void> {
  await unlink(filePath).catch(() => {});
}

// ─── URL ──────────────────────────────────────────────────────────────────

export function getFileUrl(publicId: string, type: FileType, width = 400, height = 400): string {
  if (type === 'image') {
    return cloudinary.url(publicId, {
      width,
      height,
      crop: 'fill',
      gravity: 'face',
      fetch_format: 'auto',
      quality: 'auto',
    });
  }
  return cloudinary.url(publicId, { resource_type: RESOURCE_TYPE_MAP[type] });
}

export default { init, uploadFile, deleteFile, downloadFile, deleteTempFile, getFileUrl };
