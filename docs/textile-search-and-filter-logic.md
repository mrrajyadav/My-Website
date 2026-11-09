# OM SAI ENTERPRISE — TEXTILE SEARCH & FILTERING LOGIC SPECIFICATION

## 1. Overview
The search and filtering system on the Textile Chemicals platform enables instantaneous client-side product discovery across all 140 commercial products without requiring external server dependencies.

Implemented in `js/textile-filters.js` and loaded on `chemicals/textile-chemicals.html`.

---

## 2. Search Index Architecture
Each product record in `data/textile-products.json` contains structured fields that feed into the search engine:
- `name`: Full commercial and chemical name (Primary match weight: 1.0)
- `id`: Unique product catalog ID, e.g. `PROD-TEX-011` (Weight: 1.0)
- `chemicalFamily`: Primary chemical class, e.g. `Fatty Alcohol Ethoxylate` (Weight: 0.8)
- `synonyms`: Common industrial aliases, Hindi/Gujarati market terms, e.g. `scouring oil`, `wetting agent 100%`, `alginate thickener` (Weight: 0.9)
- `searchKeywords`: Trade terms, acronyms, and mill terminology (Weight: 0.8)
- `functions`: Standardized functional roles, e.g. `Wetting & Penetration`, `Sequestering` (Weight: 0.7)
- `processStages`: Processing lifecycle stages, e.g. `Pretreatment & Scouring` (Weight: 0.6)
- `applicableFibres`: Compatible fibre types, e.g. `Cotton`, `Polyester`, `Nylon` (Weight: 0.6)
- `fabricApplications`: Fabric types, e.g. `Woven`, `Knitted`, `Denim`, `Terry Towel` (Weight: 0.5)

---

## 3. Live Autocomplete Suggestion Dropdown
- **Trigger**: Activates upon entering 2 or more characters into either `#heroTextileSearchInput` or `#textileSearchInput`.
- **Display**: Up to 6 instantaneous autocomplete suggestions displayed in an absolute-positioned floating dropdown.
- **Card Contents**:
  - Highlighted Product Name
  - Category Code & Category Name (`CAT-B • Textile Pretreatment Chemicals`)
  - Chemical Family (`Nonionic Surfactant`)
  - Direct navigation link to the static page (`./<categorySlug>/<slug>/index.html`)
- **Dismissal**: Closes automatically when clicking anywhere outside the search container or clearing the input.

---

## 4. Multi-Facet Filtering Logic
The filter engine evaluates all active filter states simultaneously via logical `AND`:
```javascript
activeProducts = allProducts.filter(p => {
  return matchSearchQuery(p, state.search) &&
         matchCategory(p, state.category) &&
         matchProcessStage(p, state.stage) &&
         matchFunction(p, state.function) &&
         matchFibre(p, state.fibre);
});
```

### Facet Specifications:
1. **Category**:
   - Matches either `p.categoryId` (e.g. `CAT-B`) or `p.categorySlug` (e.g. `pretreatment-chemicals`).
2. **Process Stage**:
   - Maps normalized keywords: `spinning`, `pretreatment`, `bleaching`, `dyeing`, `printing`, `after-treatment`, `finishing`, `garment`, `technical`.
3. **Function**:
   - Maps role strings: `wetting`, `scouring`, `desizing`, `sequestering`, `stabilising`, `levelling`, `dispersing`, `fixing`, `softening`, `washing-off`, `anti-back-staining`, `thickener`.
4. **Fibre Compatibility**:
   - Maps substrate fibres: `cotton`, `viscose`, `polyester`, `nylon`, `wool`, `acrylic`, `blends`.
5. **Sorting Modes**:
   - `cat-asc`: Category ID order (`CAT-A` through `CAT-M`, followed by internal product number).
   - `name-asc`: Product Name alphabetical (A &rarr; Z).
   - `name-desc`: Product Name reverse alphabetical (Z &rarr; A).

---

## 5. URL Deep Linking & Synchronisation
Filter states synchronize with browser URL parameters in real time using `window.history.replaceState`:
- `?q=<searchQuery>`
- `?cat=<categoryId>`
- `?stage=<stageKeyword>`
- `?function=<functionKeyword>`
- `?fibre=<fibreKeyword>`

When a user visits a link containing parameters, the discovery engine parses the URL on page load, populates the dropdowns, sets the input values, and triggers the filter execution immediately.
