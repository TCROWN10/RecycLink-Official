const {ethers} = require("hardhat");


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying USDToken with the account:", deployer.address);

  const USDToken = await ethers.getContractFactory("contracts/Credit.sol:USDToken");
  const usdToken = await USDToken.deploy("CREDIT Token", "CRDT");
  await usdToken.waitForDeployment();

  const tokenAddress = await usdToken.getAddress();
  console.log("USDToken deployed to:", tokenAddress);
}

main().catch((error) => {
  console.error("Error deploying USDToken:", error);
  process.exitCode = 1;
});
