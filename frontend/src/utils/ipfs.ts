import { create } from 'ipfs-http-client';

// Configure IPFS client
const projectId = process.env.REACT_APP_INFURA_IPFS_PROJECT_ID;
const projectSecret = process.env.REACT_APP_INFURA_IPFS_PROJECT_SECRET;
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

// Upload file to IPFS
export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const added = await client.add(file);
    return `https://ipfs.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
};

// Upload JSON data to IPFS
export const uploadJSONToIPFS = async (data: any): Promise<string> => {
  try {
    const jsonString = JSON.stringify(data);
    const added = await client.add(jsonString);
    return `https://ipfs.io/ipfs/${added.path}`;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw error;
  }
};

// Get file from IPFS
export const getFromIPFS = async (ipfsHash: string): Promise<any> => {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw error;
  }
};

// Get image URL from IPFS
export const getIPFSImageURL = (ipfsHash: string): string => {
  return `https://ipfs.io/ipfs/${ipfsHash}`;
}; 