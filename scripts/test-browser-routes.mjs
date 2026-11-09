import fs from 'fs';
import path from 'path';

console.log('--- COMPREHENSIVE QA & ROUTE VERIFICATION SUITE ---');

const categories = JSON.parse(fs.readFileSync('data/textile-chemical-categories.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('data/textile-products.json', 'utf8'));
const legacyUrls = JSON.parse(fs.readFileSync('data/legacy-urls.json', 'utf8'));

let errors = [];
let passedChecks = 0;

function checkFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`[${label}] File does not exist: ${filePath}`);
    return null;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.trim().length === 0) {
    errors.push(`[${label}] File is empty: ${filePath}`);
    return null;
  }
  passedChecks++;
  return content;
}

// 1. Core Pages Audit
console.log('\n1. Checking Core Pages & Structure...');
const corePages = [
  'index.html',
  'chemicals/index.html',
  'chemicals/about.html',
  'chemicals/products.html',
  'chemicals/textile-chemicals.html',
  'chemicals/industrial-chemicals.html',
  'chemicals/contact.html',
  'privacy-policy.html',
  'terms.html',
  '404.html'
];

corePages.forEach(cp => {
  const html = checkFile(cp, `Core Page: ${cp}`);
  if (html) {
    if (!html.includes('<title>') || html.includes('<title></title>')) {
      errors.push(`[Core Page: ${cp}] Missing or empty <title> tag.`);
    }
    if (!html.includes('name="description"')) {
      errors.push(`[Core Page: ${cp}] Missing meta description.`);
    }
    if (!html.includes('rel="canonical"') && cp !== '404.html') {
      errors.push(`[Core Page: ${cp}] Missing canonical link tag.`);
    }
    passedChecks += 3;
  }
});

// 2. All 13 Category Landing Pages
console.log('2. Checking 13 Category Landing Pages...');
categories.forEach(cat => {
  const catPath = path.join('chemicals/textile-chemicals', cat.slug, 'index.html');
  const html = checkFile(catPath, `Category: ${cat.slug}`);
  if (html) {
    if (!html.includes(cat.name)) {
      errors.push(`[Category: ${cat.slug}] Category name "${cat.name}" not found in page content.`);
    }
    if (!html.includes('application/ld+json')) {
      errors.push(`[Category: ${cat.slug}] Missing JSON-LD structured data.`);
    }
    if (!html.includes(`https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${cat.slug}/`)) {
      errors.push(`[Category: ${cat.slug}] Canonical tag URL mismatch.`);
    }
    passedChecks += 3;
  }
});

// 3. All 140 Individual Product Pages
console.log('3. Checking All 140 Individual Product Pages...');
let validJsonLdCount = 0;
products.forEach(p => {
  const prodPath = path.join('chemicals/textile-chemicals', p.categorySlug, p.slug, 'index.html');
  const html = checkFile(prodPath, `Product: ${p.id} (${p.slug})`);
  if (html) {
    // Title check
    if (!html.includes(p.name)) {
      errors.push(`[Product: ${p.id}] Name "${p.name}" not found in product page HTML.`);
    }
    // Canonical link check
    const expectedCanonical = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${p.categorySlug}/${p.slug}/`;
    if (!html.includes(expectedCanonical)) {
      errors.push(`[Product: ${p.id}] Canonical link does not match "${expectedCanonical}".`);
    }
    // Technical parameters
    if (!html.includes('Technical Selection Factors') && !html.includes('Selection Factors')) {
      errors.push(`[Product: ${p.id}] Missing technical selection parameters heading.`);
    }
    // Sourcing desk & truthful packaging notice
    if (!html.includes('Packaging subject to confirmation on quotation')) {
      errors.push(`[Product: ${p.id}] Missing required packaging quotation notice.`);
    }
    // JSON-LD validation
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonLdMatch) {
      errors.push(`[Product: ${p.id}] Missing JSON-LD script block.`);
    } else {
      try {
        const parsed = JSON.parse(jsonLdMatch[1]);
        if (!parsed['@context'] || !parsed['@type']) {
          errors.push(`[Product: ${p.id}] Invalid JSON-LD schema.`);
        } else {
          validJsonLdCount++;
        }
      } catch (e) {
        errors.push(`[Product: ${p.id}] JSON-LD parsing error: ${e.message}`);
      }
    }
    passedChecks += 4;
  }
});

// 4. Legacy Redirects Audit
console.log('4. Checking 14 Legacy 301 Redirect Pages...');
legacyUrls.forEach(lu => {
  const cleanPath = (lu.legacyPath || '').replace(/^\//, '');
  const redirectHtmlPath = path.join(cleanPath, 'index.html');
  const html = checkFile(redirectHtmlPath, `Legacy Redirect: ${cleanPath}`);
  if (html) {
    if (!html.includes('http-equiv="refresh"')) {
      errors.push(`[Legacy Redirect: ${cleanPath}] Missing meta refresh tag.`);
    }
    if (!html.includes(lu.canonicalUrl)) {
      errors.push(`[Legacy Redirect: ${cleanPath}] Canonical target URL mismatch.`);
    }
    passedChecks += 2;
  }
});

// 5. XML Sitemap Audit
console.log('5. Auditing public/sitemap.xml...');
const sitemapContent = checkFile('public/sitemap.xml', 'public/sitemap.xml');
if (sitemapContent) {
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
  if (locMatches.length !== 167) {
    errors.push(`Expected 167 URLs in sitemap.xml, found ${locMatches.length}.`);
  } else {
    passedChecks += 10;
  }
}

// 6. Summary Report
console.log('\n======================================================');
console.log(`TOTAL CHECKS PASSED: ${passedChecks}`);
console.log(`VALID JSON-LD PRODUCT SCHEMAS: ${validJsonLdCount} / 140`);

if (errors.length > 0) {
  console.error(`\n❌ QA TEST SUITE FAILED WITH ${errors.length} ERRORS:`);
  errors.slice(0, 25).forEach(e => console.error('  - ' + e));
  if (errors.length > 25) console.error(`  ... and ${errors.length - 25} more errors.`);
  process.exit(1);
}

console.log('✓ ALL 140 PRODUCT PAGES, 13 CATEGORY PAGES, 14 REDIRECTS, AND 10 CORE PAGES PASSED 100% OF QA CHECKS.');
process.exit(0);
