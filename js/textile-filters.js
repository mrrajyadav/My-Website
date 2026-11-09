/**
 * Om Sai Enterprise - Textile Chemicals Intelligent Discovery & Search Engine
 * Features:
 * - Deterministic, base-path-aware product & category URLs (prevents broken routes)
 * - Token-based multi-word search engine (e.g., "cotton wetting", "DAF", "polyester jet defoamer")
 * - Exhaustive search coverage: Name, Synonyms, ID, Chemical Family, Subcategory, Functions,
 *   Process Stages, Fibres, Fabric Applications, Machinery Applications, Technical Overview/Why
 * - Weighted relevance scoring
 * - Comprehensive faceted filters: Category, Subcategory, Chemical Family, Stage, Function, Fibre,
 *   Fabric Application, Machinery Application, and Sorting
 * - Active Filter Chips with 1-click individual removal
 * - URL query parameter synchronization & deep linking
 */

(function () {
  'use strict';

  let allProducts = [];
  let filteredProducts = [];
  let categories = [];

  const state = {
    search: '',
    category: 'all',
    subcategory: 'all',
    chemFamily: 'all',
    stage: 'all',
    function: 'all',
    fibre: 'all',
    application: 'all',
    machinery: 'all',
    sort: 'cat-asc'
  };

  // Safe HTML escaper
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Base-path aware URL resolver:
  // From /chemicals/textile-chemicals.html, product pages live at:
  // ./textile-chemicals/<categorySlug>/<slug>/index.html
  function getProductUrl(prod) {
    const path = window.location.pathname;
    if (path.includes('/chemicals/textile-chemicals/')) {
      // Already inside a category directory (depth 3)
      return `../${prod.categorySlug}/${prod.slug}/index.html`;
    }
    // On chemicals/textile-chemicals.html or /chemicals/
    return `./textile-chemicals/${prod.categorySlug}/${prod.slug}/index.html`;
  }

  function getCategoryUrl(catSlug) {
    const path = window.location.pathname;
    if (path.includes('/chemicals/textile-chemicals/')) {
      return `../${catSlug}/index.html`;
    }
    return `./textile-chemicals/${catSlug}/index.html`;
  }

  // Determine prefix to load JSON data
  function getDataPrefix() {
    const path = window.location.pathname;
    if (path.includes('/chemicals/textile-chemicals/')) {
      return '../../../';
    }
    if (path.includes('/chemicals/')) {
      return '../';
    }
    return '';
  }

  // Load Data
  async function loadData() {
    const prefix = getDataPrefix();
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${prefix}data/textile-products.json`, { cache: 'no-cache' }),
        fetch(`${prefix}data/textile-chemical-categories.json`, { cache: 'no-cache' })
      ]);

      if (prodRes.ok) {
        allProducts = await prodRes.json();
      }
      if (catRes.ok) {
        categories = await catRes.json();
      }
    } catch (err) {
      console.warn('Could not load textile products JSON:', err);
      allProducts = [];
    }

    readUrlParams();
    populateDropdowns();
    setupEventListeners();
    setupAutocomplete();
    applyFilters();
  }

  // Read URL query parameters on page load
  function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) state.search = params.get('q');
    if (params.has('search')) state.search = params.get('search');
    if (params.has('cat') || params.has('category')) {
      state.category = params.get('cat') || params.get('category');
    }
    if (params.has('subcat')) state.subcategory = params.get('subcat');
    if (params.has('family')) state.chemFamily = params.get('family');
    if (params.has('stage')) state.stage = params.get('stage');
    if (params.has('function')) state.function = params.get('function');
    if (params.has('fibre')) state.fibre = params.get('fibre');
    if (params.has('app')) state.application = params.get('app');
    if (params.has('machine')) state.machinery = params.get('machine');
    if (params.has('sort')) state.sort = params.get('sort');

    // Sync input fields
    const searchInputs = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    searchInputs.forEach(inp => {
      if (inp) inp.value = state.search;
    });
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (state.search) params.set('q', state.search);
    if (state.category && state.category !== 'all') params.set('cat', state.category);
    if (state.subcategory && state.subcategory !== 'all') params.set('subcat', state.subcategory);
    if (state.chemFamily && state.chemFamily !== 'all') params.set('family', state.chemFamily);
    if (state.stage && state.stage !== 'all') params.set('stage', state.stage);
    if (state.function && state.function !== 'all') params.set('function', state.function);
    if (state.fibre && state.fibre !== 'all') params.set('fibre', state.fibre);
    if (state.application && state.application !== 'all') params.set('app', state.application);
    if (state.machinery && state.machinery !== 'all') params.set('machine', state.machinery);

    const queryString = params.toString() ? '?' + params.toString() : '';
    const newUrl = `${window.location.pathname}${queryString}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  }

  // Populate dynamic dropdown options
  function populateDropdowns() {
    // 1. Category Dropdown
    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) {
      catSelect.innerHTML = '<option value="all">All Categories (A–M)</option>';
      categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = `${cat.id} (${cat.code}) — ${cat.name}`;
        if (state.category === cat.id || state.category === cat.slug) {
          opt.selected = true;
        }
        catSelect.appendChild(opt);
      });
    }

    // 2. Subcategory Dropdown
    const subcatSelect = document.getElementById('filterSubcategorySelect');
    if (subcatSelect) {
      const subcategories = Array.from(new Set(allProducts.map(p => p.subcategory).filter(Boolean))).sort();
      subcatSelect.innerHTML = '<option value="all">All Subcategories</option>';
      subcategories.forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub;
        opt.textContent = sub;
        if (state.subcategory === sub) opt.selected = true;
        subcatSelect.appendChild(opt);
      });
    }

    // 3. Chemical Family Dropdown
    const familySelect = document.getElementById('filterChemFamilySelect');
    if (familySelect) {
      const families = Array.from(new Set(allProducts.map(p => p.chemicalFamily).filter(Boolean))).sort();
      familySelect.innerHTML = '<option value="all">All Chemical Families</option>';
      families.forEach(fam => {
        const opt = document.createElement('option');
        opt.value = fam;
        opt.textContent = fam;
        if (state.chemFamily === fam) opt.selected = true;
        familySelect.appendChild(opt);
      });
    }

    // Sync other select inputs with state
    const stageSelect = document.getElementById('filterStageSelect');
    if (stageSelect && state.stage !== 'all') stageSelect.value = state.stage;

    const funcSelect = document.getElementById('filterFunctionSelect');
    if (funcSelect && state.function !== 'all') funcSelect.value = state.function;

    const fibreSelect = document.getElementById('filterFibreSelect');
    if (fibreSelect && state.fibre !== 'all') fibreSelect.value = state.fibre;

    const appSelect = document.getElementById('filterApplicationSelect');
    if (appSelect && state.application !== 'all') appSelect.value = state.application;

    const machineSelect = document.getElementById('filterMachinerySelect');
    if (machineSelect && state.machinery !== 'all') machineSelect.value = state.machinery;

    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect && state.sort !== 'cat-asc') sortSelect.value = state.sort;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    const searchInputs = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        state.search = e.target.value.trim();
        searchInputs.forEach(other => {
          if (other !== input) other.value = input.value;
        });
        applyFilters();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const targetSection = document.getElementById('textile-catalogue');
          if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    const bindSelect = (id, stateKey) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', (e) => {
          state[stateKey] = e.target.value;
          applyFilters();
        });
      }
    };

    bindSelect('filterCategorySelect', 'category');
    bindSelect('filterSubcategorySelect', 'subcategory');
    bindSelect('filterChemFamilySelect', 'chemFamily');
    bindSelect('filterStageSelect', 'stage');
    bindSelect('filterFunctionSelect', 'function');
    bindSelect('filterFibreSelect', 'fibre');
    bindSelect('filterApplicationSelect', 'application');
    bindSelect('filterMachinerySelect', 'machinery');
    bindSelect('filterSortSelect', 'sort');

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', resetAllFilters);
    }

    // Connect Section 3 Process Stage Cards
    const stageCards = document.querySelectorAll('.chem-tex-journey-step');
    stageCards.forEach(step => {
      step.style.cursor = 'pointer';
      step.setAttribute('title', 'Click to filter catalogue by this process stage');
      step.addEventListener('click', () => {
        const titleEl = step.querySelector('.chem-tex-journey-title');
        if (!titleEl) return;
        const text = titleEl.textContent.toLowerCase();
        if (text.includes('spin') || text.includes('yarn')) state.stage = 'spinning';
        else if (text.includes('pretreatment') || text.includes('scour')) state.stage = 'pretreatment';
        else if (text.includes('bleach')) state.stage = 'bleaching';
        else if (text.includes('dye')) state.stage = 'dyeing';
        else if (text.includes('print')) state.stage = 'printing';
        else if (text.includes('after-treatment') || text.includes('wash')) state.stage = 'after-treatment';
        else if (text.includes('soften') || text.includes('finish')) state.stage = 'finishing';
        else if (text.includes('garment') || text.includes('denim')) state.stage = 'garment';
        else state.stage = 'all';

        const stageSelect = document.getElementById('filterStageSelect');
        if (stageSelect) stageSelect.value = state.stage;
        applyFilters();

        const catSection = document.getElementById('textile-catalogue');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Connect Section 7 Fibre Cards
    const fibreCards = document.querySelectorAll('.chem-tex-fibre-card');
    fibreCards.forEach(fc => {
      fc.style.cursor = 'pointer';
      fc.setAttribute('title', 'Click to filter catalogue by this fibre type');
      fc.addEventListener('click', () => {
        const titleEl = fc.querySelector('.chem-tex-fibre-title');
        if (!titleEl) return;
        const text = titleEl.textContent.toLowerCase();
        if (text.includes('cotton') || text.includes('cellulos')) state.fibre = 'cotton';
        else if (text.includes('polyester')) state.fibre = 'polyester';
        else if (text.includes('nylon')) state.fibre = 'nylon';
        else if (text.includes('wool') || text.includes('silk')) state.fibre = 'wool';
        else if (text.includes('blend')) state.fibre = 'blends';
        else state.fibre = 'all';

        const fibreSelect = document.getElementById('filterFibreSelect');
        if (fibreSelect) fibreSelect.value = state.fibre;
        applyFilters();

        const catSection = document.getElementById('textile-catalogue');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Token-Based Multi-Word Search Matcher
  // Matches when ALL tokens find a match in the product's attributes
  function matchProductSearch(prod, query) {
    if (!query) return { matched: true, score: 0 };
    const rawTokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (rawTokens.length === 0) return { matched: true, score: 0 };

    // Compile text blocks
    const nameStr = prod.name.toLowerCase();
    const idStr = prod.id.toLowerCase();
    const familyStr = (prod.chemicalFamily || '').toLowerCase();
    const subcatStr = (prod.subcategory || '').toLowerCase();
    const catNameStr = (prod.categoryName || '').toLowerCase();
    const synStr = (prod.synonyms || []).join(' ').toLowerCase();
    const keyStr = (prod.searchKeywords || []).join(' ').toLowerCase();
    const funcStr = (prod.functions || []).join(' ').toLowerCase();
    const stageStr = (prod.processStages || []).join(' ').toLowerCase();
    const fibreStr = (prod.applicableFibres || []).join(' ').toLowerCase();
    const appStr = (prod.fabricApplications || []).join(' ').toLowerCase();
    const machStr = (prod.machineryApplications || []).join(' ').toLowerCase();
    const overviewStr = ((prod.technicalContent && prod.technicalContent.overview) || '').toLowerCase();
    const whyStr = ((prod.technicalContent && prod.technicalContent.whyUsed) || '').toLowerCase();

    // Check if every token is present in at least one field
    let totalScore = 0;
    const fullQuery = query.toLowerCase();

    // Exact full query bonus
    if (nameStr.includes(fullQuery)) totalScore += 120;
    if (synStr.includes(fullQuery)) totalScore += 80;
    if (keyStr.includes(fullQuery)) totalScore += 60;

    for (const token of rawTokens) {
      let tokenMatched = false;

      if (nameStr.includes(token)) {
        tokenMatched = true;
        totalScore += 50;
      }
      if (idStr.includes(token)) {
        tokenMatched = true;
        totalScore += 45;
      }
      if (synStr.includes(token)) {
        tokenMatched = true;
        totalScore += 35;
      }
      if (funcStr.includes(token)) {
        tokenMatched = true;
        totalScore += 30;
      }
      if (familyStr.includes(token) || subcatStr.includes(token)) {
        tokenMatched = true;
        totalScore += 25;
      }
      if (machStr.includes(token)) {
        tokenMatched = true;
        totalScore += 25;
      }
      if (fibreStr.includes(token)) {
        tokenMatched = true;
        totalScore += 20;
      }
      if (appStr.includes(token)) {
        tokenMatched = true;
        totalScore += 20;
      }
      if (keyStr.includes(token) || stageStr.includes(token) || catNameStr.includes(token)) {
        tokenMatched = true;
        totalScore += 15;
      }
      if (overviewStr.includes(token) || whyStr.includes(token)) {
        tokenMatched = true;
        totalScore += 10;
      }

      if (!tokenMatched) {
        return { matched: false, score: 0 };
      }
    }

    return { matched: true, score: totalScore };
  }

  // Live Autocomplete Suggestions
  function setupAutocomplete() {
    const inputs = [
      { input: document.getElementById('heroTextileSearchInput'), list: document.getElementById('heroSearchSuggestions') },
      { input: document.getElementById('textileSearchInput'), list: document.getElementById('catalogueSearchSuggestions') }
    ];

    inputs.forEach(({ input, list }) => {
      if (!input || !list) return;

      input.addEventListener('input', () => {
        const query = input.value.trim();
        if (query.length < 2) {
          list.innerHTML = '';
          list.style.display = 'none';
          return;
        }

        const scoredMatches = allProducts
          .map(prod => {
            const { matched, score } = matchProductSearch(prod, query);
            return { prod, matched, score };
          })
          .filter(m => m.matched)
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);

        if (scoredMatches.length === 0) {
          list.innerHTML = `<div style="padding: 12px 16px; font-size: 0.875rem; color: #6C7D8E;">No matching textile chemical found for "${esc(query)}"</div>`;
          list.style.display = 'block';
          return;
        }

        list.innerHTML = scoredMatches.map(({ prod }) => {
          const pageUrl = getProductUrl(prod);
          return `
            <a href="${pageUrl}" class="chem-tex-suggest-item" style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; text-decoration: none; border-bottom: 1px solid #EBF1F7; color: #1E293B; transition: background 0.15s ease;">
              <div>
                <div style="font-weight: 700; font-size: 0.9375rem; color: #0754B5;">${esc(prod.name)}</div>
                <div style="font-size: 0.75rem; color: #64748B;">${esc(prod.categoryId)} &bull; ${esc(prod.categoryName)} &bull; ${esc(prod.chemicalFamily)}</div>
              </div>
              <span style="font-size: 0.75rem; color: #0754B5; font-weight: 600;">Technical Profile &rarr;</span>
            </a>
          `;
        }).join('');

        list.style.display = 'block';
      });

      document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !list.contains(e.target)) {
          list.style.display = 'none';
        }
      });
    });
  }

  // Filter Algorithm
  function applyFilters() {
    updateUrlParams();

    const scoredProducts = [];

    allProducts.forEach(prod => {
      // 1. Search Query with Tokenized Matching & Relevance
      const { matched: searchMatched, score: searchScore } = matchProductSearch(prod, state.search);
      if (!searchMatched) return;

      // 2. Category
      if (state.category && state.category !== 'all') {
        const catMatch = prod.categoryId === state.category || prod.categorySlug === state.category;
        if (!catMatch) return;
      }

      // 3. Subcategory
      if (state.subcategory && state.subcategory !== 'all') {
        if (prod.subcategory !== state.subcategory) return;
      }

      // 4. Chemical Family
      if (state.chemFamily && state.chemFamily !== 'all') {
        if (prod.chemicalFamily !== state.chemFamily) return;
      }

      // 5. Processing Stage
      if (state.stage && state.stage !== 'all') {
        const target = state.stage.toLowerCase();
        const hasStage = prod.processStages.some(st => {
          const s = st.toLowerCase();
          if (target === 'spinning') return s.includes('spin') || s.includes('yarn') || s.includes('sizing');
          if (target === 'pretreatment') return s.includes('pretreatment') || s.includes('scour') || s.includes('desiz');
          if (target === 'bleaching') return s.includes('bleach');
          if (target === 'dyeing') return s.includes('dye');
          if (target === 'printing') return s.includes('print');
          if (target === 'after-treatment') return s.includes('after') || s.includes('wash') || s.includes('clearing') || s.includes('fix');
          if (target === 'finishing') return s.includes('finish') || s.includes('soften');
          if (target === 'garment') return s.includes('garment') || s.includes('denim');
          if (target === 'technical') return s.includes('coating') || s.includes('laminat') || s.includes('technical');
          if (target === 'etp') return s.includes('effluent') || s.includes('water') || s.includes('etp');
          return s.includes(target);
        });
        if (!hasStage) return;
      }

      // 6. Product Function
      if (state.function && state.function !== 'all') {
        const target = state.function.toLowerCase();
        const hasFunc = prod.functions.some(f => {
          const fn = f.toLowerCase();
          if (target === 'wetting') return fn.includes('wet') || fn.includes('penetrat');
          if (target === 'scouring') return fn.includes('scour') || fn.includes('deterg');
          if (target === 'desizing') return fn.includes('desiz');
          if (target === 'sequestering') return fn.includes('sequest') || fn.includes('chelat');
          if (target === 'stabilising') return fn.includes('stabilis') || fn.includes('stabiliz');
          if (target === 'levelling') return fn.includes('level');
          if (target === 'dispersing') return fn.includes('dispers');
          if (target === 'fixing') return fn.includes('fix');
          if (target === 'softening') return fn.includes('soften') || fn.includes('handle');
          if (target === 'washing-off') return fn.includes('soap') || fn.includes('wash');
          if (target === 'anti-back-staining') return fn.includes('anti-back') || fn.includes('stain');
          if (target === 'thickener') return fn.includes('thicken') || fn.includes('bind');
          return fn.includes(target);
        });
        if (!hasFunc) return;
      }

      // 7. Fibre Compatibility
      if (state.fibre && state.fibre !== 'all') {
        const target = state.fibre.toLowerCase();
        const hasFibre = prod.applicableFibres.some(fb => {
          const f = fb.toLowerCase();
          if (target === 'cotton') return f.includes('cotton') || f.includes('cellulos');
          if (target === 'viscose') return f.includes('viscose') || f.includes('modal') || f.includes('lyocell') || f.includes('rayon');
          if (target === 'polyester') return f.includes('poly') || f.includes('pes');
          if (target === 'nylon') return f.includes('nylon') || f.includes('polyamide') || f.includes('pa');
          if (target === 'wool') return f.includes('wool') || f.includes('silk');
          if (target === 'acrylic') return f.includes('acrylic') || f.includes('pan');
          if (target === 'blends') return f.includes('blend') || f.includes('poly-cotton') || f.includes('pc') || f.includes('pv');
          return f.includes(target);
        });
        if (!hasFibre) return;
      }

      // 8. Fabric Application
      if (state.application && state.application !== 'all') {
        const target = state.application.toLowerCase();
        const hasApp = prod.fabricApplications.some(app => {
          const a = app.toLowerCase();
          if (target === 'woven') return a.includes('woven') || a.includes('shirting') || a.includes('suiting');
          if (target === 'knitted') return a.includes('knit') || a.includes('circular') || a.includes('hosiery');
          if (target === 'denim') return a.includes('denim') || a.includes('twill');
          if (target === 'terry') return a.includes('terry') || a.includes('towel') || a.includes('sheeting');
          if (target === 'garment') return a.includes('garment') || a.includes('laundry');
          if (target === 'technical') return a.includes('technical') || a.includes('coated') || a.includes('curtain') || a.includes('blind');
          return a.includes(target);
        });
        if (!hasApp) return;
      }

      // 9. Machinery Application
      if (state.machinery && state.machinery !== 'all') {
        const target = state.machinery.toLowerCase();
        const hasMach = prod.machineryApplications.some(mach => {
          const m = mach.toLowerCase();
          if (target === 'jet') return m.includes('jet') || m.includes('soft flow');
          if (target === 'continuous') return m.includes('continuous') || m.includes('pad') || m.includes('range');
          if (target === 'jigger') return m.includes('jigger') || m.includes('winch');
          if (target === 'stenter') return m.includes('stenter');
          if (target === 'printing') return m.includes('screen') || m.includes('rotary') || m.includes('flatbed');
          if (target === 'package') return m.includes('package') || m.includes('yarn') || m.includes('cone');
          if (target === 'etp') return m.includes('etp') || m.includes('daf') || m.includes('dissolved air') || m.includes('clarifier');
          return m.includes(target);
        });
        if (!hasMach) return;
      }

      scoredProducts.push({ prod, score: searchScore });
    });

    // Sorting
    if (state.sort === 'name-asc') {
      scoredProducts.sort((a, b) => a.prod.name.localeCompare(b.prod.name));
    } else if (state.sort === 'name-desc') {
      scoredProducts.sort((a, b) => b.prod.name.localeCompare(a.prod.name));
    } else if (state.search && state.sort !== 'cat-asc') {
      scoredProducts.sort((a, b) => b.score - a.score);
    } else {
      // Default: Category Order (CAT-A -> CAT-M, then num)
      scoredProducts.sort((a, b) => {
        if (a.prod.categoryId === b.prod.categoryId) {
          return a.prod.num - b.prod.num;
        }
        return a.prod.categoryId.localeCompare(b.prod.categoryId);
      });
    }

    filteredProducts = scoredProducts.map(sp => sp.prod);

    renderActiveFilterChips();
    renderGrid();
    renderStatusRow();
  }

  // Active Filter Chips with 1-Click Removal
  function renderActiveFilterChips() {
    const container = document.getElementById('activeFilterChips');
    if (!container) return;

    const chips = [];

    if (state.search) {
      chips.push({ key: 'search', label: `Search: "${state.search}"` });
    }
    if (state.category !== 'all') {
      const catObj = categories.find(c => c.id === state.category || c.slug === state.category);
      chips.push({ key: 'category', label: `Category: ${catObj ? catObj.code : state.category}` });
    }
    if (state.subcategory !== 'all') {
      chips.push({ key: 'subcategory', label: `Subcat: ${state.subcategory}` });
    }
    if (state.chemFamily !== 'all') {
      chips.push({ key: 'chemFamily', label: `Family: ${state.chemFamily}` });
    }
    if (state.stage !== 'all') {
      chips.push({ key: 'stage', label: `Stage: ${state.stage}` });
    }
    if (state.function !== 'all') {
      chips.push({ key: 'function', label: `Function: ${state.function}` });
    }
    if (state.fibre !== 'all') {
      chips.push({ key: 'fibre', label: `Fibre: ${state.fibre}` });
    }
    if (state.application !== 'all') {
      chips.push({ key: 'application', label: `App: ${state.application}` });
    }
    if (state.machinery !== 'all') {
      chips.push({ key: 'machinery', label: `Machinery: ${state.machinery}` });
    }

    if (chips.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = chips.map(chip => `
      <span class="chem-tex-filter-chip" style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: #EBF3FC; color: #0754B5; border: 1px solid #BAD7F5; border-radius: 16px; font-size: 0.785rem; font-weight: 600;">
        ${esc(chip.label)}
        <button type="button" onclick="window.textileRemoveFilter('${chip.key}')" style="background: none; border: none; padding: 0; margin: 0; cursor: pointer; color: #0754B5; font-weight: 800; font-size: 0.85rem;" aria-label="Remove filter">&times;</button>
      </span>
    `).join('') + `
      <button type="button" onclick="window.textileResetFilters()" style="background: none; border: none; padding: 4px 8px; font-size: 0.75rem; color: #EF4444; font-weight: 600; cursor: pointer; text-decoration: underline;">
        Clear All
      </button>
    `;
  }

  // Remove single filter
  window.textileRemoveFilter = function (key) {
    if (key === 'search') {
      state.search = '';
      const inps = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
      inps.forEach(i => i.value = '');
    } else {
      state[key] = 'all';
      const elMap = {
        category: 'filterCategorySelect',
        subcategory: 'filterSubcategorySelect',
        chemFamily: 'filterChemFamilySelect',
        stage: 'filterStageSelect',
        function: 'filterFunctionSelect',
        fibre: 'filterFibreSelect',
        application: 'filterApplicationSelect',
        machinery: 'filterMachinerySelect'
      };
      const elId = elMap[key];
      if (elId) {
        const el = document.getElementById(elId);
        if (el) el.value = 'all';
      }
    }
    applyFilters();
  };

  function resetAllFilters() {
    state.search = '';
    state.category = 'all';
    state.subcategory = 'all';
    state.chemFamily = 'all';
    state.stage = 'all';
    state.function = 'all';
    state.fibre = 'all';
    state.application = 'all';
    state.machinery = 'all';
    state.sort = 'cat-asc';

    const inps = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    inps.forEach(i => i.value = '');

    [
      'filterCategorySelect',
      'filterSubcategorySelect',
      'filterChemFamilySelect',
      'filterStageSelect',
      'filterFunctionSelect',
      'filterFibreSelect',
      'filterApplicationSelect',
      'filterMachinerySelect'
    ].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = 'all';
    });

    const sortEl = document.getElementById('filterSortSelect');
    if (sortEl) sortEl.value = 'cat-asc';

    applyFilters();
  }

  function renderStatusRow() {
    const countEl = document.getElementById('filterResultCount');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filteredProducts.length}</strong> of <strong>${allProducts.length}</strong> textile chemical sourcing guides`;
    }
  }

  function renderGrid() {
    const grid = document.getElementById('textileGrid');
    if (!grid) return;

    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background-color: #F8FAFD; border: 1px dashed #CAD5E2; border-radius: 12px;">
          <div style="font-size: 2.2rem; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 1.35rem; font-weight: 700; color: #0754B5; margin-bottom: 8px;">No matching textile chemicals found</h3>
          <p style="font-size: 0.95rem; color: #586A7D; max-width: 540px; margin: 0 auto 20px auto; line-height: 1.6;">
            We could not find any products matching your specific combination of filters. Try broadening your search or resetting all filters.
          </p>
          <button type="button" class="btn btn-primary btn-sm" onclick="window.textileResetFilters()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredProducts.map(prod => {
      const pageUrl = getProductUrl(prod);
      return `
        <article class="chem-tex-category-card" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
          <div>
            <div class="chem-tex-cat-header" style="margin-bottom: 10px;">
              <span class="chem-tex-cat-code" style="font-size: 0.75rem;">${esc(prod.categoryId)} &bull; ${esc(prod.id)}</span>
              <span class="chem-tex-cat-stage" style="font-size: 0.75rem;">${esc(prod.processStages[0] || 'Textile')}</span>
            </div>
            <h3 class="chem-tex-cat-title" style="font-size: 1.2rem; margin-bottom: 8px;">
              <a href="${pageUrl}" style="color: inherit; text-decoration: none;">${esc(prod.name)}</a>
            </h3>
            <p class="chem-tex-cat-desc" style="font-size: 0.875rem; line-height: 1.55; margin-bottom: 14px;">
              ${esc(prod.shortDescription)}
            </p>
            <div style="font-size: 0.75rem; color: #64748B; margin-bottom: 16px; display: flex; flex-direction: column; gap: 4px;">
              <div><strong>Class:</strong> ${esc(prod.chemicalFamily)}</div>
              <div><strong>Function:</strong> ${esc(prod.functions.slice(0, 2).join(', '))}</div>
              <div><strong>Fibres:</strong> ${esc(prod.applicableFibres.slice(0, 3).join(', '))}</div>
              <div><strong>Machines:</strong> ${esc(prod.machineryApplications.slice(0, 2).join(', '))}</div>
            </div>
          </div>
          <div class="chem-tex-cat-action" style="padding-top: 14px; border-top: 1px solid #EBF1F7; display: flex; gap: 8px; flex-wrap: wrap;">
            <a href="${pageUrl}" class="btn btn-primary btn-sm" style="flex: 1; text-align: center;">Technical Profile &rarr;</a>
            <a href="https://www.indiamart.com/om-saienterprise-surat/" target="_blank" rel="noopener noreferrer" class="btn btn-indiamart btn-sm" title="Enquire on IndiaMART">
              Enquire
            </a>
          </div>
        </article>
      `;
    }).join('');
  }

  // Global reset helper
  window.textileResetFilters = resetAllFilters;

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();
