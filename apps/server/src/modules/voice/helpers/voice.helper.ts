import { uploadFile } from '@lib/services/cloudinary/index.js';

export const voiceHelper = {
  processFile: async (file: Express.Multer.File, sessionId: string, idx: number) => {
    const publicId = `${sessionId}_sample_${idx}`;
    const uploaded = await uploadFile(file.buffer, 'voice-samples', 'audio', { publicId });
    return {
      url: uploaded.url,
      duration: uploaded.duration ?? 0,
      publicId: uploaded.publicId,
    };
  },

  processFiles: async (files: Express.Multer.File[], sessionId: string) => {
    return Promise.all(files.map((file, idx) => voiceHelper.processFile(file, sessionId, idx)));
  },
};
