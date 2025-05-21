const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const tokenAddress = "0xf882bdE91E63cE2b9F16cbc3b568BB66A1358B90";
  const carbonWiseCreditAddress = "0xc6e18585B17A0bcc3aA8df04bda44006cD59788c";
  const carbonWiseAddress = "0x1C774f74a0a23667Ca54e5A25d40F5E460ED2D65";

  const EventMarketPlace = await hre.ethers.getContractFactory("CcMarketPlace");
  const eventMarketPlace = await EventMarketPlace.deploy(tokenAddress, carbonWiseCreditAddress, carbonWiseAddress);
  await eventMarketPlace.waitForDeployment();

  console.log("EventMarketPlace deployed to:", await eventMarketPlace.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
