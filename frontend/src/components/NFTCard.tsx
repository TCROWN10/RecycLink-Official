import { useEffect, useState } from 'react';
import { useRecyclinkContract } from '../hooks/useRecyclinkContract';
import { Card, CardBody, CardFooter, Image, Button } from "@nextui-org/react";
import { useWasteWiseContext } from '../context';

interface NFTCardProps {
  tokenId: number;
  onTransfer?: (tokenId: number) => void;
}

export const NFTCard = ({ tokenId, onTransfer }: NFTCardProps) => {
  const { getTokenOwner, getTokenURI } = useRecyclinkContract();
  const { currentUser } = useWasteWiseContext();
  const [owner, setOwner] = useState<string>('');
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTData = async () => {
      try {
        setLoading(true);
        const [ownerAddress, tokenURI] = await Promise.all([
          getTokenOwner(tokenId),
          getTokenURI(tokenId),
        ]);
        
        setOwner(ownerAddress);
        
        // Fetch metadata from IPFS or other storage
        const response = await fetch(tokenURI);
        const metadata = await response.json();
        setMetadata(metadata);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTData();
  }, [tokenId, getTokenOwner, getTokenURI]);

  if (loading) {
    return (
      <Card className="w-[300px] space-y-5 p-4" radius="lg">
        <div className="h-24 rounded-lg bg-default-300"></div>
        <div className="space-y-3">
          <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
          <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-[300px]" radius="lg">
      <CardBody className="overflow-visible p-0">
        <Image
          shadow="sm"
          radius="lg"
          width="100%"
          alt={metadata?.name || `NFT #${tokenId}`}
          className="w-full object-cover h-[140px]"
          src={metadata?.image}
        />
      </CardBody>
      <CardFooter className="text-small justify-between">
        <div>
          <b>{metadata?.name || `NFT #${tokenId}`}</b>
          <p className="text-default-500">{metadata?.description}</p>
          <p className="text-tiny">Owned by: {owner.slice(0, 6)}...{owner.slice(-4)}</p>
        </div>
        {currentUser && owner.toLowerCase() === currentUser.toLowerCase() && onTransfer && (
          <Button 
            className="text-tiny" 
            color="primary" 
            radius="lg" 
            size="sm"
            onClick={() => onTransfer(tokenId)}
          >
            Transfer
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}; 