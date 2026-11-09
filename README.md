# Baburam Trading & Om Sai Enterprise – Corporate Static Website

A premium, professional, responsive corporate static website representing two independent commercial businesses through a unified corporate entry portal:

1. **Baburam Trading**: FMCG Distribution
2. **Om Sai Enterprise** *(Tagline: Chemicals Specialist)*: Textile Chemical Trading and Industrial Chemical Trading

---

## 1. Business Architecture

- **Main Homepage (`/`)**: Equal presentation of both businesses with distinct entry cards, shared operating values, and fast trade inquiry routing.
- **Baburam Trading (`/fmcg/`)**: Full independent FMCG website featuring original logo, dedicated `#123D8C` and `#008C43` color identity, brands showcase, products catalogue, distribution network, and partner inquiry desk.
- **Om Sai Enterprise (`/chemicals/`)**: Full independent Chemicals Trading website featuring original logo, dedicated `#0754B5` and `#087F38` color identity, textile chemistry, industrial chemicals, industries served, and RFQ / TDS request desk.

---

## 2. Technology & Deployment Compliance

Built strictly with:
- **HTML5**: Semantic tags, accessible forms, meta tags, and Open Graph cards.
- **CSS3**: Modular design system, CSS custom properties, responsive grid and flexbox layouts.
- **Vanilla JavaScript**: Zero framework runtime overhead, fast loading, responsive drawers, modal dialogs.
- **JSON**: Structured product data catalogs and central company contact configuration.

### Ready for Static Hosting
Deployable directly without any server build step to:
- **Cloudflare Pages**: Set build command to empty or `npm run build` with output directory `dist`.
- **Netlify**: Publish directory `.` (or `dist` if using Vite build).
- **GitHub Pages**: Publish from root or `/dist`.
- **Standard Apache/Nginx Web Server**: Drop files directly into webroot.

---

## 3. Directory Structure

```
├── index.html                   # Main Corporate Portal Homepage
├── 404.html                     # Custom 404 Error Handler Page
├── privacy-policy.html          # Corporate Privacy Policy
├── terms.html                   # Commercial Terms & Conditions
│
├── fmcg/                        # Baburam Trading (FMCG Distribution)
│   ├── index.html               # FMCG Home
│   ├── about.html               # About FMCG Division
│   ├── brands.html              # FMCG Partner Brands
│   ├── products.html            # FMCG Product Catalogue
│   ├── product-details.html     # FMCG Item Specification & Inquiry
│   └── contact.html             # FMCG Distribution Network & Contact
│
├── chemicals/                   # Om Sai Enterprise (Chemicals Specialist)
│   ├── index.html               # Chemicals Home
│   ├── about.html               # About Chemicals Division
│   ├── products.html            # All Chemical Formulations Catalogue
│   ├── textile-chemicals.html   # Textile Chemicals Category Showcase
│   ├── industrial-chemicals.html# Industrial Chemicals Category Showcase
│   ├── product-details.html     # Chemical Specification & TDS Request
│   └── contact.html             # Industries Served & RFQ / Contact Desk
│
├── assets/
│   ├── logos/                   # Original Baburam Trading and Om Sai Enterprise logos
│   │   ├── baburam-trading.png
│   │   └── om-sai-enterprise.jpeg
│   └── images/                  # High-resolution optimized photography
│       ├── corporate/hero.jpg
│       ├── fmcg/warehouse.jpg
│       ├── fmcg/products.jpg
│       ├── chemicals/facility.jpg
│       └── chemicals/textile.jpg
│
├── css/
│   ├── style.css                # Global corporate design system & modal engine
│   ├── fmcg.css                 # Baburam Trading FMCG color palette & components
│   ├── chemicals.css            # Om Sai Enterprise color palette & components
│   └── responsive.css           # Breakpoints (Mobile, Tablet, Laptop, Desktop)
│
├── js/
│   ├── main.js                  # Mobile navigation, config loader, active link handling
│   ├── products.js              # Product catalog search, category filtering & detail renderer
│   ├── enquiry.js               # Static WhatsApp click-to-chat & mailto prefill engine
│   ├── fmcg.js                  # FMCG partner form handlers
│   └── chemicals.js             # Chemical RFQ form handlers
│
├── data/
│   ├── company-config.json      # Central business contact & phone numbers
│   ├── fmcg-products.json       # FMCG products database
│   └── chemical-products.json   # Textile & industrial chemicals database
│
└── public/
    ├── robots.txt               # SEO Crawling rules
    └── sitemap.xml              # XML Sitemap for search engines
```

---

## 4. How to Update Contact Numbers & Business Details

All contact information is centralized in **`data/company-config.json`**.

When verified details are ready to be published:
1. Open `data/company-config.json`.
2. Set `"isConfigured": true` for the division.
3. Add verified `whatsappNumber` (e.g. `919876543210`), `email`, `phone`, and `address`.
4. When `isConfigured` is `false`, the website safely shows a professional "contact unavailable" advisory without publishing any unverified information or broken fallback numbers.

---

## 5. Textile Chemicals Discovery Architecture

Om Sai Enterprise features an automated, static-site-generated Textile Chemicals catalog engineered as a single source of truth:

- **Central Master Dataset**: `data/textile-products.json` (140 structured products)
- **Central Taxonomy**: `data/textile-chemical-categories.json` (13 wet processing categories CAT-A to CAT-M)
- **Legacy URL Map**: `data/legacy-urls.json` (14 canonical redirect rules)

### Build & Generation Scripts
```bash
# 1. Compile master candidate records into canonical dataset
node scripts/build-master-textile-data.mjs

# 2. Audit and validate schema, references, related IDs, and legacy redirects
node scripts/validate-textile-data.mjs

# 3. Generate legacy 301 static refresh pages & public/_redirects
node scripts/generate-legacy-redirects.mjs

# 4. Generate 13 category landing pages (/chemicals/textile-chemicals/{category}/)
node scripts/generate-textile-category-pages.mjs

# 5. Generate 140 individual product pages (/chemicals/textile-chemicals/{category}/{product}/)
node scripts/generate-textile-product-pages.mjs

# 6. Generate search-engine compliant XML sitemap with real file modification dates
node scripts/generate-textile-sitemap.mjs

# Complete one-command build:
npm run build
```

---

## 6. Commercial Data & Honesty Policy

In strict accordance with B2B industrial trading principles:
- **No Fabricated Pricing**: Chemical pricing fluctuates with raw material indices (petrochemical feeds, caustic, ethylene oxide, silicones) and volume brackets. All prices are explicitly stated as "Quotation on Request" (`price: null`).
- **No Fake Stock / Inventory**: Stock levels are not fabricated with counters. Sourcing lead times and spot availability are confirmed through active commercial desks.
- **Traceable Literature & Safety**: Technical overviews cite published textile chemistry literature (e.g. Shore, Trotman, Peters, Karmakar). Technical Data Sheets (TDS) and Safety Data Sheets (SDS) are provided upon verified commercial request.
- **Verified Trade Profile**: Direct integration with verified IndiaMART enterprise profile: `https://www.indiamart.com/om-saienterprise-surat/`.

---

## 7. Static Trade Enquiry & RFQ Workflow

Because this is a pure static website with no backend database dependency:
- Clicking **"Enquire"**, **"Request Quotation"**, or **"Contact for Details"** on any product opens an accessible modal or redirects to the verified IndiaMART sourcing desk.
- Contact inquiries generate structured client-side drafts for WhatsApp or Email.
- Zero customer or enquiry data is stored on server databases, ensuring complete client privacy.

---

## 8. Local Development & Deployment

Run local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

Typecheck & Lint:
```bash
npm run lint
```

Full Production Build:
```bash
npm run build
```
Output files will be generated into the `dist/` folder ready for GitHub Pages, Cloudflare Pages, or Netlify.

