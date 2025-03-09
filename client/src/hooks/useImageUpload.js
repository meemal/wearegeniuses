import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../services/firebase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Custom hook for handling image uploads to Firebase Storage
 * @returns {Object} Image upload utilities and state
 */
export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadWithRetry = async (storageRef, file, attempt = 1) => {
    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log(`[Upload] Attempt ${attempt} successful`);
      return snapshot;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.log(`[Upload] Attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        await wait(RETRY_DELAY);
        return uploadWithRetry(storageRef, file, attempt + 1);
      }
      throw err;
    }
  };

  const getDownloadURLWithRetry = async (ref, attempt = 1) => {
    try {
      const url = await getDownloadURL(ref);
      console.log(`[Upload] Get URL attempt ${attempt} successful`);
      return url;
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.log(`[Upload] Get URL attempt ${attempt} failed, retrying in ${RETRY_DELAY}ms...`);
        await wait(RETRY_DELAY);
        return getDownloadURLWithRetry(ref, attempt + 1);
      }
      throw err;
    }
  };

  const uploadImage = async (file, path) => {
    if (!file) {
      const error = new Error('No file provided');
      console.error(error);
      setError(error.message);
      return null;
    }

    if (!storage) {
      const error = new Error('Firebase Storage is not initialized');
      console.error(error);
      setError(error.message);
      return null;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        throw new Error('File size must be less than 5MB');
      }

      console.log('[Upload] Starting upload process...', {
        name: file.name,
        size: file.size,
        type: file.type,
        path: path
      });

      // Create a storage reference
      const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
      console.log('[Upload] Storage reference created:', {
        fullPath: storageRef.fullPath,
        bucket: storage.app.options.storageBucket
      });
      
      // Upload the file with retry
      console.log('[Upload] Starting file upload...');
      const snapshot = await uploadWithRetry(storageRef, file);
      
      console.log('[Upload] File uploaded successfully:', {
        bytesTransferred: snapshot.bytesTransferred,
        totalBytes: snapshot.totalBytes,
        state: snapshot.state
      });
      
      // Get the download URL with retry
      console.log('[Upload] Getting download URL...');
      const url = await getDownloadURLWithRetry(snapshot.ref);
      
      console.log('[Upload] Process completed successfully');
      
      return {
        url,
        filename: snapshot.ref.name,
        contentType: file.type,
        size: file.size,
        path: snapshot.ref.fullPath
      };
    } catch (err) {
      console.error('[Upload] Error in uploadImage:', err);
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      console.log('[Upload] Setting isUploading to false');
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
    error
  };
}; 