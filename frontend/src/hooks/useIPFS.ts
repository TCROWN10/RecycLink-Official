import { useState } from 'react';
import { uploadToIPFS, uploadJSONToIPFS, getFromIPFS, getIPFSImageURL } from '../utils/ipfs';

export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const ipfsHash = await uploadToIPFS(file);
      return ipfsHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadData = async (data: any): Promise<string> => {
    setIsUploading(true);
    setError(null);
    try {
      const ipfsHash = await uploadJSONToIPFS(data);
      return ipfsHash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload data');
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchData = async (ipfsHash: string): Promise<any> => {
    setError(null);
    try {
      const data = await getFromIPFS(ipfsHash);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      throw err;
    }
  };

  const getImageUrl = (ipfsHash: string): string => {
    return getIPFSImageURL(ipfsHash);
  };

  return {
    uploadFile,
    uploadData,
    fetchData,
    getImageUrl,
    isUploading,
    error,
  };
}; 