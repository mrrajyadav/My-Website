import fs from 'fs';
import path from 'path';

const categoriesPath = path.resolve('data/textile-chemical-categories.json');
const productsPath = path.resolve('data/textile-products.json');
const sitemapPath = path.resolve('public/sitemap.xml');

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const baseUrl = 'https://mrrajyadav.github.io/My-Website';
const today = new Date().toISOString().split('T')[0];

console.log('--- GENERATING XML SITEMAP ---');

const coreUrls = [
  { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${baseUrl}/privacy-policy.html`, priority: '0.3', changefreq: 'monthly' },
  { loc: `${baseUrl}/terms.html`, priority: '0.3', changefreq: 'monthly' },

  // FMCG Division (Preserved)
  { loc: `${baseUrl}/fmcg/`, priority: '0.9', changefreq: 'monthly' },
  { loc: `${baseUrl}/fmcg/about.html`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${baseUrl}/fmcg/brands.html`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${baseUrl}/fmcg/products.html`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${baseUrl}/fmcg/contact.html`, priority: '0.7', changefreq: 'monthly' },

  // Om Sai Enterprise Chemicals
  { loc: `${baseUrl}/chemicals/`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${baseUrl}/chemicals/about.html`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${baseUrl}/chemicals/products.html`, priority: '0.85', changefreq: 'weekly' },
  { loc: `${baseUrl}/chemicals/textile-chemicals.html`, priority: '0.95', changefreq: 'daily' },
  { loc: `${baseUrl}/chemicals/industrial-chemicals.html`, priority: '0.85', changefreq: 'weekly' },
  { loc: `${baseUrl}/chemicals/contact.html`, priority: '0.8', changefreq: 'monthly' }
];

const categoryUrls = categories.map(cat => ({
  loc: `${baseUrl}/chemicals/textile-chemicals/${cat.slug}/`,
  priority: '0.85',
  changefreq: 'weekly'
}));

const productUrls = products.map(prod => ({
  loc: `${baseUrl}/chemicals/textile-chemicals/${prod.categorySlug}/${prod.slug}/`,
  priority: '0.80',
  changefreq: 'weekly'
}));

const allUrls = [...coreUrls, ...categoryUrls, ...productUrls];

const xmlLines = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<!-- `,
  `  Complete Automated Sitemap for Baburam Trading & Om Sai Enterprise`,
  `  Includes 13 Textile Chemical Categories and 140 Individual Textile Chemical Products`,
  `  Generated: ${today}`,
  `-->`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`
];

function getFileLastmod(relPath) {
  try {
    const full = path.resolve(relPath);
    if (fs.existsSync(full)) {
      return fs.statSync(full).mtime.toISOString().split('T')[0];
    }
  } catch {
    // ignore
  }
  return null;
}

for (const item of allUrls) {
  xmlLines.push(`  <url>`);
  xmlLines.push(`    <loc>${item.loc}</loc>`);
  
  // Resolve disk path to get truthful lastmod
  let diskFile = null;
  const pathPart = item.loc.replace(baseUrl, '');
  if (pathPart === '/' || pathPart === '') diskFile = 'index.html';
  else if (pathPart.endsWith('.html')) diskFile = pathPart.replace(/^\//, '');
  else if (pathPart.includes('/chemicals/textile-chemicals/')) {
    diskFile = path.join(pathPart.replace(/^\//, ''), 'index.html');
  } else if (pathPart.endsWith('/')) {
    diskFile = path.join(pathPart.replace(/^\//, ''), 'index.html');
  }

  const lastmod = diskFile ? getFileLastmod(diskFile) : null;
  if (lastmod) {
    xmlLines.push(`    <lastmod>${lastmod}</lastmod>`);
  }
  xmlLines.push(`    <changefreq>${item.changefreq}</changefreq>`);
  xmlLines.push(`    <priority>${item.priority}</priority>`);
  xmlLines.push(`  </url>`);
}

xmlLines.push(`</urlset>`);

fs.writeFileSync(sitemapPath, xmlLines.join('\n'), 'utf8');

console.log(`✓ Successfully generated sitemap.xml with ${allUrls.length} total URLs.`);
console.log(`  - Core pages: ${coreUrls.length}`);
console.log(`  - Category pages: ${categoryUrls.length}`);
console.log(`  - Product pages: ${productUrls.length}`);
