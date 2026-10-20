import { writeFile, readFile } from 'node:fs/promises';
import { business } from '../src/config/business.js';

const siteUrl = business.siteUrl.trim().replace(/\/$/, '');
if (!siteUrl) {
  console.info('Site URL is unset; skipped sitemap generation. Set business.siteUrl before deployment.');
  process.exit(0);
}

let base;
try {
  base = new URL(siteUrl);
  if (!['http:', 'https:'].includes(base.protocol)) throw new Error('Unsupported protocol');
} catch {
  console.error('Invalid business.siteUrl. Use a complete http(s) URL.');
  process.exit(1);
}

const slug = (value) => value.toLowerCase().replace(/[&()]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
const routes = ['/', '/services', ...[
  'Denting & Painting', 'Accident Repair', 'Mechanical Repairs', 'Car Maintenance & Servicing',
  'Car Wash & Detailing', 'Paintless Dent Removal', 'Bumper Repair', 'Full Body Painting',
  'Rubbing & Polishing', 'Chassis & Frame Alignment', 'Diagnostic Scanning', 'Wheel Alignment'
].map(name => `/services/${slug(name)}`), '/about', '/gallery', '/insurance', '/contact'];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(route => `  <url><loc>${new URL(route, base).href}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile('dist/sitemap.xml', xml, 'utf8');
const robots = await readFile('dist/robots.txt', 'utf8').catch(() => 'User-agent: *\nAllow: /\n');
await writeFile('dist/robots.txt', `${robots.trim()}\nSitemap: ${new URL('/sitemap.xml', base).href}\n`, 'utf8');
console.info(`Generated sitemap for ${base.origin}`);
