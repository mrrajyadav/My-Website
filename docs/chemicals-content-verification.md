# Om Sai Enterprise – Content Verification & Unverified Claims Audit

This document compiles all operational, technical, chemical grade, packaging, logistics, and compliance claims across the **Om Sai Enterprise – Chemicals Specialist** website that require confirmation, verification, or customization by the business owner prior to full commercial deployment.

---

## 1. Product Availability & Stock Holding Claims

### Item 1.1: Product Catalogue Emptiness / Current Stock Availability
- **1. Current website statement:**  
  *"Product catalogue is currently being updated. Please contact Om Sai Enterprise for product availability."*  
  *(Condition A empty state displayed on `chemicals/products.html`, `chemicals/textile-chemicals.html`, `chemicals/industrial-chemicals.html`, and `chemicals/index.html` when `data/chemical-products.json` is empty).*
- **2. Why verification is required:**  
  Per project specifications, no fictional or assumed chemical products should be displayed. The JSON catalogue is currently kept empty (`[]`) until authentic, verified products are supplied.
- **3. Information needed from the business owner:**  
  - List of active commercial products sold by Om Sai Enterprise.
  - Correct product names, categories (*Textile Chemicals* vs *Industrial Chemicals*), concise 1-2 sentence descriptions, and authentic product photography (or permission to continue using the neutral vector silhouette placeholder `chemical-placeholder.svg`).
- **4. Page(s) where the statement appears:**  
  `chemicals/products.html`, `chemicals/textile-chemicals.html`, `chemicals/industrial-chemicals.html`, `chemicals/index.html`.

---

## 2. Chemical Grades, Purity & Concentrations

### Item 2.1: Specification of Basic Inorganics (Caustic Soda, Acetic Acid, Hydrogen Peroxide)
- **1. Current website statement:**  
  *"Procuring and supplying industrial caustic soda flakes, acetic acid, hydrogen peroxide, and process additives."*
- **2. Why verification is required:**  
  Industrial chemicals are traded in strictly defined commercial grades and concentrations (e.g., Caustic Soda Flakes 99.5% vs Lye 48%; Acetic Acid Glacial 99.85% vs Technical; Hydrogen Peroxide 35% vs 50%). Trading inaccurate concentration specifications can lead to severe operational issues for processing mills.
- **3. Information needed from the business owner:**  
  - Specific concentration percentages and standard grades stocked/traded (e.g., Technical Grade, Commercial Grade, CP/AR Grade).
  - Manufacturer origin or brands distributed (if applicable, e.g., GACL, Grasim, DCW, Meghmani, or imported origins).
- **4. Page(s) where the statement appears:**  
  `chemicals/index.html` (Business Overview section), `chemicals/industrial-chemicals.html`.

### Item 2.2: Application Matching & Sizing Reagents
- **1. Current website statement:**  
  *"Helping textile processors and industrial manufacturing clients identify the appropriate chemical grades for their processes."*
- **2. Why verification is required:**  
  Textile sizing, scouring, and wet processing have specific ionic compatibility requirements (anionic, non-ionic, cationic). Stating that application matching is provided implies technical advisory capabilities.
- **3. Information needed from the business owner:**  
  - Scope of technical advisory provided (whether direct formulation support is provided or if clients are directed to manufacturer technical data sheets).
- **4. Page(s) where the statement appears:**  
  `chemicals/about.html` (Operational Standards).

---

## 3. Packaging & Container Specifications

### Item 3.1: Container Handling (Carboys, Drums, Bulk Delivery)
- **1. Current website statement:**  
  *"Careful coordination of standard carboy, drum, and bulk container handling for industrial deliveries."*  
  *"Full Technical Data Sheets (TDS), Safety Data Sheets (SDS), packaging options (carboys, drums, bulk), and commercial price quotations are provided upon direct business enquiry."*
- **2. Why verification is required:**  
  Chemical logistics involves hazardous goods regulation, returnable packaging policies (deposit on carboys/drums), and specific minimum order quantities (MOQs).
- **3. Information needed from the business owner:**  
  - Available standard packaging sizes (e.g., 35 kg carboys, 50 kg HM-HDPE carboys, 200 kg HDPE drums, 220 kg composite drums, 1,000 L IBC totes, bulk road tankers).
  - Minimum Order Quantities (MOQs) per product line.
- **4. Page(s) where the statement appears:**  
  `chemicals/about.html`, `chemicals/product-details.html`, `chemicals/index.html`.

---

## 4. Logistics, Delivery Timelines & Geographic Coverage

### Item 4.1: Delivery Service Area & Turnaround
- **1. Current website statement:**  
  *"Prompt dispatch coordination and consistent supply schedules for manufacturing continuity."*
- **2. Why verification is required:**  
  Industrial manufacturers require guaranteed delivery timelines and need to know the dispatch hub / geographic reach (e.g., local state / industrial belts vs nationwide distribution).
- **3. Information needed from the business owner:**  
  - Physical warehouse locations and dispatch centers (e.g., Surat, Ahmedabad, Mumbai, Tirupur, etc.).
  - Standard dispatch turnaround times (e.g., ex-stock 24-48 hours, indent delivery 7-10 days).
  - Geographic territory covered (local industrial clusters, state-wide, or pan-India).
- **4. Page(s) where the statement appears:**  
  `chemicals/index.html` (Why Choose Us), `chemicals/about.html`.

---

## 5. Regulatory Compliance & Quality Certifications

### Item 5.1: Manufacturer Compliance Standards (ISO, REACH, GOTS, ZDHC, OEKO-TEX)
- **1. Current website statement:**  
  *"Technical Documentation: Technical Data Sheets (TDS) and Safety Data Sheets (SDS) provided on verified commercial trade inquiry."*  
  *(Note: All direct claims of Om Sai Enterprise holding owned ISO/GOTS/ZDHC laboratory certifications were deliberately removed from the code to prevent misrepresentation; the site now accurately specifies that documentation is sourced from the primary chemical manufacturers).*
- **2. Why verification is required:**  
  In chemical trading, certifications are held either by the primary chemical manufacturer or by the trader itself. Misrepresenting manufacturer certifications as trader accreditations violates trade regulations.
- **3. Information needed from the business owner:**  
  - Which specific certifications are held directly by Om Sai Enterprise (e.g., GST registration, MSME, ISO 9001:2015 if applicable).
  - Which certifications are provided via partner manufacturers (e.g., ZDHC Gateway level 3 conformance, GOTS 6.0 approval letters, OEKO-TEX Eco Passport, REACH compliance).
- **4. Page(s) where the statement appears:**  
  `chemicals/about.html`, `chemicals/products.html`, `chemicals/product-details.html`.

---

## 6. Technical Support & Laboratory Claims

### Item 6.1: Technical Data Sheets (TDS) & Testing
- **1. Current website statement:**  
  *"Facilitating manufacturer Technical Data Sheets (TDS) and Safety Data Sheets (SDS) upon verified trade enquiry."*
- **2. Why verification is required:**  
  The site maintains strict honesty by indicating that TDS/SDS documents are facilitated from primary manufacturers rather than claiming an owned in-house laboratory.
- **3. Information needed from the business owner:**  
  - Confirmation whether Om Sai Enterprise maintains an on-site sample lab for basic testing (pH, density, solids content, viscosity) or acts purely as a trading & distribution partner relaying manufacturer COAs (Certificate of Analysis).
  - TDS & SDS document files to be made available for download or email attachment upon RFQ requests.
- **4. Page(s) where the statement appears:**  
  `chemicals/about.html`, `chemicals/index.html`, `chemicals/product-details.html`, `chemicals/contact.html`.

---

## 7. Business Contact Information & Identity

### Item 7.1: Contact Numbers, Email & Physical Facility Address
- **1. Current website statement:**  
  *Currently hidden or displaying configured status via `data/company-config.json` (`isConfigured: false`).*
- **2. Why verification is required:**  
  The interactive WhatsApp RFQ, Email enquiry generator, and Contact page require authentic phone numbers, email addresses, and warehouse / sales office locations to route inquiries directly to Om Sai Enterprise executives.
- **3. Information needed from the business owner:**  
  - Primary WhatsApp contact number (with country code, e.g., `+91 98765 43210`).
  - Official sales enquiry email address (e.g., `sales@omsaienterprise.com`).
  - Registered business office address & warehouse / storage depot address.
  - Operating days and working hours.
- **4. Page(s) where the statement appears:**  
  `chemicals/contact.html`, `chemicals/index.html` (footer & contact section), `data/company-config.json`.
