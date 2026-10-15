// upload-to-uploadcare.ts
import { uploadFile } from '@uploadcare/upload-client';

export const uploadImage = async (file: File): Promise<string | null> => {
  // Use Upload Care API to upload image and return the image URL
  try {
    const result = await uploadFile(file, {
      publicKey: 'e76a92de305590038ff6',
      store: 'auto',
    });

    return result.cdnUrl;
  } catch (error) {
    // Upload care free tier limit 500 uploads/month, 1GB storage so if it fails, return default image
    console.error('Uploadcare error:', error);
    return "https://avatars.githubusercontent.com/u/33588256";
  }
};
