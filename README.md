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

To update the WhatsApp numbers, phone numbers, or corporate email:
1. Open `data/company-config.json`.
2. Edit `whatsappNumber` (e.g. `919876543210`), `email`, or `phone`.
3. All WhatsApp click-to-chat buttons and mailto links across all pages will immediately use the updated information!

---

## 5. How to Add or Edit Products

Product information is decoupled from HTML in structured JSON:
- FMCG products: `data/fmcg-products.json`
- Chemicals: `data/chemical-products.json`

Example product record:
```json
{
  "id": "CHEM-010",
  "name": "Non-Ionic Wetting Agent",
  "category": "Textile Chemicals",
  "subCategory": "Pre-Treatment",
  "image": "assets/images/chemicals/textile.jpg",
  "shortDescription": "Rapid penetration wetting agent for high-speed continuous scouring ranges.",
  "application": "Cotton and polyester knit preparation baths.",
  "packaging": "50 kg HDPE carboys",
  "documentation": "TDS and SDS available upon verified business enquiry",
  "status": "active"
}
```
Setting `"status": "inactive"` will automatically hide the item from the live catalogue without needing code modifications.

---

## 6. Static Trade Enquiry Workflow

Because this is a pure static website with no backend database dependency:
- Clicking **"Contact"** or **"Contact for Details"** on any product automatically detects the active division, product code, and product title.
- The user enters their contact person name, company name, phone, and specific volume requirement.
- The visitor can select:
  - **WhatsApp**: Generates an instant `https://wa.me/{number}?text={encoded}` prefilled message ready to send with one click.
  - **Email**: Generates an official prefilled `mailto:` draft with structured trade inquiry fields.
- Zero customer data is silently stored in browser `localStorage`, ensuring complete commercial privacy.

---

## 7. Local Development

Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

Build for static production:
```bash
npm run build
```
Output files will be generated into the `dist/` folder.
