const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Use fully qualified name for USDToken
  const USDToken = await hre.ethers.getContractFactory("contracts/USDT.sol:USDToken");
  const CreditToken = await hre.ethers.getContractFactory("contracts/Credit.sol:CreditToken");
  const CarbonWise = await hre.ethers.getContractFactory("contracts/RecycLink.sol:CarbonWise");
  const EventMarketPlace = await hre.ethers.getContractFactory("EventMarketPlace");
  const CcMarketPlace = await hre.ethers.getContractFactory("CcMarketPlace");

  // Deploy USDToken first
  const usdToken = await USDToken.deploy();
  await usdToken.waitForDeployment();

  // Deploy USDToken first
  const creditToken = await CreditToken.deploy();
  await creditToken.waitForDeployment();

  // Deploy CarbonWise with the USDToken address
  const carbonWise = await CarbonWise.deploy(usdToken.target);
  await carbonWise.waitForDeployment();

  // Deploy EventMarketPlace with USDToken and CarbonWise addresses
  const eventMarketPlace = await EventMarketPlace.deploy(
    usdToken.target, 
    carbonWise.target
  );
  await eventMarketPlace.waitForDeployment();

  // Dummy Credit contract deployment (modify as needed)
//   const CreditToken = await hre.ethers.getContractFactory("Credit");
//   const creditToken = await CreditToken.deploy();
//   await creditToken.waitForDeployment();

  // Deploy CcMarketPlace with USDToken, Credit, and CarbonWise addresses
  const ccMarketPlace = await CcMarketPlace.deploy(
    usdToken.target, 
    creditToken.target,
    carbonWise.target
  );
  await ccMarketPlace.waitForDeployment();

  // Log deployed contract addresses
  console.log("USDToken deployed to:", usdToken.target);
  console.log("CreditToken deployed to:", creditToken.target);
  console.log("CarbonWise deployed to:", carbonWise.target);
  console.log("EventMarketPlace deployed to:", eventMarketPlace.target);
  console.log("CcMarketPlace deployed to:", ccMarketPlace.target);
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
