/**
 * @file Permission Contract Deployment builder
 *
 * Creates files for starting an instance of the contract:
 * * contract source and instantiation proposal bundles to be published via
 *   `agd tx swingset install-bundle`
 * * start-habit-permit.json and start-habit.js to submit the
 *   instantiation proposal via `agd tx gov submit-proposal swingset-core-eval`
 *
 * Usage:
 *   agoric run build-contract-deployer.js
 */

import { makeHelpers } from '@agoric/deploy-script-support';
import { getManifestForHabit } from '../src/habit-proposal.js';

/** @type {import('@agoric/deploy-script-support/src/externalTypes.js').ProposalBuilder} */
export const habitProposalBuilder = async ({ publishRef, install }) => {
  return harden({
    sourceSpec: '../src/habit-proposal.js',
    getManifestCall: [
      getManifestForHabit.name,
      {
        habitRef: publishRef(
          install('../src/habit.contract.js', '../bundles/bundle-habit.js', {
            persist: true,
          }),
        ),
      },
    ],
  });
};

/** @type {DeployScriptFunction} */
export default async (homeP, endowments) => {
  const { writeCoreProposal } = await makeHelpers(homeP, endowments);
  await writeCoreProposal('start-habit', habitProposalBuilder);
};
