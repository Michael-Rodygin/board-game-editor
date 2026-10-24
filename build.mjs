import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, 'dist');
const staticFiles = ['index.html', 'card.html', 'card_template_empty.png'];
const assetFolders = ['hexes/terrain', 'hexes/buildings', 'icons', 'cats', 'tile_icons'];
const imageExtensions = /\.(png|jpe?g|webp)$/i;

async function listImages(folder) {
  try {
    return (await fs.readdir(path.join(root, folder), { withFileTypes: true }))
      .filter(entry => entry.isFile() && imageExtensions.test(entry.name))
      .map(entry => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });

for (const file of staticFiles) await fs.copyFile(path.join(root, file), path.join(output, file));
for (const folder of assetFolders) {
  await fs.cp(path.join(root, folder), path.join(output, folder), { recursive: true });
}

const manifest = {
  terrain: await listImages('hexes/terrain'),
  buildings: await listImages('hexes/buildings'),
  icons: await listImages('icons'),
  cats: await listImages('cats'),
};
await fs.writeFile(path.join(output, 'asset-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Built static site in dist/ (${staticFiles.length} pages/templates and ${assetFolders.length} asset folders).`);
