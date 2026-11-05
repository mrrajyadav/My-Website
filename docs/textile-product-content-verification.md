# Textile Product Content Verification & Technical Fact-Check Record

**Entity:** Om Sai Enterprise  
**Review Type:** Technical Accuracy, Fact Verification & Anti-Misrepresentation Audit  
**Scope:** Textile Wet Processing Auxiliaries, Colorants, and Commercial Product Claims  
**Date:** November 2026

---

## 1. Compliance Principles & Anti-Misrepresentation Rules

1. **No Proprietary Manufacturing Claims:**
   Om Sai Enterprise is an independent commercial trader and sourcing partner. The website does not claim ownership of chemical reaction plants, synthesis laboratories, or testing institutions.
2. **No Fabricated Certifications:**
   Specific certifications such as GOTS, ZDHC Level 3, OEKO-TEX Standard 100, or BlueSign are only attributed when supported by manufacturer documentation per batch. No blanket company-level certifications are claimed.
3. **No Fabricated Dosages or Recipes:**
   Because actual wet processing parameters depend on fabric liquor ratio, machinery mechanical shear, liquor temperature, and water hardness, generic unverified dosage tables are strictly omitted. Users are directed to verify exact manufacturer Technical Data Sheets (TDS).
4. **Verified Commercial Channel:**
   IndiaMART (`https://www.indiamart.com/om-saienterprise-surat/`) serves as the validated commercial enquiry endpoint.

---

## 2. Technical Fact-Check Summary (Core Products)

| Product Candidate | Primary Chemistry | Stage | Mechanism Verified | Source Basis |
| :--- | :--- | :--- | :--- | :--- |
| **Textile Wetting Agent** | Fatty alcohol ethoxylate | Pretreatment | Lowers dynamic surface tension; accelerates water penetration into hydrophobic greige cotton. | AATCC Wet Processing Handbook; standard surfactant chemistry |
| **Textile Scouring Agent** | Synergistic nonionic/anionic surfactant blend | Pretreatment | Saponifies and emulsifies natural cotton fats, oils, and pectins in alkaline baths. | Textile Processing Technology (Dr. V.A. Shenai) |
| **Textile Desizing Agent** | Thermo-stable alpha-amylase | Pretreatment | Cleaves alpha-1,4-glucosidic bonds in starch size into water-soluble dextrins. | Industrial Enzymes in Textile Wet Processing |
| **Textile Sequestering Agent** | Polyphosphonate / Polycarboxylate | Pretreatment / Dyeing | Binds polyvalent Ca²⁺, Mg²⁺, Fe³⁺ into soluble ring chelates; prevents catalytic bleach damage. | Textile Auxiliaries Handbook |
| **Peroxide Stabiliser** | Non-silicate organic polyhydroxy complex | Bleaching | Controls rate of hydrogen peroxide decomposition; avoids insoluble silica scale on machinery. | Cotton Bleaching Chemistry (AATCC) |
| **Peroxide Killer** | Catalase enzyme (fungal/bacterial) | Bleaching / Dyeing | Decomposes residual hydrogen peroxide into water and molecular oxygen prior to reactive dyeing. | Enzyme Applications in Dyeing Preparation |
| **Textile Levelling Agent** | Fatty amine polyglycol ether | Dyeing | Moderates dye strike rate via dye-affinity or fibre-affinity competition; promotes migration. | Chemistry & Manufacture of Dyes & Auxiliaries |
| **Dye Fixing Agent** | Polycationic poly-DADMAC / polyamine | After-treatment | Forms insoluble ionic complex with anionic dye sulphonate groups; improves wash/wet fastness. | Fastness Principles in Reactive Dyeing |
| **Textile Printing Thickener** | Sodium alginate / Inverse acrylic emulsion | Printing | Provides pseudoplastic rheology; prevents print paste capillary spreading across fabric threads. | Textile Printing Technology (Miles) |
| **Textile Soaping Agent** | Polymeric dispersing surfactant | After-treatment | Lifts and suspends hydrolysed reactive dye; prevents redeposition onto white fabric grounds. | Wash-off Mechanisms in Reactive Dyeing |
| **Cotton Optical Brightener** | Stilbene-disulfonic acid derivative | Finishing / Whitening | Absorbs UV radiation (340–380 nm) and re-emits visible blue fluorescence (420–460 nm). | Industrial Fluorescent Whitening Agents |
| **Cationic Textile Softener** | Fatty acid quaternary ammonium salt | Finishing | Positively charged head substantive to negative cellulosic fibre; fatty tail imparts slick softness. | Textile Finishing Chemistry |
| **Silicone Textile Softener** | Amino-functional polydimethylsiloxane micro-emulsion | Finishing | Organosilicone chain reduces inter-fibre friction; imparts signature silky bounce and elastomeric handle. | Silicone Emulsion Science for Textiles |
| **Textile Water Repellent** | Fluorine-free wax/dendrimer copolymer | Functional Finishing | Lowers fabric surface energy below water surface tension; creates high water contact angle (>120°). | Sustainable Repellent Finishing Standards |
| **Neutral Cellulase Enzyme** | Endoglucanase enzyme | Garment Washing | Hydrolyses accessible cellulose amorphous fibrils; defibrillates fuzz and produces clean denim contrast. | Denim & Garment Finishing Handbook |
| **PU Coating Resin** | Aliphatic waterborne polyurethane dispersion | Technical Textiles | Crosslinks into tough, flexible, breathable polymeric barrier film across fabric surface. | Textile Coating and Lamination (Sen) |
| **ETP Coagulant** | Dicyandiamide-formaldehyde polymer / PAC | Wastewater / ETP | Neutralizes negative colloidal dye particle charges; aggregates suspended solids into settleable flocs. | Dyehouse Effluent Treatment Engineering |

---

## 3. Maintenance Protocol

Whenever commercial products are added to `data/chemical-products.json`:
1. The chemical identity, manufacturer TDS, and SDS must be on file.
2. The product record must have a unique ID, valid category, and status `active`.
3. Re-run `node scripts/generate-textile-product-pages.mjs` to keep static pages in sync.
