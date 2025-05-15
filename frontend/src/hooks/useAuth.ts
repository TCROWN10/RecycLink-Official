import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWasteWiseContext } from '../context';
import { ContractService } from '../services/contractService';
import { toast } from 'sonner';

export const useAuth = () => {
  const { provider, signer } = useWasteWiseContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'verifier' | 'company' | 'user' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!provider || !signer) {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserData(null);
        setIsLoading(false);
        return;
      }

      try {
        const contractService = new ContractService(provider, signer);
        const { connected, address, isAdmin, isVerifier, isCompany, userData } = await contractService.checkWalletConnection();

        if (!connected || !address) {
          setIsAuthenticated(false);
          setUserRole(null);
          setUserData(null);
          setIsLoading(false);
          return;
        }

        // Check if the user is Tcrown (admin)
        if (address.toLowerCase() === '0xA1eE1Abf8B538711c7Aa6E2B37eEf1A48021F2bB'.toLowerCase()) {
          setUserRole('admin');
          toast.success('Welcome back, Admin Tcrown!');
        } else if (isAdmin) {
          setUserRole('admin');
          toast.success('Welcome back, Admin!');
        } else if (isVerifier) {
          setUserRole('verifier');
          toast.success('Welcome back, Verifier!');
        } else if (isCompany) {
          setUserRole('company');
          toast.success('Welcome back, Company Partner!');
        } else {
          setUserRole('user');
          toast.success('Welcome back!');
        }

        setUserData(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        toast.error('Failed to verify authentication status');
        setIsAuthenticated(false);
        setUserRole(null);
        setUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [provider, signer]);

  const requireAuth = (allowedRoles?: ('admin' | 'verifier' | 'company' | 'user')[]) => {
    if (isLoading) return true;

    if (!isAuthenticated) {
      toast.error('Please connect your wallet to continue');
      navigate('/');
      return false;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      toast.error('You do not have permission to access this page');
      navigate('/dashboard');
      return false;
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    navigate('/');
  };

  return {
    isAuthenticated,
    userRole,
    userData,
    isLoading,
    requireAuth,
    logout,
  };
}; 