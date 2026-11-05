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

// Copy generated static textile chemicals pages
if (fs.existsSync('chemicals/textile-chemicals')) {
  fs.cpSync('chemicals/textile-chemicals', path.join(distDir, 'chemicals/textile-chemicals'), { recursive: true });
}

console.log('✓ Successfully copied static assets (js, css, data, assets, textile-chemicals) to dist/');
