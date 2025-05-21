import { run } from "hardhat";
import * as fs from "fs";

async function main() {
  // Read deployed addresses
  const addresses = JSON.parse(fs.readFileSync("deploy_Address.json", "utf8"));

  console.log("Starting contract verification...");

  // Verify USDToken
  console.log("\nVerifying USDToken...");
  try {
    await run("verify:verify", {
      address: addresses.USDToken,
      contract: "contracts/USDT.sol:USDToken",
      constructorArguments: [],
    });
    console.log("USDToken verified successfully!");
  } catch (error) {
    console.log("USDToken verification failed:", error);
  }

  // Verify CreditToken
  console.log("\nVerifying CreditToken...");
  try {
    await run("verify:verify", {
      address: addresses.CreditToken,
      contract: "contracts/Credit.sol:USDToken",
      constructorArguments: ["Credit Token", "CREDIT"],
    });
    console.log("CreditToken verified successfully!");
  } catch (error) {
    console.log("CreditToken verification failed:", error);
  }

  // Verify CarbonWise
  console.log("\nVerifying CarbonWise...");
  try {
    await run("verify:verify", {
      address: addresses.CarbonWise,
      contract: "contracts/RecycLink.sol:CarbonWise",
      constructorArguments: [addresses.USDToken],
    });
    console.log("CarbonWise verified successfully!");
  } catch (error) {
    console.log("CarbonWise verification failed:", error);
  }

  // Verify EventMarketPlace
  console.log("\nVerifying EventMarketPlace...");
  try {
    await run("verify:verify", {
      address: addresses.EventMarketPlace,
      contract: "contracts/EventMarketPlace.sol:EventMarketPlace",
      constructorArguments: [addresses.USDToken, addresses.CarbonWise],
    });
    console.log("EventMarketPlace verified successfully!");
  } catch (error) {
    console.log("EventMarketPlace verification failed:", error);
  }

  // Verify CcMarketPlace
  console.log("\nVerifying CcMarketPlace...");
  try {
    await run("verify:verify", {
      address: addresses.CcMarketPlace,
      contract: "contracts/RcMarketPlace.sol:CcMarketPlace",
      constructorArguments: [addresses.USDToken, addresses.CreditToken, addresses.CarbonWise],
    });
    console.log("CcMarketPlace verified successfully!");
  } catch (error) {
    console.log("CcMarketPlace verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 