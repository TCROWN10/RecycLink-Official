import { ethers } from 'ethers';
import { useCallback, useMemo } from 'react';
import { RECYCLINK_CONTRACT_ABI, RECYCLINK_CONTRACT_ADDRESS } from '../constants/contracts';
import { useWasteWiseContext } from '../context';

export const useRecyclinkContract = () => {
  const { provider, signer } = useWasteWiseContext();

  const contract = useMemo(() => {
    if (!provider) return null;
    return new ethers.Contract(
      RECYCLINK_CONTRACT_ADDRESS,
      RECYCLINK_CONTRACT_ABI,
      signer || provider
    );
  }, [provider, signer]);

  const getTokenBalance = useCallback(async (address: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.balanceOf(address);
  }, [contract]);

  const getTokenOwner = useCallback(async (tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.ownerOf(tokenId);
  }, [contract]);

  const transferToken = useCallback(async (to: string, tokenId: number) => {
    if (!contract || !signer) throw new Error('Contract not initialized or signer not available');
    const tx = await contract.transferFrom(await signer.getAddress(), to, tokenId);
    return await tx.wait();
  }, [contract, signer]);

  const approveToken = useCallback(async (to: string, tokenId: number) => {
    if (!contract || !signer) throw new Error('Contract not initialized or signer not available');
    const tx = await contract.approve(to, tokenId);
    return await tx.wait();
  }, [contract, signer]);

  const getApprovedAddress = useCallback(async (tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getApproved(tokenId);
  }, [contract]);

  const getTokenURI = useCallback(async (tokenId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.tokenURI(tokenId);
  }, [contract]);

  return {
    contract,
    getTokenBalance,
    getTokenOwner,
    transferToken,
    approveToken,
    getApprovedAddress,
    getTokenURI,
  };
}; 