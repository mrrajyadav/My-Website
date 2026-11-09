/**
 * Om Sai Enterprise - Textile Chemicals Intelligent Discovery & Search Engine
 * Loads all 140 authentic textile chemicals from /data/textile-products.json
 * Features:
 * - Live autocomplete search dropdown with instant technical suggestions
 * - Multi-faceted filtering across Category (A-M), Processing Stage, Function, and Fibre
 * - URL query parameter synchronization (?search=, ?cat=, ?stage=, ?fibre=)
 * - Deep linking to individual static product pages (chemicals/textile-chemicals/<categorySlug>/<slug>/)
 * - IndiaMART commercial trade inquiry actions
 */

(function () {
  'use strict';

  let allProducts = [];
  let filteredProducts = [];
  let categories = [];

  const state = {
    search: '',
    category: 'all',
    stage: 'all',
    function: 'all',
    fibre: 'all',
    sort: 'cat-asc'
  };

  // Helper to determine asset prefix based on URL depth
  function getPathPrefix() {
    return window.location.pathname.includes('/chemicals/') ? '../' : '';
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Load Data
  async function loadData() {
    const prefix = getPathPrefix();
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
    populateCategoryDropdown();
    setupEventListeners();
    setupAutocomplete();
    applyFilters();
  }

  // Read URL query parameters on load
  function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) state.search = params.get('q');
    if (params.has('search')) state.search = params.get('search');
    if (params.has('cat') || params.has('category')) {
      state.category = params.get('cat') || params.get('category');
    }
    if (params.has('stage')) state.stage = params.get('stage');
    if (params.has('function')) state.function = params.get('function');
    if (params.has('fibre')) state.fibre = params.get('fibre');

    // Sync input fields
    const searchInputs = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    searchInputs.forEach(inp => {
      if (inp) inp.value = state.search;
    });

    const stageSelect = document.getElementById('filterStageSelect');
    if (stageSelect && state.stage !== 'all') stageSelect.value = state.stage;

    const funcSelect = document.getElementById('filterFunctionSelect');
    if (funcSelect && state.function !== 'all') funcSelect.value = state.function;

    const fibreSelect = document.getElementById('filterFibreSelect');
    if (fibreSelect && state.fibre !== 'all') fibreSelect.value = state.fibre;
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (state.search) params.set('q', state.search);
    if (state.category && state.category !== 'all') params.set('cat', state.category);
    if (state.stage && state.stage !== 'all') params.set('stage', state.stage);
    if (state.function && state.function !== 'all') params.set('function', state.function);
    if (state.fibre && state.fibre !== 'all') params.set('fibre', state.fibre);

    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}${window.location.hash}`;
    window.history.replaceState({}, '', newUrl);
  }

  function populateCategoryDropdown() {
    const catSelect = document.getElementById('filterCategorySelect');
    if (!catSelect) return;

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

  // Setup Event Listeners
  function setupEventListeners() {
    const searchInputs = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        state.search = e.target.value.trim();
        // Sync the other search input if present
        searchInputs.forEach(other => {
          if (other !== input) other.value = input.value;
        });
        applyFilters();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const targetSection = document.getElementById('textile-catalogue');
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });

    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) {
      catSelect.addEventListener('change', (e) => {
        state.category = e.target.value;
        applyFilters();
      });
    }

    const stageSelect = document.getElementById('filterStageSelect');
    if (stageSelect) {
      stageSelect.addEventListener('change', (e) => {
        state.stage = e.target.value;
        applyFilters();
      });
    }

    const funcSelect = document.getElementById('filterFunctionSelect');
    if (funcSelect) {
      funcSelect.addEventListener('change', (e) => {
        state.function = e.target.value;
        applyFilters();
      });
    }

    const fibreSelect = document.getElementById('filterFibreSelect');
    if (fibreSelect) {
      fibreSelect.addEventListener('change', (e) => {
        state.fibre = e.target.value;
        applyFilters();
      });
    }

    const sortSelect = document.getElementById('filterSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFilters();
      });
    }

    const clearBtn = document.getElementById('clearFiltersBtn');
    if (clearBtn) {
      clearBtn.addEventListener('click', resetAllFilters);
    }

    // Connect interactive process stages (Section 3) to filter catalogue
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

        if (stageSelect) stageSelect.value = state.stage;
        applyFilters();

        const catSection = document.getElementById('textile-catalogue');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Connect fibre cards (Section 7) to filter catalogue
    const fibreCards = document.querySelectorAll('.chem-tex-fibre-card');
    fibreCards.forEach(fc => {
      fc.style.cursor = 'pointer';
      fc.setAttribute('title', 'Click to filter catalogue by this fibre');
      fc.addEventListener('click', () => {
        const titleEl = fc.querySelector('.chem-tex-fibre-title');
        if (!titleEl) return;
        const text = titleEl.textContent.toLowerCase();
        if (text.includes('cotton') || text.includes('cellulosic')) state.fibre = 'cotton';
        else if (text.includes('polyester')) state.fibre = 'polyester';
        else if (text.includes('nylon')) state.fibre = 'nylon';
        else if (text.includes('wool') || text.includes('silk')) state.fibre = 'wool';
        else if (text.includes('blend')) state.fibre = 'blends';
        else state.fibre = 'all';

        if (fibreSelect) fibreSelect.value = state.fibre;
        applyFilters();

        const catSection = document.getElementById('textile-catalogue');
        if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
      });
    });
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
        const query = input.value.trim().toLowerCase();
        if (query.length < 2) {
          list.innerHTML = '';
          list.style.display = 'none';
          return;
        }

        const matches = allProducts.filter(p => {
          return (
            p.name.toLowerCase().includes(query) ||
            p.id.toLowerCase().includes(query) ||
            p.chemicalFamily.toLowerCase().includes(query) ||
            p.synonyms.some(s => s.toLowerCase().includes(query)) ||
            p.searchKeywords.some(k => k.toLowerCase().includes(query)) ||
            p.functions.some(f => f.toLowerCase().includes(query))
          );
        }).slice(0, 6);

        if (matches.length === 0) {
          list.innerHTML = `<div style="padding: 12px 16px; font-size: 0.875rem; color: #6C7D8E;">No matching chemical found for "${esc(query)}"</div>`;
          list.style.display = 'block';
          return;
        }

        list.innerHTML = matches.map(p => `
          <a href="./${p.categorySlug}/${p.slug}/index.html" class="chem-tex-suggest-item" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; text-decoration: none; border-bottom: 1px solid #EBF1F7; color: #1E293B; transition: background 0.15s ease;">
            <div>
              <div style="font-weight: 700; font-size: 0.9375rem; color: #0754B5;">${esc(p.name)}</div>
              <div style="font-size: 0.75rem; color: #64748B;">${esc(p.categoryId)} &bull; ${esc(p.categoryName)} &bull; ${esc(p.chemicalFamily)}</div>
            </div>
            <span style="font-size: 0.75rem; color: #0754B5; font-weight: 600;">View &rarr;</span>
          </a>
        `).join('');

        list.style.display = 'block';
      });

      // Close on outside click
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

    filteredProducts = allProducts.filter(prod => {
      // 1. Search filter
      if (state.search) {
        const q = state.search.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(q);
        const matchesId = prod.id.toLowerCase().includes(q);
        const matchesFam = prod.chemicalFamily.toLowerCase().includes(q);
        const matchesCat = prod.categoryName.toLowerCase().includes(q);
        const matchesSub = (prod.subcategory || '').toLowerCase().includes(q);
        const matchesSyn = prod.synonyms.some(s => s.toLowerCase().includes(q));
        const matchesKey = prod.searchKeywords.some(k => k.toLowerCase().includes(q));
        const matchesFunc = prod.functions.some(f => f.toLowerCase().includes(q));
        const matchesStage = prod.processStages.some(st => st.toLowerCase().includes(q));
        const matchesFibre = prod.applicableFibres.some(fb => fb.toLowerCase().includes(q));

        if (!matchesName && !matchesId && !matchesFam && !matchesCat && !matchesSub && !matchesSyn && !matchesKey && !matchesFunc && !matchesStage && !matchesFibre) {
          return false;
        }
      }

      // 2. Category filter
      if (state.category && state.category !== 'all') {
        const catMatch = prod.categoryId === state.category || prod.categorySlug === state.category;
        if (!catMatch) return false;
      }

      // 3. Process Stage filter
      if (state.stage && state.stage !== 'all') {
        const targetStage = state.stage.toLowerCase();
        const hasStage = prod.processStages.some(st => {
          const s = st.toLowerCase();
          if (targetStage === 'spinning') return s.includes('spin') || s.includes('yarn') || s.includes('sizing');
          if (targetStage === 'pretreatment') return s.includes('pretreatment') || s.includes('scour') || s.includes('desiz');
          if (targetStage === 'bleaching') return s.includes('bleach');
          if (targetStage === 'dyeing') return s.includes('dye');
          if (targetStage === 'printing') return s.includes('print');
          if (targetStage === 'after-treatment') return s.includes('after') || s.includes('wash') || s.includes('clearing') || s.includes('fix');
          if (targetStage === 'finishing') return s.includes('finish') || s.includes('soften');
          if (targetStage === 'garment') return s.includes('garment') || s.includes('denim');
          if (targetStage === 'technical') return s.includes('coating') || s.includes('laminat') || s.includes('technical');
          return s.includes(targetStage);
        });
        if (!hasStage) return false;
      }

      // 4. Function filter
      if (state.function && state.function !== 'all') {
        const targetFunc = state.function.toLowerCase();
        const hasFunc = prod.functions.some(f => {
          const fn = f.toLowerCase();
          if (targetFunc === 'wetting') return fn.includes('wet') || fn.includes('penetrat');
          if (targetFunc === 'scouring') return fn.includes('scour') || fn.includes('deterg');
          if (targetFunc === 'desizing') return fn.includes('desiz');
          if (targetFunc === 'sequestering') return fn.includes('sequest') || fn.includes('chelat');
          if (targetFunc === 'stabilising') return fn.includes('stabilis') || fn.includes('stabiliz');
          if (targetFunc === 'levelling') return fn.includes('level');
          if (targetFunc === 'dispersing') return fn.includes('dispers');
          if (targetFunc === 'fixing') return fn.includes('fix');
          if (targetFunc === 'softening') return fn.includes('soften') || fn.includes('handle');
          if (targetFunc === 'washing-off') return fn.includes('soap') || fn.includes('wash');
          if (targetFunc === 'anti-back-staining') return fn.includes('anti-back') || fn.includes('stain');
          if (targetFunc === 'thickener') return fn.includes('thicken') || fn.includes('bind');
          return fn.includes(targetFunc);
        });
        if (!hasFunc) return false;
      }

      // 5. Fibre filter
      if (state.fibre && state.fibre !== 'all') {
        const targetFibre = state.fibre.toLowerCase();
        const hasFibre = prod.applicableFibres.some(fb => {
          const f = fb.toLowerCase();
          if (targetFibre === 'cotton') return f.includes('cotton') || f.includes('cellulos');
          if (targetFibre === 'viscose') return f.includes('viscose') || f.includes('modal') || f.includes('lyocell') || f.includes('rayon');
          if (targetFibre === 'polyester') return f.includes('poly') || f.includes('pes');
          if (targetFibre === 'nylon') return f.includes('nylon') || f.includes('polyamide') || f.includes('pa');
          if (targetFibre === 'wool') return f.includes('wool') || f.includes('silk');
          if (targetFibre === 'acrylic') return f.includes('acrylic') || f.includes('pan');
          if (targetFibre === 'blends') return f.includes('blend') || f.includes('poly-cotton') || f.includes('pc') || f.includes('pv');
          return f.includes(targetFibre);
        });
        if (!hasFibre) return false;
      }

      return true;
    });

    // Sort
    if (state.sort === 'name-asc') {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (state.sort === 'name-desc') {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      // Default cat-asc
      filteredProducts.sort((a, b) => {
        if (a.categoryId === b.categoryId) {
          return a.num - b.num;
        }
        return a.categoryId.localeCompare(b.categoryId);
      });
    }

    renderGrid();
    renderStatusRow();
  }

  function resetAllFilters() {
    state.search = '';
    state.category = 'all';
    state.stage = 'all';
    state.function = 'all';
    state.fibre = 'all';
    state.sort = 'cat-asc';

    const searchInputs = document.querySelectorAll('#textileSearchInput, #heroTextileSearchInput');
    searchInputs.forEach(i => i.value = '');

    const catSelect = document.getElementById('filterCategorySelect');
    if (catSelect) catSelect.value = 'all';

    const stageSelect = document.getElementById('filterStageSelect');
    if (stageSelect) stageSelect.value = 'all';

    const funcSelect = document.getElementById('filterFunctionSelect');
    if (funcSelect) funcSelect.value = 'all';

    const fibreSelect = document.getElementById('filterFibreSelect');
    if (fibreSelect) fibreSelect.value = 'all';

    applyFilters();
  }

  function renderStatusRow() {
    const countEl = document.getElementById('filterResultCount');
    if (countEl) {
      countEl.innerHTML = `Showing <strong>${filteredProducts.length}</strong> of <strong>${allProducts.length}</strong> textile chemical products`;
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
          <p style="font-size: 0.95rem; color: #586A7D; max-width: 500px; margin: 0 auto 20px auto;">
            We could not find any products matching your specific filter criteria. Try broadening your search or resetting all filters.
          </p>
          <button type="button" class="btn btn-primary btn-sm" onclick="window.textileResetFilters()">Clear All Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filteredProducts.map(prod => {
      const pageUrl = `./${prod.categorySlug}/${prod.slug}/index.html`;
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

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();
