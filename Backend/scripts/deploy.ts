import { ethers } from "hardhat";
import { run } from "hardhat";
import * as fs from "fs";

// Helper function to wait for confirmations with retry
async function waitForConfirmations(tx: any, confirmations: number = 5, maxRetries: number = 3) {
  console.log(`Waiting for ${confirmations} confirmations...`);
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await tx.wait(confirmations);
      console.log(`Transaction confirmed ${confirmations} times`);
      return;
    } catch (error: unknown) {
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Retry ${retries}/${maxRetries} after error:`, errorMessage);
      await delay(10000); // Wait 10 seconds before retry
    }
  }
}

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to verify contract with retry
async function verifyContract(address: string, contract: string, constructorArguments: any[], maxRetries: number = 3) {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      await run("verify:verify", {
        address,
        contract,
        constructorArguments,
      });
      console.log(`${contract} verified successfully!`);
      return;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes("already been verified")) {
        console.log(`${contract} already verified!`);
        return;
      }
      retries++;
      if (retries === maxRetries) {
        console.log(`${contract} verification failed after ${maxRetries} attempts:`, errorMessage);
        return;
      }
      console.log(`Retry ${retries}/${maxRetries} for ${contract} verification...`);
      await delay(30000); // Wait 30 seconds before retry
    }
  }
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  console.log("\n1. Deploying USDToken...");
  const USDToken = await ethers.getContractFactory("contracts/USDT.sol:USDToken");
  const usdToken = await USDToken.deploy();
  const usdTokenTx = await usdToken.waitForDeployment();
  const usdTokenAddress = await usdToken.getAddress();
  console.log("USDToken deployed to:", usdTokenAddress);
  await waitForConfirmations(usdTokenTx.deploymentTransaction());
  await delay(30000);

  // Verify USDToken
  console.log("Verifying USDToken...");
  await verifyContract(
    usdTokenAddress,
    "contracts/USDT.sol:USDToken",
    []
  );

  console.log("\n2. Deploying CreditToken...");
  const CreditToken = await ethers.getContractFactory("contracts/Credit.sol:USDToken");
  const creditToken = await CreditToken.deploy("Credit Token", "CREDIT");
  const creditTokenTx = await creditToken.waitForDeployment();
  const creditTokenAddress = await creditToken.getAddress();
  console.log("CreditToken deployed to:", creditTokenAddress);
  await waitForConfirmations(creditTokenTx.deploymentTransaction());
  await delay(30000);

  // Verify CreditToken
  console.log("Verifying CreditToken...");
  await verifyContract(
    creditTokenAddress,
    "contracts/Credit.sol:USDToken",
    ["Credit Token", "CREDIT"]
  );

  console.log("\n3. Deploying CarbonWise...");
  const CarbonWise = await ethers.getContractFactory("contracts/RecycLink.sol:CarbonWise");
  const carbonWise = await CarbonWise.deploy(usdTokenAddress);
  const carbonWiseTx = await carbonWise.waitForDeployment();
  const carbonWiseAddress = await carbonWise.getAddress();
  console.log("CarbonWise deployed to:", carbonWiseAddress);
  await waitForConfirmations(carbonWiseTx.deploymentTransaction());
  await delay(30000);

  // Verify CarbonWise
  console.log("Verifying CarbonWise...");
  await verifyContract(
    carbonWiseAddress,
    "contracts/RecycLink.sol:CarbonWise",
    [usdTokenAddress]
  );

  console.log("\n4. Deploying EventMarketPlace...");
  const EventMarketPlace = await ethers.getContractFactory("contracts/EventMarketPlace.sol:EventMarketPlace");
  const eventMarketPlace = await EventMarketPlace.deploy(
    usdTokenAddress,
    carbonWiseAddress
  );
  const eventMarketPlaceTx = await eventMarketPlace.waitForDeployment();
  const eventMarketPlaceAddress = await eventMarketPlace.getAddress();
  console.log("EventMarketPlace deployed to:", eventMarketPlaceAddress);
  await waitForConfirmations(eventMarketPlaceTx.deploymentTransaction());
  await delay(30000);

  // Verify EventMarketPlace
  console.log("Verifying EventMarketPlace...");
  await verifyContract(
    eventMarketPlaceAddress,
    "contracts/EventMarketPlace.sol:EventMarketPlace",
    [usdTokenAddress, carbonWiseAddress]
  );

  console.log("\n5. Deploying CcMarketPlace...");
  const CcMarketPlace = await ethers.getContractFactory("contracts/RcMarketPlace.sol:CcMarketPlace");
  const ccMarketPlace = await CcMarketPlace.deploy(
    usdTokenAddress,
    creditTokenAddress,
    carbonWiseAddress
  );
  const ccMarketPlaceTx = await ccMarketPlace.waitForDeployment();
  const ccMarketPlaceAddress = await ccMarketPlace.getAddress();
  console.log("CcMarketPlace deployed to:", ccMarketPlaceAddress);
  await waitForConfirmations(ccMarketPlaceTx.deploymentTransaction());
  await delay(30000);

  // Verify CcMarketPlace
  console.log("Verifying CcMarketPlace...");
  await verifyContract(
    ccMarketPlaceAddress,
    "contracts/RcMarketPlace.sol:CcMarketPlace",
    [usdTokenAddress, creditTokenAddress, carbonWiseAddress]
  );

  // Deploy ProfileManager
  console.log("Deploying ProfileManager...");
  const ProfileManager = await ethers.getContractFactory("ProfileManager");
  const profileManager = await ProfileManager.deploy();
  await profileManager.waitForDeployment();
  const profileManagerAddress = await profileManager.getAddress();
  console.log("ProfileManager deployed to:", profileManagerAddress);

  // Verify ProfileManager
  console.log("Verifying ProfileManager...");
  try {
    await run("verify:verify", {
      address: profileManagerAddress,
      constructorArguments: [],
    });
    console.log("ProfileManager verified successfully");
  } catch (error) {
    console.error("Error verifying ProfileManager:", error);
  }

  // Save addresses
  const addresses = {
    USDToken: usdTokenAddress,
    CreditToken: creditTokenAddress,
    CarbonWise: carbonWiseAddress,
    EventMarketPlace: eventMarketPlaceAddress,
    CcMarketPlace: ccMarketPlaceAddress,
    ProfileManager: profileManagerAddress,
  };

  fs.writeFileSync("deploy_Address.json", JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to deploy_Address.json");

  console.log("Deployment Summary:");
  console.log("-------------------");
  console.log("USDToken:", usdTokenAddress);
  console.log("CreditToken:", creditTokenAddress);
  console.log("CarbonWise:", carbonWiseAddress);
  console.log("EventMarketPlace:", eventMarketPlaceAddress);
  console.log("CcMarketPlace:", ccMarketPlaceAddress);
  console.log("ProfileManager:", profileManagerAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




// Deploying contracts with the account: 0xA1eE1Abf8B538711c7Aa6E2B37eEf1A48021F2bB
// USDToken deployed to: 0xf882bdE91E63cE2b9F16cbc3b568BB66A1358B90
// CreditToken deployed to: 0xb3228358659F62045B46AFAC8c19b6B757457417
// CarbonWise deployed to: 0x9f271d5dbeCff0FBcdC7C1E7aE7e498D27D40CB8
// CarbonWiseUpdate deployed to: 0x42d6FDF995fEE0B34e0311F94D16Fcf4392635fb
// EventMarketPlace deployed to: 0x23972a6e46692Acdb2696c85E7B0f81Dc9A8A1a7
// CcMarketPlace deployed to: 0xC20617a4Cf01BAcfdDca9a3eE87d8e899D4078a3

// npx hardhat verify --network opencampus 0xF24Ce2cA7966d67ca3A6A3244Ee064636Ae99c89 --constructor-args scripts/arg.js

// ABI
// https://edu-chain-testnet.blockscout.com/address/0x9f271d5dbeCff0FBcdC7C1E7aE7e498D27D40CB8#code
// https://edu-chain-testnet.blockscout.com/address/0x23972a6e46692Acdb2696c85E7B0f81Dc9A8A1a7#code
// https://edu-chain-testnet.blockscout.com/address/0xC20617a4Cf01BAcfdDca9a3eE87d8e899D4078a3#code
// https://edu-chain-testnet.blockscout.com/tx/0x6bc6e07c27a48389e15156d40ec64a6977004b27e42771e5ab5798d75a75be71






// // scripts/deploy.js
// const hre = require("hardhat");

// async function main() {
//   // Get the deployer signer
//   const [deployer] = await hre.ethers.getSigners();

//   console.log("Deploying contracts with the account:", deployer.address);

//   // Already deployed USDToken address
//   const usdtAddress = "0xf882bdE91E63cE2b9F16cbc3b568BB66A1358B90";

//   // Get contract factory for CarbonWise
//   const CarbonWise = await hre.ethers.getContractFactory("contracts/RecycLink.sol:CarbonWise");

//   // Deploy CarbonWise with the USDToken address as constructor arg
//   const carbonWise = await CarbonWise.deploy(usdtAddress);

//   await carbonWise.waitForDeployment();
//   // Log the deployed contract address
//   const carbonWiseAddress = await carbonWise.getAddress();
//   console.log("CarbonWise deployed to:", carbonWiseAddress);

// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
