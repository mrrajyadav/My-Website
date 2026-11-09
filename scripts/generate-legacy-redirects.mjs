import fs from 'fs';
import path from 'path';

const legacyDataPath = path.resolve('data/legacy-urls.json');
const legacyUrls = JSON.parse(fs.readFileSync(legacyDataPath, 'utf8'));

console.log(`--- GENERATING LEGACY STATIC REDIRECTS FOR ${legacyUrls.length} OUTDATED ROUTES ---`);

const redirectsNetlify = [];

legacyUrls.forEach(item => {
  const legacyDir = path.resolve(item.legacyPath);
  fs.mkdirSync(legacyDir, { recursive: true });

  // Calculate relative path from legacyDir to destinationPath
  const fromParts = item.legacyPath.split('/').filter(Boolean);
  const toParts = item.destinationPath.split('/').filter(Boolean);

  // Common prefix length
  let common = 0;
  while (common < fromParts.length && common < toParts.length && fromParts[common] === toParts[common]) {
    common++;
  }

  const upLevels = fromParts.length - common;
  const upString = upLevels > 0 ? '../'.repeat(upLevels) : './';
  const downString = toParts.slice(common).join('/');
  const relativeTarget = `${upString}${downString}/`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=${relativeTarget}" />
  <link rel="canonical" href="${item.canonicalUrl}" />
  <title>Redirecting to ${item.title} | Om Sai Enterprise</title>
  <script>
    window.location.replace('${relativeTarget}');
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #F4F7FA;
      color: #202B36;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
      margin: 0;
      padding: 24px;
    }
    .redirect-card {
      max-width: 540px;
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #D5DFEB;
      border-radius: 12px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 4px 16px rgba(7, 84, 181, 0.05);
    }
    h2 {
      color: #0754B5;
      font-size: 1.4rem;
      margin-top: 0;
      margin-bottom: 12px;
    }
    p {
      color: #4A5B6D;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .btn-redirect {
      display: inline-block;
      background: #0754B5;
      color: #FFFFFF;
      padding: 10px 22px;
      border-radius: 6px;
      font-weight: 600;
      text-decoration: none;
    }
    .btn-redirect:hover {
      background: #053E87;
    }
  </style>
</head>
<body>
  <div class="redirect-card">
    <h2>Page Moved Permanently</h2>
    <p>This technical sourcing guide has moved to its permanent canonical route:</p>
    <a href="${relativeTarget}" class="btn-redirect">Continue to ${item.title} &rarr;</a>
    <p style="font-size: 0.8125rem; color: #6C7D8E; margin-top: 24px; margin-bottom: 0;">
      If your browser does not redirect automatically, please click the button above.
    </p>
  </div>
</body>
</html>
`;

  const destFile = path.join(legacyDir, 'index.html');
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`✓ Generated redirect: /${item.legacyPath}/ -> ${relativeTarget}`);

  // Also collect 301 line for _redirects
  redirectsNetlify.push(`/${item.legacyPath}/ /${item.destinationPath}/ 301!`);
  redirectsNetlify.push(`/${item.legacyPath} /${item.destinationPath}/ 301!`);
});

// Write public/_redirects for hosting platforms supporting server-side 301
fs.writeFileSync('public/_redirects', redirectsNetlify.join('\n') + '\n', 'utf8');
console.log('✓ Generated public/_redirects with 301 rules.');
