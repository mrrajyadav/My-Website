import fs from 'fs';
import path from 'path';

console.log('--- GENERATING ALL 13 TEXTILE CHEMICAL CATEGORY PAGES ---');

const baseDir = path.resolve('chemicals/textile-chemicals');
const categoriesPath = path.resolve('data/textile-chemical-categories.json');
const productsPath = path.resolve('data/textile-products.json');

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

categories.forEach(cat => {
  const catDir = path.join(baseDir, cat.slug);
  fs.mkdirSync(catDir, { recursive: true });

  const catProducts = products.filter(p => p.categoryId === cat.id);
  const canonicalUrl = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${cat.slug}/`;

  // Related categories (next 3 categories in sequence)
  const otherCats = categories.filter(c => c.id !== cat.id).slice(0, 3);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(cat.name)} | Om Sai Enterprise</title>
  <meta name="description" content="Explore ${esc(cat.name)} for textile wet processing. Sourced by Om Sai Enterprise, Surat for textile processing mills, dyeing units, and printing houses." />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${esc(cat.name)} | Om Sai Enterprise" />
  <meta property="og:description" content="${esc(cat.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="https://mrrajyadav.github.io/My-Website/assets/logos/om-sai-enterprise.jpeg" />
  <link rel="icon" type="image/svg+xml" href="../../../assets/icons/favicon.svg" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../../css/style.css" />
  <link rel="stylesheet" href="../../../css/chemicals.css" />
  <link rel="stylesheet" href="../../../css/chemicals-textile.css" />
  <link rel="stylesheet" href="../../../css/responsive.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${esc(cat.name)}",
    "description": "${esc(cat.description)}",
    "url": "${canonicalUrl}",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrrajyadav.github.io/My-Website/" },
        { "@type": "ListItem", "position": 2, "name": "Chemicals", "item": "https://mrrajyadav.github.io/My-Website/chemicals/" },
        { "@type": "ListItem", "position": 3, "name": "Textile Chemicals", "item": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals.html" },
        { "@type": "ListItem", "position": 4, "name": "${esc(cat.name)}", "item": "${canonicalUrl}" }
      ]
    }
  }
  </script>
</head>
<body class="theme-chem page-chem-textile">

  <!-- ========================================================================
       HEADER
       ======================================================================== -->
  <header class="site-header">
    <div class="container">
      <a href="../../index.html" class="logo-item" title="Om Sai Enterprise - Chemicals Specialist">
        <div class="logo-container-dark">
          <img src="../../../assets/logos/om-sai-enterprise.jpeg" alt="Om Sai Enterprise Logo" class="logo-img" />
        </div>
      </a>
      <nav class="main-nav" aria-label="Chemicals Navigation">
        <a href="../../index.html" class="nav-link">Home</a>
        <a href="../../about.html" class="nav-link">About Us</a>
        <a href="../../products.html" class="nav-link">Products</a>
        <a href="../../textile-chemicals.html" class="nav-link active">Textile Chemicals</a>
        <a href="../../industrial-chemicals.html" class="nav-link">Industrial Chemicals</a>
        <a href="../../contact.html#industries" class="nav-link">Industries We Serve</a>
        <a href="../../contact.html" class="nav-link">Contact Us</a>
        <a href="../../../index.html" class="nav-link" style="color: var(--corporate-muted, #6C7D8E); font-size: 0.875rem;">&larr; Corporate Portal</a>
        <div class="mobile-cta-item">
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-block">Enquire on IndiaMART</a>
        </div>
      </nav>
      <div class="header-actions">
        <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm">Enquire on IndiaMART</a>
        <button type="button" class="mobile-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- ========================================================================
       BREADCRUMB
       ======================================================================== -->
  <nav class="chem-tex-breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="chem-tex-breadcrumb-list">
        <li class="chem-tex-breadcrumb-item"><a href="../../../index.html">Home</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../../index.html">Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../../textile-chemicals.html">Textile Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item active" aria-current="page">${esc(cat.name)}</li>
      </ol>
    </div>
  </nav>

  <!-- ========================================================================
       CATEGORY HERO
       ======================================================================== -->
  <section class="chem-tex-hero">
    <div class="container">
      <div style="max-width: 820px;">
        <span class="chem-tex-kicker">${esc(cat.code)} &bull; ${esc(cat.processStage || 'Wet Processing')}</span>
        <h1 class="chem-tex-hero-title">${esc(cat.name)}</h1>
        <p class="chem-tex-hero-desc">${esc(cat.description)}</p>
        <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-top: 24px;">
          <a href="#product-list" class="btn btn-primary btn-lg">Browse Products (${catProducts.length})</a>
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-lg">
            Enquire on IndiaMART
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       CHEMICAL FAMILIES & APPLICATIONS OVERVIEW
       ======================================================================== -->
  <section class="section" style="background-color: #FFFFFF; border-bottom: 1px solid var(--chem-border, #D5DFEB);">
    <div class="container">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
        <div style="background-color: var(--chem-bg, #F4F7FA); border: 1px solid var(--chem-border, #D5DFEB); border-radius: 12px; padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 14px;">
            Key Chemical Families
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            ${(cat.chemicalFamilies || []).map(fam => `
              <li style="font-size: 0.9rem; color: #3B4B5A; padding-left: 14px; position: relative;">
                <span style="position: absolute; left: 0; color: var(--chem-secondary, #087F38); font-weight: bold;">•</span>
                ${esc(fam)}
              </li>
            `).join('')}
          </ul>
        </div>

        <div style="background-color: var(--chem-bg, #F4F7FA); border: 1px solid var(--chem-border, #D5DFEB); border-radius: 12px; padding: 24px;">
          <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 14px;">
            Key Processing Applications
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px;">
            ${(cat.keyApplications || []).map(app => `
              <li style="font-size: 0.9rem; color: #3B4B5A; padding-left: 14px; position: relative;">
                <span style="position: absolute; left: 0; color: var(--chem-primary, #0754B5); font-weight: bold;">✓</span>
                ${esc(app)}
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      ${cat.buyerEvaluationNotes ? `
        <div style="margin-top: 24px; padding: 18px 22px; background-color: #F8FAFD; border: 1px solid #D5DFEB; border-left: 4px solid var(--chem-primary, #0754B5); border-radius: 8px; font-size: 0.9rem; color: #4A5B6D; line-height: 1.6;">
          <strong>Buyer Sourcing &amp; Evaluation Notes:</strong> ${esc(cat.buyerEvaluationNotes)}
        </div>
      ` : ''}
    </div>
  </section>

  <!-- ========================================================================
       PRODUCT LISTING FOR THIS CATEGORY
       ======================================================================== -->
  <section class="section" id="product-list">
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span class="chem-tex-kicker">PRODUCT GUIDES</span>
          <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 6px;">
            ${esc(cat.name)} Portfolio
          </h2>
          <p style="color: #4A5B6D; font-size: 0.95rem;">
            Showing all ${catProducts.length} verified chemical products and auxiliaries in this category.
          </p>
        </div>
      </div>

      <div class="chem-tex-categories-grid">
        ${catProducts.map(p => `
          <article class="chem-tex-category-card" style="display: flex; flex-direction: column;">
            <div class="chem-tex-cat-header">
              <span class="chem-tex-cat-code">${esc(p.subcategory)}</span>
              <span class="chem-tex-cat-stage">${esc(p.processStages.join(', '))}</span>
            </div>
            <h3 class="chem-tex-cat-title" style="font-size: 1.2rem; margin-bottom: 8px;">
              <a href="${p.slug}/index.html" style="color: inherit; text-decoration: none;">${esc(p.name)}</a>
            </h3>
            <p class="chem-tex-cat-desc" style="font-size: 0.85rem; line-height: 1.55; margin-bottom: 14px; flex: 1;">
              ${esc(p.shortDescription)}
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;">
              ${p.applicableFibres.slice(0, 3).map(f => `
                <span style="font-size: 0.75rem; background: #EBF1F7; color: var(--chem-primary, #0754B5); padding: 3px 8px; border-radius: 4px; font-weight: 600;">${esc(f)}</span>
              `).join('')}
            </div>
            <div class="chem-tex-cat-action">
              <a href="${p.slug}/index.html" class="btn btn-outline btn-sm">Product Guide &rarr;</a>
              <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm">
                Enquire
              </a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- ========================================================================
       RELATED CATEGORIES
       ======================================================================== -->
  <section class="section" style="background-color: #FFFFFF; border-top: 1px solid var(--chem-border, #D5DFEB);">
    <div class="container">
      <div style="margin-bottom: 24px;">
        <span class="chem-tex-kicker">EXPLORE MORE</span>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--chem-primary, #0754B5);">Related Textile Chemical Categories</h3>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
        ${otherCats.map(oc => `
          <div style="background: var(--chem-bg, #F4F7FA); border: 1px solid var(--chem-border, #D5DFEB); border-radius: 10px; padding: 20px; display: flex; flex-direction: column;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--chem-secondary, #087F38); margin-bottom: 6px;">${esc(oc.code)}</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 8px;">
              <a href="../${oc.slug}/index.html" style="color: inherit; text-decoration: none;">${esc(oc.name)}</a>
            </h4>
            <p style="font-size: 0.825rem; color: #586A7D; line-height: 1.5; margin-bottom: 14px; flex: 1;">
              ${esc(oc.description.slice(0, 100))}...
            </p>
            <a href="../${oc.slug}/index.html" class="btn btn-outline btn-sm" style="align-self: flex-start;">View Category &rarr;</a>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- ========================================================================
       B2B ENQUIRY CTA
       ======================================================================== -->
  <section class="chem-tex-cta-section">
    <div class="container">
      <div class="chem-tex-cta-card">
        <h2 class="chem-tex-cta-title">Sourcing ${esc(cat.name)}</h2>
        <p class="chem-tex-cta-desc">
          Contact Om Sai Enterprise to discuss commercial chemical sourcing, minimum order quantities, packaging formats, and delivery timelines in Surat and across India.
        </p>
        <div class="chem-tex-cta-actions">
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-lg">
            Enquire on IndiaMART
          </a>
          <a href="../../contact.html" class="btn btn-outline btn-lg" style="color: #FFFFFF; border-color: rgba(255,255,255,0.6);">
            Contact Sourcing Desk
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       FOOTER
       ======================================================================== -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>&copy; 2026 Om Sai Enterprise. Chemicals Specialist Division. All rights reserved.</div>
        <div class="footer-legal-links">
          <a href="../../../privacy-policy.html" class="footer-link">Privacy Policy</a>
          <a href="../../../terms.html" class="footer-link">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="../../../js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(catDir, 'index.html'), html, 'utf8');
  console.log(`✓ Generated Category Page: ${cat.slug}/index.html (${catProducts.length} products)`);
});

console.log('✓ All 13 category pages successfully generated.');
