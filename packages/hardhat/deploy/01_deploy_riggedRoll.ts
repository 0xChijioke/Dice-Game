import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */

  // The reason for all the commenting is that linting will always error if riggedRoll deploy script isnt fully implemented.
  // Uncomment the following lines when working on riggedRoll.
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy } = hre.deployments;

  // const diceGame = await ethers.getContract("DiceGame", deployer);

  // await deploy("RiggedRoll", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [diceGame.address],
  //   log: true,
  //   autoMine: true,
  // });

  // Get the deployed contract
  //const riggedRoll = await ethers.getContract("RiggedRoll", deployer);

  //const ownershipTransaction = await riggedRoll.transferOwnership("** YOUR FRONTEND ADDRESS **");
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["RiggedRoll"];
