import fs from 'fs';
import path from 'path';

// Define directories and data sources
const baseDir = path.resolve('chemicals/textile-chemicals');
const categoriesPath = path.resolve('data/textile-chemical-categories.json');
const productsPath = path.resolve('data/textile-products.json');

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`--- GENERATING ALL ${products.length} TEXTILE CHEMICAL PRODUCT PAGES ---`);

// Helper to escape HTML characters
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Map for quick product lookup by ID
const productMap = new Map();
products.forEach(p => productMap.set(p.id, p));

// Category map by ID
const categoryMap = new Map();
categories.forEach(c => categoryMap.set(c.id, c));

let generatedCount = 0;

products.forEach(prod => {
  const catSlug = prod.categorySlug;
  const prodSlug = prod.slug;
  const targetDir = path.join(baseDir, catSlug, prodSlug);

  fs.mkdirSync(targetDir, { recursive: true });

  const categoryObj = categoryMap.get(prod.categoryId) || {
    name: prod.categoryName,
    code: prod.categoryId,
    slug: catSlug
  };

  const pageTitle = `${prod.name} | Textile Chemical Sourcing | Om Sai Enterprise Surat`;
  const metaDesc = `${prod.name} (${prod.chemicalFamily}) for ${prod.processStages.join(', ')} in textile wet processing. Sourced by Om Sai Enterprise, Surat for mills, dyeing houses, and printing units.`;
  const canonicalUrl = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${catSlug}/${prodSlug}/`;
  const categoryUrl = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${catSlug}/`;

  // Determine related products
  let relatedProds = (prod.relatedProductIds || [])
    .map(id => productMap.get(id))
    .filter(Boolean);

  if (relatedProds.length < 3) {
    const sameCatProds = products.filter(p => p.categoryId === prod.categoryId && p.id !== prod.id);
    for (const p of sameCatProds) {
      if (!relatedProds.some(rp => rp.id === p.id)) {
        relatedProds.push(p);
      }
      if (relatedProds.length >= 4) break;
    }
  }

  // Schema JSON-LD
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": prod.name,
    "description": prod.shortDescription,
    "category": prod.categoryName,
    "brand": {
      "@type": "Brand",
      "name": "Om Sai Enterprise"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "INR",
      "price": "0.00",
      "priceValidUntil": "2027-12-31",
      "url": canonicalUrl,
      "seller": {
        "@type": "Organization",
        "name": "Om Sai Enterprise",
        "url": "https://mrrajyadav.github.io/My-Website/"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mrrajyadav.github.io/My-Website/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Chemicals",
        "item": "https://mrrajyadav.github.io/My-Website/chemicals/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Textile Chemicals",
        "item": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals.html"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": prod.categoryName,
        "item": categoryUrl
      },
      {
        "@type": "ListItem",
        "position": 5,
        "name": prod.name,
        "item": canonicalUrl
      }
    ]
  };

  const tc = prod.technicalContent || {};
  const comm = prod.commercial || {};

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${esc(prod.name)} | Textile Chemical Sourcing | Om Sai Enterprise" />
  <meta property="og:description" content="${esc(prod.shortDescription)}" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="https://mrrajyadav.github.io/My-Website/assets/logos/om-sai-enterprise.jpeg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(prod.name)} | Om Sai Enterprise Surat" />
  <meta name="twitter:description" content="${esc(prod.shortDescription)}" />
  <link rel="icon" type="image/svg+xml" href="../../../../assets/icons/favicon.svg" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../../../css/style.css" />
  <link rel="stylesheet" href="../../../../css/chemicals.css" />
  <link rel="stylesheet" href="../../../../css/chemicals-textile.css" />
  <link rel="stylesheet" href="../../../../css/responsive.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  ${JSON.stringify(productSchema, null, 2)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbSchema, null, 2)}
  </script>
</head>
<body class="theme-chem page-chem-textile">

  <!-- ========================================================================
       SITE HEADER
       ======================================================================== -->
  <header class="site-header">
    <div class="container">
      <a href="../../index.html" class="logo-item" title="Om Sai Enterprise - Chemicals Specialist">
        <div class="logo-container-dark">
          <img src="../../../../assets/logos/om-sai-enterprise.jpeg" alt="Om Sai Enterprise Logo" class="logo-img" />
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
        <a href="../../../../index.html" class="nav-link" style="color: var(--corporate-muted, #6C7D8E); font-size: 0.875rem;">&larr; Corporate Portal</a>
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
       1. BREADCRUMBS
       ======================================================================== -->
  <nav class="chem-tex-breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="chem-tex-breadcrumb-list">
        <li class="chem-tex-breadcrumb-item"><a href="../../../../index.html">Home</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../../index.html">Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../../textile-chemicals.html">Textile Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../index.html">${esc(prod.categoryName)}</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item active" aria-current="page">${esc(prod.name)}</li>
      </ol>
    </div>
  </nav>

  <!-- ========================================================================
       2. PRODUCT HERO & SUMMARY
       ======================================================================== -->
  <section class="chem-tex-pdetail-hero">
    <div class="container">
      <div class="chem-tex-pdetail-grid">
        <div>
          <span class="chem-tex-kicker">${esc(prod.categoryId)} &bull; ${esc(prod.categoryName)} &bull; ${esc(prod.processStages[0] || 'Textile Wet Processing')}</span>
          <h1 style="font-size: clamp(2rem, 3.2vw, 2.75rem); font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 16px; line-height: 1.2;">
            ${esc(prod.name)}
          </h1>
          <p style="font-size: 1.125rem; color: #4A5B6D; line-height: 1.7; margin-bottom: 24px;">
            ${esc(prod.shortDescription)}
          </p>

          <div style="display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 32px;">
            <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Enquire on IndiaMART
            </a>
            <a href="../../contact.html" class="btn btn-outline btn-lg">Request TDS / Commercial Quote</a>
          </div>

          <!-- Quick Parameters Table -->
          <table class="chem-tex-spec-table">
            <tbody>
              <tr>
                <th style="width: 32%;">Item Code &amp; Class</th>
                <td><strong>${esc(prod.id)}</strong> &bull; ${esc(prod.chemicalFamily)}</td>
              </tr>
              <tr>
                <th>Primary Function</th>
                <td>${esc(prod.functions.join(', '))}</td>
              </tr>
              <tr>
                <th>Process Stage</th>
                <td>${esc(prod.processStages.join(', '))}</td>
              </tr>
              <tr>
                <th>Applicable Fibres</th>
                <td>${esc(prod.applicableFibres.join(', '))}</td>
              </tr>
              <tr>
                <th>Fabric Applications</th>
                <td>${esc(prod.fabricApplications.join(', '))}</td>
              </tr>
              <tr>
                <th>Machinery Compatibility</th>
                <td>${esc(prod.machineryApplications.join(', '))}</td>
              </tr>
              <tr>
                <th>Commercial Packaging</th>
                <td>${esc((comm.packaging || ['50 kg Carbouys', '200 kg HDPE Drums', '1,000 kg IBC Totes']).join(', '))}</td>
              </tr>
              <tr>
                <th>Synonyms / Aliases</th>
                <td>${esc(prod.synonyms.join(', '))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sourcing Card -->
        <aside class="chem-tex-pdetail-card">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <span style="display: inline-block; width: 10px; height: 10px; background-color: #10B981; border-radius: 50%;"></span>
            <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #047857;">Commercial Supply Ready</span>
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 12px;">
            Om Sai Enterprise Sourcing Desk
          </h3>
          <p style="font-size: 0.875rem; color: #586A7D; line-height: 1.6; margin-bottom: 16px;">
            Direct commercial supply to processing mills, dyeing houses, and export finishing plants across Surat and western India.
          </p>
          <ul style="font-size: 0.8125rem; color: #3B4B5A; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; padding: 0;">
            <li>&check; Authentic Technical Data Sheet (TDS) support</li>
            <li>&check; Manufacturer Safety Data Sheet (SDS/MSDS)</li>
            <li>&check; Batch Certificate of Analysis (COA) per delivery</li>
            <li>&check; Bulk industrial drum and IBC container delivery</li>
            <li>&check; Direct trade inquiries via IndiaMART</li>
          </ul>
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-block" style="margin-bottom: 10px;">
            Submit Inquiry on IndiaMART
          </a>
          <a href="../../contact.html" class="btn btn-outline btn-block" style="font-size: 0.875rem;">
            Contact Surat Sourcing Team
          </a>
        </aside>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       TECHNICAL DOSSIER SECTIONS
       ======================================================================== -->
  <section class="section" style="background-color: #FFFFFF; border-bottom: 1px solid var(--chem-border, #D5DFEB);">
    <div class="container">
      <div style="max-width: 860px;">

        <!-- 1. Overview & Role -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 1.65rem; font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 12px;">
            1. Wet Processing Role &amp; Technical Overview
          </h2>
          <p style="font-size: 1rem; color: #3B4B5A; line-height: 1.75; margin-bottom: 14px;">
            ${esc(tc.overview || prod.shortDescription)}
          </p>
          <p style="font-size: 0.95rem; color: #586A7D; line-height: 1.7;">
            <strong>Functional Purpose:</strong> ${esc(tc.purpose || 'Engineered for reproducible industrial wet processing performance.')}
          </p>
        </div>

        <!-- 2. When Is It Used? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            2. When Is It Used? (Processing Sequence)
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.whenUsed || 'Integrated into dedicated batch or continuous wet processing baths in calibrated sequences.')}
          </p>
        </div>

        <!-- 3. Why Is It Used? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            3. Why Is It Used? (Operational &amp; Quality Challenges Solved)
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.whyUsed || 'Prevents common fabric defects including uneven penetration, premature precipitation, or harsh tactile handle.')}
          </p>
        </div>

        <!-- 4. How Does It Work? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            4. How Does It Work? (Chemical Mechanism &amp; Mode of Action)
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.howItWorks || 'Acts at the fibre-liquor interface through surface tension modification, molecular dispersion, or polymeric cross-linking.')}
          </p>
        </div>

        <!-- 5. Selection Factors -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            5. Technical Selection Factors for Mill Buyers
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.selectionFactors || 'Evaluation parameters include liquor pH stability, thermal resistance, electrolyte tolerance, and low foaming behavior under pump shear.')}
          </p>
        </div>

        <!-- 6. Compatibility & Co-Auxiliaries -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            6. Chemical Compatibility &amp; Co-Auxiliary Synergy
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.compatibility || 'Confirm ionic compatibility prior to combining in concentrated pre-mix baths. Compatible with standard dyeing and finishing formulations.')}
          </p>
        </div>

        <!-- 7. Process Limitations & Handling -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            7. Process Limitations &amp; Operational Precautions
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.7;">
            ${esc(tc.limitations || 'Avoid severe over-dosing. Maintain recommended bath temperature and pH conditions to avoid premature precipitation.')}
          </p>
        </div>

        <!-- 8. Storage & Handling -->
        <div style="margin-bottom: 40px; padding: 22px; background-color: #F8FAFD; border: 1px solid #D5DFEB; border-radius: 12px;">
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 8px;">
            8. Storage, Packaging &amp; Handling Protocol
          </h4>
          <p style="font-size: 0.9rem; color: #4A5B6D; line-height: 1.65; margin-bottom: 10px;">
            ${esc(tc.storageAndHandling || 'Store in original tightly closed containers under sheltered conditions between 5°C and 35°C. Protect from direct frost and extreme solar radiation.')}
          </p>
          <p style="font-size: 0.85rem; color: #6C7D8E; margin: 0;">
            <strong>Standard Industrial Packing:</strong> ${esc((comm.packaging || ['50 kg Carbouys', '200 kg HDPE Drums', '1,000 kg IBC Totes']).join(', '))}
          </p>
        </div>

        <!-- 9. Safety & Trader Disclaimer Notice -->
        <div class="chem-tex-doc-disclaimer">
          <strong style="color: #92400E; display: block; margin-bottom: 6px;">Technical Documentation &amp; Trader Disclosure:</strong>
          Om Sai Enterprise operates as an independent commercial chemical trading firm in Surat, Gujarat. Technical Data Sheets (TDS), Safety Data Sheets (SDS), and batch Certificates of Analysis (COA) are issued by original chemical manufacturers. Material safety guidelines, hazard classifications, and personal protective equipment (PPE) recommendations outlined in the manufacturer SDS must be strictly followed by mill operating staff. Mill pre-trials are recommended before large-scale commercial application.
        </div>

      </div>
    </div>
  </section>

  <!-- ========================================================================
       RELATED PRODUCTS
       ======================================================================== -->
  <section class="section" style="background-color: #F8FAFD; border-bottom: 1px solid var(--chem-border, #D5DFEB);">
    <div class="container">
      <div style="margin-bottom: 32px;">
        <span class="chem-tex-kicker">COMPLEMENTARY AUXILIARIES</span>
        <h2 style="font-size: 1.85rem; font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 8px;">
          Related Products in ${esc(prod.categoryName)}
        </h2>
        <p style="font-size: 0.95rem; color: #586A7D;">
          Explore other industrial chemicals frequently specified alongside ${esc(prod.name)} in mill processing programs.
        </p>
      </div>

      <div class="chem-tex-categories-grid">
        ${relatedProds.slice(0, 3).map(rel => `
          <article class="chem-tex-category-card">
            <span class="chem-tex-cat-num">${esc(rel.categoryId)}</span>
            <h3 class="chem-tex-cat-title">${esc(rel.name)}</h3>
            <p class="chem-tex-cat-desc">${esc(rel.shortDescription)}</p>
            <div style="font-size: 0.8125rem; color: #586A7D; margin-bottom: 16px;">
              <strong>Function:</strong> ${esc(rel.functions[0] || 'Auxiliary')} &bull; <strong>Fibres:</strong> ${esc(rel.applicableFibres.slice(0, 2).join(', '))}
            </div>
            <div class="chem-tex-cat-action">
              <a href="../${rel.slug}/index.html" class="btn btn-primary btn-sm">Product Profile &rarr;</a>
              <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm">Enquire</a>
            </div>
          </article>
        `).join('')}
      </div>

      <div style="text-align: center; margin-top: 36px;">
        <a href="../index.html" class="btn btn-outline">
          &larr; View All Products in ${esc(prod.categoryName)}
        </a>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       COMMERCIAL ENQUIRY CTA
       ======================================================================== -->
  <section class="chem-tex-cta-section">
    <div class="container">
      <div class="chem-tex-cta-card">
        <h2 class="chem-tex-cta-title">Procure ${esc(prod.name)} for Mill Production</h2>
        <p class="chem-tex-cta-desc">
          Contact Om Sai Enterprise to inquire on commercial lot availability, container packaging, technical documentation, and delivery schedules in Surat or nationwide.
        </p>
        <div class="chem-tex-cta-actions">
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
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
          <a href="../../../../privacy-policy.html" class="footer-link">Privacy Policy</a>
          <a href="../../../../terms.html" class="footer-link">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>

  <script src="../../../../js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');
  generatedCount++;
});

console.log(`✓ Successfully generated all ${generatedCount} individual textile chemical product pages.`);
