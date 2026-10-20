import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { placesPhotosHandler } from './google-places.js';
import { business } from '../src/config/business.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
try {
  const env = await readFile(path.resolve(root, '../.env'), 'utf8');
  for (const line of env.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
} catch { /* .env is optional; deployment platforms can inject environment variables. */ }

const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml' };
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost');
  if (url.pathname === '/api/places-photos') {
    await placesPhotosHandler(req, res, { apiKey: process.env.PLACES_API_KEY || '', placeId: business.location.placeId });
    return;
  }
  let requestPath;
  try { requestPath = decodeURIComponent(url.pathname); } catch { res.writeHead(400).end(); return; }
  let file = requestPath === '/' ? path.join(root, 'index.html') : path.resolve(root, `.${requestPath}`);
  if (!file.startsWith(`${root}${path.sep}`) && file !== path.join(root, 'index.html')) { res.writeHead(403).end(); return; }
  try {
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
  } catch {
    file = path.join(root, 'index.html');
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': path.basename(file) === 'index.html' ? 'no-cache' : 'public, max-age=3600' });
    res.end(data);
  } catch { res.writeHead(404).end('Not found'); }
});
const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`United Motors is listening on port ${port}`));
