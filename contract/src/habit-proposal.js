// habit-proposal.js

import { E } from '@agoric/eventual-send';

const deployContract = async (zoe, board, wallet, tokenIssuer) => {
  console.log('Starting Habit Proposal...');

  // Install the Habit contract on Zoe
  const bundleId = await E(board).getValue('id');
  const installation = await E(zoe).install(bundleId);

  console.log('Contract Installed:', installation);

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

  console.log('Global Parameters Set.');

  // Whitelist tokens
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
  console.log('Habit Contract Instance Registered:', instanceId);

  return {
    instance,
    publicFacet,
    creatorFacet,
  };
};

export default async function deployApi({ zoe, board, wallet, issuers }) {
  console.log('Deploying Habit Proposal...');
  const result = await deployContract(zoe, board, wallet, issuers);
  console.log('Deployment Complete:', result);
}
