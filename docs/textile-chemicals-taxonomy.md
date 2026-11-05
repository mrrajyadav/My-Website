# Textile Chemicals Category Taxonomy & System Architecture

**Business:** Om Sai Enterprise — Chemicals Specialist (Surat, Gujarat)  
**Division:** Textile Chemical Trading & Sourcing  
**Scope:** Wet Processing Auxiliaries, Colorants, and Functional Finishes  
**Last Updated:** November 2026

---

## 1. Executive Summary & Objective

This document establishes the comprehensive taxonomy for textile wet processing chemistry used across the Om Sai Enterprise platform. The architecture separates educational market taxonomy, candidate product discovery, and commercial trading operations.

Om Sai Enterprise operates as an independent commercial trading specialist and sourcing desk. It sources formulations from verified chemical manufacturers to supply textile mills, processing houses, dyeing units, and printing plants across India.

---

## 2. Processing Stage Taxonomy (8 Stages)

1. **Fibre / Yarn Preparation & Sizing (Stage 1)**
   - *Functions:* Boundary lubrication, antistatic control, film-forming cohesion for warp protection.
   - *Key Chemistries:* Spin finishes, knitting oils, polyvinyl alcohol (PVA), modified starches, acrylic size binders.
2. **Pretreatment & Preparation (Stage 2)**
   - *Functions:* Wax saponification, seed-coat degradation, rapid desizing, interfacial tension reduction, mineral chelation.
   - *Key Chemistries:* Fatty alcohol ethoxylates, alpha-amylases, pectinases, phosphonates, caustic soda.
3. **Bleaching & Whiteness (Stage 3)**
   - *Functions:* Controlled oxidative destruction of natural yellow carotenoid pigments; removal of residual peroxide.
   - *Key Chemistries:* Hydrogen peroxide (35%/50%), non-silicate organic stabilizers, catalase enzymes.
4. **Dyeing & Coloration (Stage 4)**
   - *Functions:* Rate-of-exhaustion control, high-temperature dye dispersion, bath buffering, jet shear defoaming.
   - *Key Chemistries:* Fatty amine ethoxylates, sodium naphthalene sulfonates, phosphate buffers, silicone defoamers.
5. **Textile Printing (Stage 5)**
   - *Functions:* High-shear pseudoplastic viscosity, film formation, mechanical crosslinking, screen release.
   - *Key Chemistries:* Sodium alginate, polyacrylic inverse emulsions, self-crosslinking acrylic binders, melamines.
6. **After-treatment & Washing (Stage 6)**
   - *Functions:* Removal of hydrolysed dye without bath redeposition; molecular locking of dye anions.
   - *Key Chemistries:* Polymeric soaping dispersants, poly-DADMAC fixatives, sodium hydrosulfite.
7. **Softening & Finishing (Stage 7)**
   - *Functions:* Tactile surface lubrication, drape, bulk softness, elastomeric bounce, hydrophilic absorbency.
   - *Key Chemistries:* Dialkyl quaternary ammonium salts, amino-silicone micro-emulsions, hydrophilic organosilicones.
8. **Garment Washing & Denim Specialty (Stage 8)**
   - *Functions:* Controlled bio-polishing, high-contrast pocket white preservation, enzymatic denim defibrillation.
   - *Key Chemistries:* Neutral/acid Trichoderma cellulases, acrylic-maleic anti-back-staining copolymers.

---

## 3. Product Category Architecture (Categories A to M)

- **Category A:** Fibre, Yarn, Spinning & Sizing Chemicals
- **Category B:** Textile Pretreatment Chemicals
- **Category C:** Textile Bleaching Chemicals
- **Category D:** Textile Dyeing Auxiliaries
- **Category E:** Textile Dyes & Colourants (Strictly separated from auxiliaries)
- **Category F:** Textile Printing Chemicals
- **Category G:** After-treatment & Washing Chemicals
- **Category H:** Optical Brighteners & Fluorescent Whitening Agents
- **Category I:** Textile Softening & Finishing Chemicals
- **Category J:** Functional & Specialty Finishes (Water repellents, antistats, yellowing inhibitors)
- **Category K:** Garment Washing & Denim Auxiliaries
- **Category L:** Textile Coating, Lamination & Technical Auxiliaries
- **Category M:** Textile Water & Effluent Treatment Chemicals (ETP)

---

## 4. Multi-Faceted Product Classification Model

Each product candidate in `data/textile-product-candidates.json` conforms to the following schema:
- `id`: Strict unique identifier (`CHEM-TEX-001` through `CHEM-TEX-140`)
- `name`: Technical generic trade name
- `category`: Primary taxonomy group
- `categoryId`: Standardized code (`CAT-A` through `CAT-M`)
- `processingStage`: Associated wet processing step
- `productFunction`: Primary technical objective (Wetting, Scouring, Levelling, etc.)
- `fibreType`: Compatible substrate group (Cotton, PES, PA, Wool, Blends)
- `fabricApplication`: Sector suitability (Woven, Knit, Denim, Technical)
- `status`: Lifecycle approval flag (`active` for commercial core items, `review` for candidates)

---

## 5. Commercial Sourcing Channel & Boundaries

- All commercial trade enquiries are routed directly through the official business profile:  
  **IndiaMART:** `https://www.indiamart.com/om-saienterprise-surat/`
- Om Sai Enterprise does not claim proprietary factory manufacturing or testing laboratories. All Technical Data Sheets (TDS) and Safety Data Sheets (SDS) are provided directly by original chemical manufacturers.
