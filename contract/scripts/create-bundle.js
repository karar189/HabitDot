import { bundleSource } from '@endo/bundle-source';
import fs from 'fs/promises';

const CONTRACT_PATH = './src/habit.contract.js';
const OUTPUT_BUNDLE_PATH = './bundles/bundle-habit.js';

const createBundle = async () => {
  console.log(`Bundling contract at ${CONTRACT_PATH}...`);
  const bundle = await bundleSource(CONTRACT_PATH);

  console.log(`Writing bundle to ${OUTPUT_BUNDLE_PATH}...`);
  await fs.writeFile(
    OUTPUT_BUNDLE_PATH,
    `export default ${JSON.stringify(bundle)};`,
  );

  console.log('Bundle created successfully!');
};

createBundle().catch(err => {
  console.error('Error creating bundle:', err);
  process.exit(1);
});
