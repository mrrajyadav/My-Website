# OM SAI ENTERPRISE — TEXTILE CHEMICALS TECHNICAL SEO ARCHITECTURE

## 1. URL Architecture & Static Site Hierarchy
The textile chemicals section employs a clean, deterministic 4-level URL hierarchy designed for maximum search engine crawl efficiency, indexing, and topical authority:

```
https://mrrajyadav.github.io/My-Website/
└── chemicals/
    ├── textile-chemicals.html (Main Section Discovery Hub)
    └── textile-chemicals/
        ├── <category-slug>/
        │   ├── index.html (Category Landing Page - 13 Total)
        │   └── <product-slug>/
        │       └── index.html (Static HTML Product Page - 140 Total)
```

---

## 2. Meta Tags & Canonical Protocols
Every generated page features strict technical SEO meta tags:
- **Canonical URL**: Self-referencing absolute URL with trailing slash (e.g. `https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/pretreatment-chemicals/non-ionic-wetting-agent/`).
- **Page Title**: `[Product Name] | Textile Chemical Sourcing | Om Sai Enterprise Surat`
- **Meta Description**: `[Product Name] ([Chemical Family]) for [Process Stages] in textile wet processing. Sourced by Om Sai Enterprise, Surat for mills, dyeing houses, and printing units.`
- **Social OpenGraph & Twitter Cards**:
  - `og:type`: `product`
  - `og:title`: `[Product Name] | Textile Chemical Sourcing | Om Sai Enterprise`
  - `og:description`: Curated concise product description
  - `og:url`: Absolute canonical link
  - `og:image`: Verified company brand logo
  - `twitter:card`: `summary_large_image`

---

## 3. Structured Data JSON-LD Schemas

### Product Schema (`@type: "Product"`)
Embedded on each of the 140 product pages:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Non-Ionic Wetting Agent",
  "description": "High-efficiency non-ionic wetting and scouring auxiliary for textile preparation...",
  "category": "Textile Pretreatment Chemicals",
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
    "url": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/pretreatment-chemicals/non-ionic-wetting-agent/",
    "seller": {
      "@type": "Organization",
      "name": "Om Sai Enterprise",
      "url": "https://mrrajyadav.github.io/My-Website/"
    }
  }
}
```

### BreadcrumbList Schema (`@type: "BreadcrumbList"`)
Embedded on each category and product page to enable rich snippet breadcrumb trails in Google Search results:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://mrrajyadav.github.io/My-Website/" },
    { "@type": "ListItem", "position": 2, "name": "Chemicals", "item": "https://mrrajyadav.github.io/My-Website/chemicals/" },
    { "@type": "ListItem", "position": 3, "name": "Textile Chemicals", "item": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals.html" },
    { "@type": "ListItem", "position": 4, "name": "Textile Pretreatment Chemicals", "item": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/pretreatment-chemicals/" },
    { "@type": "ListItem", "position": 5, "name": "Non-Ionic Wetting Agent", "item": "https://mrrajyadav.github.io/My-Website/chemicals/textile-chemicals/pretreatment-chemicals/non-ionic-wetting-agent/" }
  ]
}
```

---

## 4. XML Sitemap Integration
The build system automatically updates `public/sitemap.xml` via `scripts/generate-textile-sitemap.mjs`:
- Total Indexed URLs: **167**
  - Core Brand Pages: 14 URLs (Priority: 0.70 – 1.00)
  - Category Landing Pages: 13 URLs (Priority: 0.85, Changefreq: weekly)
  - Individual Product Pages: 140 URLs (Priority: 0.80, Changefreq: weekly)
- Lastmod: Automatically timestamped to ISO-8601 YYYY-MM-DD on each build.
- Validated against sitemaps.org 0.9 schema.
