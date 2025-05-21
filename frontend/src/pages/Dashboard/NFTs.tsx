import { useState, useEffect } from 'react';
import { useRecyclinkContract } from '../../hooks/useRecyclinkContract';
import { NFTCard } from '../../components/NFTCard';
import { useWasteWiseContext } from '../../context';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { toast } from 'sonner';

const NFTs = () => {
  const { currentUser } = useWasteWiseContext();
  const { getTokenBalance, transferToken } = useRecyclinkContract();
  const [tokens, setTokens] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchTokens = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const balance = await getTokenBalance(currentUser);
        const tokenIds = Array.from({ length: Number(balance) }, (_, i) => i + 1);
        setTokens(tokenIds);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        toast.error('Failed to fetch NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, [currentUser, getTokenBalance]);

  const handleTransfer = async () => {
    if (!selectedToken || !recipientAddress) return;

    try {
      await transferToken(recipientAddress, selectedToken);
      toast.success('NFT transferred successfully');
      onClose();
      // Refresh tokens
      const balance = await getTokenBalance(currentUser);
      const tokenIds = Array.from({ length: Number(balance) }, (_, i) => i + 1);
      setTokens(tokenIds);
    } catch (error) {
      console.error('Error transferring token:', error);
      toast.error('Failed to transfer NFT');
    }
  };

  const openTransferModal = (tokenId: number) => {
    setSelectedToken(tokenId);
    onOpen();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My NFTs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tokens.map((tokenId) => (
          <NFTCard 
            key={tokenId} 
            tokenId={tokenId} 
            onTransfer={openTransferModal}
          />
        ))}
      </div>

      {tokens.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No NFTs found</p>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Transfer NFT</ModalHeader>
          <ModalBody>
            <Input
              label="Recipient Address"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleTransfer}>
              Transfer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NFTs; 