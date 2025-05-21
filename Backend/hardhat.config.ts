import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure private key is properly formatted
const PRIVATE_KEY = process.env.PRIVATE_KEY?.startsWith('0x') 
  ? process.env.PRIVATE_KEY.slice(2) 
  : process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";

const ETHERSCAN_API_KEY = "T4MBMIUDVKF343XKSKYGSCQIE9P2IV4P9X";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  sourcify: {
    enabled: false,
  },
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/EzkLGxQzDcyT-PU8k-DbYL6iAIB1l1TE",
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: "auto",
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  },
};

export default config;