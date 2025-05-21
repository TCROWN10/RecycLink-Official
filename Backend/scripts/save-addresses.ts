import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Saving deployed contract addresses...");

  // Get the deployed contract addresses
  const usdToken = await ethers.getContractAt("contracts/USDT.sol:USDToken", "0xD27E1c24d5e316724428A884f5C3917a610f4CcD");
  const creditToken = await ethers.getContractAt("contracts/Credit.sol:USDToken", "0xC43edDa2AbC947F51dfB4b3CD6be85afa7802345");
  const carbonWise = await ethers.getContractAt("contracts/RecycLink.sol:CarbonWise", "0xb403f53196B4CAf2A57f1D2c35B8c7D4EfFFb656");
  const eventMarketPlace = await ethers.getContractAt("contracts/EventMarketPlace.sol:EventMarketPlace", "0xd90039DF6aD084f5EE19635D178E5aE3eBD13dDe");
  const ccMarketPlace = await ethers.getContractAt("contracts/RcMarketPlace.sol:CcMarketPlace", "0x1D4A299EDDF1243BE37C643a2d62906cb1CbB30a");

  const addresses = {
    USDToken: await usdToken.getAddress(),
    CreditToken: await creditToken.getAddress(),
    CarbonWise: await carbonWise.getAddress(),
    EventMarketPlace: await eventMarketPlace.getAddress(),
    CcMarketPlace: await ccMarketPlace.getAddress(),
  };

  // Save addresses to a JSON file
  const filePath = path.join(__dirname, "../deploy_Address.json");
  fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
  console.log("Contract addresses saved to deploy_Address.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 