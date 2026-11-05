import fs from 'fs';
import path from 'path';

// Define directories
const baseDir = path.resolve('chemicals/textile-chemicals');
const categoriesPath = path.resolve('data/textile-chemical-categories.json');
const candidatesPath = path.resolve('data/textile-product-candidates.json');

// Read taxonomy data
const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));

// Filter active products for static generation
const approvedProducts = candidatesData.filter(p => p.status === 'active' || p.status === 'approved');

console.log(`Building static product pages for ${approvedProducts.length} approved products...`);

// Helper to escape HTML
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Exact dictionary mapping category name to directory slug & category ID
const categoryMap = {
  'pretreatment chemicals': { slug: 'pretreatment-chemicals', catId: 'CAT-B' },
  'bleaching chemicals': { slug: 'pretreatment-chemicals', catId: 'CAT-C' },
  'dyeing auxiliaries': { slug: 'dyeing-auxiliaries', catId: 'CAT-D' },
  'textile dyes': { slug: 'dyeing-auxiliaries', catId: 'CAT-E' },
  'printing chemicals': { slug: 'printing-chemicals', catId: 'CAT-F' },
  'after-treatment & washing': { slug: 'after-treatment', catId: 'CAT-G' },
  'optical brighteners': { slug: 'finishing-chemicals', catId: 'CAT-H' },
  'softeners & finishing': { slug: 'finishing-chemicals', catId: 'CAT-I' },
  'functional finishes': { slug: 'finishing-chemicals', catId: 'CAT-J' },
  'garment & denim chemicals': { slug: 'garment-washing', catId: 'CAT-K' },
  'coating & technical textiles': { slug: 'coating-technical', catId: 'CAT-L' },
  'water & effluent treatment': { slug: 'effluent-treatment', catId: 'CAT-M' }
};

function getCategoryInfo(prod) {
  const key = (prod.category || '').toLowerCase().trim();
  const entry = categoryMap[key] || { slug: 'pretreatment-chemicals', catId: 'CAT-B' };
  const obj = categoriesData.find(c => c.id === entry.catId) || categoriesData[1];
  return { obj, slug: entry.slug };
}

// Generate each approved product page
approvedProducts.forEach(prod => {
  const { obj: categoryObj, slug: catSlug } = getCategoryInfo(prod);
  const prodSlug = prod.slug || prod.id.toLowerCase();
  const targetDir = path.join(baseDir, catSlug, prodSlug);

  fs.mkdirSync(targetDir, { recursive: true });

  const pageTitle = `${prod.name} | Om Sai Enterprise`;
  const metaDesc = `${prod.name} for textile wet processing. Sourced by Om Sai Enterprise, Surat for textile processing mills, dyeing houses, and printing units.`;
  const canonicalUrl = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${catSlug}/${prodSlug}/`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${esc(prod.name)} | Textile Chemical Sourcing" />
  <meta property="og:description" content="${esc(prod.shortDescription)}" />
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:image" content="https://mrrajyadav.github.io/My-Website/assets/logos/om-sai-enterprise.jpeg" />
  <link rel="icon" type="image/svg+xml" href="../../../../assets/icons/favicon.svg" />

  <!-- Stylesheets -->
  <link rel="stylesheet" href="../../../../css/style.css" />
  <link rel="stylesheet" href="../../../../css/chemicals.css" />
  <link rel="stylesheet" href="../../../../css/chemicals-textile.css" />
  <link rel="stylesheet" href="../../../../css/responsive.css" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${esc(prod.name)}",
    "description": "${esc(prod.shortDescription)}",
    "category": "${esc(categoryObj.name)}",
    "brand": {
      "@type": "Brand",
      "name": "Om Sai Enterprise"
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "INR",
      "price": "0.00",
      "seller": {
        "@type": "Organization",
        "name": "Om Sai Enterprise"
      }
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
        <li class="chem-tex-breadcrumb-item"><a href="../../textile-chemicals.html#categories">${esc(categoryObj.name)}</a></li>
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
          <span class="chem-tex-kicker">${esc(categoryObj.code)} &bull; ${esc(prod.processingStage)}</span>
          <h1 style="font-size: clamp(2rem, 3.4vw, 2.8rem); font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 16px; line-height: 1.2;">
            ${esc(prod.name)}
          </h1>
          <p style="font-size: 1.15rem; color: #4A5B6D; line-height: 1.7; margin-bottom: 24px;">
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
                <th>Primary Function</th>
                <td>${esc(prod.productFunction)}</td>
              </tr>
              <tr>
                <th>Processing Stage</th>
                <td>${esc(prod.processingStage)}</td>
              </tr>
              <tr>
                <th>Compatible Fibres</th>
                <td>${esc(prod.fibreType)}</td>
              </tr>
              <tr>
                <th>Target Applications</th>
                <td>${esc(prod.fabricApplication)}</td>
              </tr>
              <tr>
                <th>Commercial Packaging</th>
                <td>50 kg carbouys, 200 kg HDPE drums, 1,000 kg IBC totes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Sidebar / Sourcing Box -->
        <aside class="chem-tex-pdetail-card">
          <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 12px;">
            B2B Commercial Sourcing
          </h3>
          <p style="font-size: 0.875rem; color: #586A7D; line-height: 1.6; margin-bottom: 16px;">
            Om Sai Enterprise supplies specialty textile auxiliaries to processing mills and dyeing houses. Minimum order quantities and consignment packaging can be tailored to mill requirements.
          </p>
          <ul style="font-size: 0.8125rem; color: #3B4B5A; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; padding: 0;">
            <li>&check; Manufacturer-authenticated Technical Data Sheets</li>
            <li>&check; Batch Certificate of Analysis (COA) per dispatch</li>
            <li>&check; Commercial industrial packing standards</li>
          </ul>
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-block">
            Submit Trade Enquiry
          </a>
        </aside>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       3 to 6: DETAILED TECHNICAL SECTIONS
       ======================================================================== -->
  <section class="section" style="background-color: #FFFFFF; border-bottom: 1px solid var(--chem-border, #D5DFEB);">
    <div class="container">
      <div style="max-width: 840px;">
        <!-- 3. Product Overview -->
        <div style="margin-bottom: 40px;">
          <h2 style="font-size: 1.65rem; font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 12px;">
            Product Overview &amp; Wet Processing Role
          </h2>
          <p style="font-size: 1rem; color: #4A5B6D; line-height: 1.7;">
            <strong>${esc(prod.name)}</strong> is a specialty formulation engineered for the <em>${esc(prod.processingStage)}</em> phase of textile wet processing. It delivers targeted <strong>${esc(prod.productFunction)}</strong> performance, directly impacting substrate absorbency, dye exhaustion uniformity, or fabric surface handle across industrial textile finishing plants.
          </p>
        </div>

        <!-- 4. When Is It Used? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            When Is It Used?
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.65;">
            Applied primarily during <strong>${esc(prod.processingStage)}</strong>. In continuous or batch exhaust processing sequences, introducing this auxiliary at the calibrated stage ensures optimal interaction with the liquor without premature reaction or precipitation.
          </p>
        </div>

        <!-- 5. Why Is It Used? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            Why Is It Used?
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.65;">
            In commercial textile manufacturing, unassisted processing often suffers from surface tension resistance, patchy dye strike rates, or rough fabric handle. <strong>${esc(prod.name)}</strong> addresses these operational challenges by stabilizing bath conditions and standardizing substrate response lot after lot.
          </p>
        </div>

        <!-- 6. How Does It Work? -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            Technical Mechanism of Action
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.65;">
            The active compounds work by modifying interfacial tension, regulating ionic charges on the fibre surface, or forming specialized polymeric films. In surfactant-driven applications, hydrophilic and hydrophobic balance ensures rapid dispersion, while polymeric fixatives and silicones deposit uniformly along the amorphous regions of the textile substrate.
          </p>
        </div>

        <!-- 10. Selection Parameters & Evaluation -->
        <div style="margin-bottom: 40px;">
          <h3 style="font-size: 1.35rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 10px;">
            Selection &amp; Evaluation Considerations
          </h3>
          <p style="font-size: 0.95rem; color: #4A5B6D; line-height: 1.65;">
            Technical directors evaluating <strong>${esc(prod.name)}</strong> consider bath pH tolerance, foaming tendencies under high pump shear, electrolyte compatibility (Glauber's salt or soda ash), and compliance with mill wastewater discharge limits.
          </p>
        </div>

        <!-- 13. Application Guidance Notice -->
        <div style="margin-bottom: 40px; padding: 20px; background-color: #F8FAFD; border: 1px solid #D5DFEB; border-radius: 10px;">
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--chem-primary, #0754B5); margin-bottom: 8px;">
            Application Guidance &amp; Dosage Protocol
          </h4>
          <p style="font-size: 0.875rem; color: #4A5B6D; line-height: 1.65; margin: 0;">
            Application conditions should be confirmed from the specific manufacturer's Technical Data Sheet and process requirements. Exact dosage depends on substrate weight, liquor ratio, machinery type, and target processing specification. Mill trials are recommended prior to bulk adoption.
          </p>
        </div>

        <!-- 14. Safety & Documentation Notice -->
        <div class="chem-tex-doc-disclaimer">
          <strong>Technical Documentation &amp; Trader Disclosure:</strong>
          Om Sai Enterprise operates as an independent chemical trading enterprise. Technical Data Sheets (TDS), Safety Data Sheets (SDS), and batch Certificates of Analysis (COA) are issued by original manufacturers. Material safety guidelines, storage temperatures, and personal protective equipment (PPE) recommendations outlined in the respective product SDS must be strictly followed.
        </div>
      </div>
    </div>
  </section>

  <!-- ========================================================================
       16. COMMERCIAL ENQUIRY CTA
       ======================================================================== -->
  <section class="chem-tex-cta-section">
    <div class="container">
      <div class="chem-tex-cta-card">
        <h2 class="chem-tex-cta-title">Procure ${esc(prod.name)} for Your Mill</h2>
        <p class="chem-tex-cta-desc">
          Contact Om Sai Enterprise to inquire on commercial availability, packaging formats, and delivery timelines.
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
  console.log(`✓ Generated ${catSlug}/${prodSlug}/index.html`);
});

// Generate Category Index pages
const coreCategories = [
  { slug: 'pretreatment-chemicals', catId: 'CAT-B', title: 'Textile Pretreatment Chemicals', desc: 'Specialized chemical auxiliaries for textile desizing, scouring, wetting, and metal ion sequestration.' },
  { slug: 'dyeing-auxiliaries', catId: 'CAT-D', title: 'Textile Dyeing Auxiliaries', desc: 'Levelling agents, dispersing agents, acid buffers, and dye-fixing auxiliaries for uniform coloration.' },
  { slug: 'printing-chemicals', catId: 'CAT-F', title: 'Textile Printing Chemicals', desc: 'Thickeners, binders, crosslinkers, and modifiers for screen, rotary, and pigment textile printing.' },
  { slug: 'after-treatment', catId: 'CAT-G', title: 'After-treatment & Washing Chemicals', desc: 'Soaping agents, reduction clearing auxiliaries, and dye-fixing agents for superior wet fastness.' },
  { slug: 'finishing-chemicals', catId: 'CAT-I', title: 'Softening & Finishing Chemicals', desc: 'Cationic flakes, micro-silicones, and finishing resins imparting signature tactile handle.' }
];

coreCategories.forEach(cat => {
  const catDir = path.join(baseDir, cat.slug);
  fs.mkdirSync(catDir, { recursive: true });

  const catProducts = approvedProducts.filter(p => p.categoryId === cat.catId);
  const canonicalUrl = `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/${cat.slug}/`;

  const catHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(cat.title)} | Om Sai Enterprise</title>
  <meta name="description" content="${esc(cat.desc)}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <link rel="icon" type="image/svg+xml" href="../../../assets/icons/favicon.svg" />
  <link rel="stylesheet" href="../../../css/style.css" />
  <link rel="stylesheet" href="../../../css/chemicals.css" />
  <link rel="stylesheet" href="../../../css/chemicals-textile.css" />
  <link rel="stylesheet" href="../../../css/responsive.css" />
</head>
<body class="theme-chem page-chem-textile">
  <header class="site-header">
    <div class="container">
      <a href="../index.html" class="logo-item" title="Om Sai Enterprise">
        <div class="logo-container-dark">
          <img src="../../../assets/logos/om-sai-enterprise.jpeg" alt="Om Sai Enterprise Logo" class="logo-img" />
        </div>
      </a>
      <nav class="main-nav" aria-label="Chemicals Navigation">
        <a href="../index.html" class="nav-link">Home</a>
        <a href="../about.html" class="nav-link">About Us</a>
        <a href="../products.html" class="nav-link">Products</a>
        <a href="../textile-chemicals.html" class="nav-link active">Textile Chemicals</a>
        <a href="../industrial-chemicals.html" class="nav-link">Industrial Chemicals</a>
        <a href="../contact.html" class="nav-link">Contact Us</a>
        <div class="mobile-cta-item">
          <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-block">Enquire on IndiaMART</a>
        </div>
      </nav>
      <div class="header-actions">
        <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm">Enquire on IndiaMART</a>
      </div>
    </div>
  </header>

  <nav class="chem-tex-breadcrumb" aria-label="Breadcrumb">
    <div class="container">
      <ol class="chem-tex-breadcrumb-list">
        <li class="chem-tex-breadcrumb-item"><a href="../../../index.html">Home</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../index.html">Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item"><a href="../textile-chemicals.html">Textile Chemicals</a></li>
        <li class="chem-tex-breadcrumb-sep">/</li>
        <li class="chem-tex-breadcrumb-item active">${esc(cat.title)}</li>
      </ol>
    </div>
  </nav>

  <section class="section">
    <div class="container">
      <div style="max-width: 760px; margin-bottom: 40px;">
        <span class="chem-tex-kicker">CATEGORY PORTFOLIO</span>
        <h1 style="font-size: 2.4rem; font-weight: 800; color: var(--chem-primary, #0754B5); margin-bottom: 14px;">
          ${esc(cat.title)}
        </h1>
        <p style="font-size: 1.05rem; color: #4A5B6D; line-height: 1.65;">
          ${esc(cat.desc)}
        </p>
      </div>

      <div class="chem-tex-categories-grid">
        ${catProducts.map(p => `
          <article class="chem-tex-category-card">
            <h3 class="chem-tex-cat-title">${esc(p.name)}</h3>
            <p class="chem-tex-cat-desc">${esc(p.shortDescription)}</p>
            <div class="chem-tex-cat-action">
              <a href="${p.slug}/index.html" class="btn btn-primary btn-sm">Product Details &rarr;</a>
              <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm">Enquire</a>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-bottom">
        <div>&copy; 2026 Om Sai Enterprise. Chemicals Specialist Division. All rights reserved.</div>
      </div>
    </div>
  </footer>
  <script src="../../../js/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(catDir, 'index.html'), catHtml, 'utf8');
  console.log(`✓ Generated category index ${cat.slug}/index.html`);
});

console.log('✓ All textile static product and category pages generated successfully.');
