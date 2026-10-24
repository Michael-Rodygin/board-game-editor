import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const host = '127.0.0.1';
const port = 4177;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${host}:${port}`).pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  if (pathname === '/api/assets') {
    const assets = {};
    for (const category of ['terrain', 'buildings']) {
      const folder = path.join(root, 'hexes', category);
      try {
        assets[category] = fs.readdirSync(folder)
          .filter(name => name.toLowerCase().endsWith('.png'))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      } catch {
        assets[category] = [];
      }
    }
    res.writeHead(200, { 'Content-Type': mime['.json'], 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(assets));
    return;
  }

  if (pathname === '/api/card-assets') {
    const assets = {};
    for (const category of ['icons', 'cats']) {
      const folder = path.join(root, category);
      try {
        assets[category] = fs.readdirSync(folder)
          .filter(name => /\.(png|jpe?g|webp)$/i.test(name))
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      } catch {
        assets[category] = [];
      }
    }
    res.writeHead(200, { 'Content-Type': mime['.json'], 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(assets));
    return;
  }

  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = path.resolve(root, relative);
  if (target !== root && !target.startsWith(root + path.sep)) {
    res.writeHead(403).end('Forbidden');
    return;
  }
  const publicFolders = ['hexes', 'icons', 'cats', 'tile_icons'];
  const isPublicFile = ['index.html', 'card.html', 'Card_template.png', 'card_template_empty.png'].some(file => target === path.join(root, file)) || publicFolders.some(folder => target.startsWith(path.join(root, folder) + path.sep));
  if (!isPublicFile) {
    res.writeHead(404).end('Not found');
    return;
  }

  fs.readFile(target, (error, data) => {
    if (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
      return;
    }
    res.writeHead(200, {
      'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
});

server.on('error', error => {
  console.error(`Could not start Hex Tile Workshop on ${host}:${port}: ${error.message}`);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`Hex Tile Workshop is serving this folder at http://${host}:${port}/`);
  console.log('Leave this window open while using the editor. Press Ctrl+C to stop the server.');
});
