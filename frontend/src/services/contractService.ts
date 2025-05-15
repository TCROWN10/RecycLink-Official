import { ethers } from 'ethers';
import { RECYCLINK_CONTRACT_ABI, RECYCLINK_CONTRACT_ADDRESS } from '../constants/contracts';

export class ContractService {
  private provider: ethers.Provider;
  private signer: ethers.Signer | null;
  private contract: ethers.Contract;

  constructor(provider: ethers.Provider, signer: ethers.Signer | null) {
    this.provider = provider;
    this.signer = signer;
    this.contract = new ethers.Contract(
      RECYCLINK_CONTRACT_ADDRESS,
      RECYCLINK_CONTRACT_ABI,
      signer || provider
    );
  }

  // User Account Management
  async createUserAcct(name: string) {
    if (!this.signer) throw new Error('No signer available');
    const tx = await this.contract.createUserAcct(name);
    return await tx.wait();
  }

  async createCompanyAcct(name: string) {
    if (!this.signer) throw new Error('No signer available');
    const tx = await this.contract.createCompanyAcct(name);
    return await tx.wait();
  }

  async getUser() {
    return await this.contract.getUser();
  }

  async getUserRecycles() {
    return await this.contract.getUserRecycles();
  }

  // Admin Functions
  async createAdmin(name: string, address: string) {
    if (!this.signer) throw new Error('No signer available');
    const tx = await this.contract.createAdmin(name, address);
    return await tx.wait();
  }

  async createVerifier(name: string, address: string) {
    if (!this.signer) throw new Error('No signer available');
    const tx = await this.contract.createVerifier(name, address);
    return await tx.wait();
  }

  async getAdmins() {
    return await this.contract.getAdmins();
  }

  async getVerifiers() {
    return await this.contract.getVerifiers();
  }

  async getAllUsers() {
    return await this.contract.getAllUsers();
  }

  async getAllCompanies() {
    return await this.contract.getAllCompanies();
  }

  // Recycling Functions
  async depositPlastic(qtyRecycled: number, userId: number) {
    if (!this.signer) throw new Error('No signer available');
    const tx = await this.contract.depositPlastic(qtyRecycled, userId);
    return await tx.wait();
  }

  async getAllRecycles() {
    return await this.contract.getAllRecycles();
  }

  // Statistics Functions
  async getStatistics() {
    return await this.contract.statistics();
  }

  // Authentication Functions
  async checkWalletConnection() {
    if (!this.signer) return { connected: false, address: null };
    try {
      const address = await this.signer.getAddress();
      const user = await this.getUser();
      return { 
        connected: true, 
        address,
        isAdmin: user?.role === 1,
        isVerifier: user?.role === 2,
        isCompany: user?.role === 3,
        userData: user
      };
    } catch (error) {
      return { connected: false, address: null };
    }
  }

  async getUserRole(address: string) {
    const user = await this.getUser();
    switch(user?.role) {
      case 1: return 'admin';
      case 2: return 'verifier';
      case 3: return 'company';
      default: return 'user';
    }
  }
} 