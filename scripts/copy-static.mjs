import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy js directory
if (fs.existsSync('js')) {
  fs.cpSync('js', path.join(distDir, 'js'), { recursive: true });
}

// Copy data directory
if (fs.existsSync('data')) {
  fs.cpSync('data', path.join(distDir, 'data'), { recursive: true });
}

// Copy public assets if any were not bundled
if (fs.existsSync('assets')) {
  fs.cpSync('assets', path.join(distDir, 'assets'), { recursive: true });
}

// Copy css directory for direct static serving
if (fs.existsSync('css')) {
  fs.cpSync('css', path.join(distDir, 'css'), { recursive: true });
}

// Copy public files (_redirects, sitemap.xml, robots.txt, favicon.svg)
const publicDir = path.resolve('public');
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, distDir, { recursive: true });
}

// Copy legacy redirect directories under chemicals/ if generated
const legacyUrlsPath = path.resolve('data/legacy-urls.json');
if (fs.existsSync(legacyUrlsPath)) {
  try {
    const legacyUrls = JSON.parse(fs.readFileSync(legacyUrlsPath, 'utf8'));
    for (const item of legacyUrls) {
      const relPath = (item.legacyPath || item.source || '').replace(/^\//, '');
      if (relPath && fs.existsSync(relPath)) {
        const dest = path.join(distDir, relPath);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.cpSync(relPath, dest, { recursive: true });
      }
    }
  } catch (err) {
    console.warn('Warning copying legacy redirects:', err.message);
  }
}

console.log('✓ Successfully copied static assets (js, css, data, assets, textile-chemicals, legacy redirects) to dist/');

