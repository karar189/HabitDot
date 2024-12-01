import { E } from '@agoric/eventual-send';

const deployContract = async (zoe, board, wallet, tokenIssuer) => {
  console.log('Starting Habit Proposal Deployment...');

  try {
    // Install the Habit contract on Zoe
    const bundleId = await E(board).getValue('habitBundleId'); // Use the actual bundleId for habit.contract.js
    const installation = await E(zoe).install(bundleId);
    console.log('Contract Installed Successfully:', installation);

    // Start the Habit contract instance
    const { instance, creatorFacet, publicFacet } =
      await E(zoe).startInstance(installation);
    console.log('Habit Contract Instance Started:', instance);

    // Initialize global parameters
    const dailyReward = 1n; // 1 reward point
    const profitMultiplier = 2n; // Double the reward after break-even
    const breakEvenRatio = 75n; // 75% of streak days for break-even

    await E(creatorFacet).setGlobalParameters({
      dailyReward,
      profitMultiplier,
      breakEvenRatio,
    });
    console.log('Global Parameters Set:', {
      dailyReward,
      profitMultiplier,
      breakEvenRatio,
    });

    // Whitelist tokens
    console.log('Whitelisting Tokens...');
    const tokenBrands = await Promise.all(
      tokenIssuer.map(async issuer => E(issuer).getBrand()),
    );

    for (const tokenBrand of tokenBrands) {
      await E(creatorFacet).whitelistToken(tokenBrand);
      console.log(`Token Whitelisted:`, tokenBrand);
    }

    // Assign roles (example: assigning an initial Validator)
    const initialValidator = 'agoric-address-validator'; // Replace with actual address
    await E(creatorFacet).assignValidator(initialValidator);
    console.log('Validator Assigned:', initialValidator);

    // Register the instance in the board for public access
    const instanceId = await E(board).getId(instance);
    console.log('Habit Contract Instance Registered in the Board:', instanceId);

    // Optionally, store instance details in the wallet or other storage
    console.log('Storing PublicFacet and Instance in Wallet...');
    await E(wallet).addDepositFacet('HabitContractPublic', publicFacet);
    console.log('PublicFacet stored in Wallet.');

    return {
      instance,
      publicFacet,
      creatorFacet,
      instanceId,
    };
  } catch (err) {
    console.error('Error during Habit Proposal Deployment:', err);
    throw err; // Re-throw the error for upstream handling
  }
};

export default async function deployApi({ zoe, board, wallet, issuers }) {
  console.log('Deploying Habit Proposal...');
  try {
    const result = await deployContract(zoe, board, wallet, issuers);
    console.log('Deployment Complete:', result);

    // Log useful deployment information
    console.log('Contract Deployment Details:');
    console.log(`Instance ID: ${result.instanceId}`);
    console.log('PublicFacet:', result.publicFacet);
    console.log('CreatorFacet:', result.creatorFacet);
  } catch (err) {
    console.error('Deployment Failed:', err);
  }
}
