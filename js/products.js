/**
 * Baburam Trading & Om Sai Enterprise
 * Reusable Product Catalogue Engine
 * - Clean API supporting options object or positional arguments
 * - Dedicated category filtering (e.g. Textile Chemicals vs Industrial Chemicals)
 * - Strict schema validation (unique IDs, active status, safe paths)
 * - Separate empty states (Catalogue updating vs Search no match with Clear Search)
 * - Safe detail rendering (strictly validates ID, no fallback to first product)
 * - Neutral SVG fallback image (no fake factory images for chemical products)
 * - Connects both desktop and mobile detail enquiry buttons
 */

(function () {
  'use strict';

  let allProducts = [];
  let currentCategory = 'all';
  let fixedCategoryFilter = null;
  let searchQuery = '';
  let activeDivision = 'chemicals';
  let activeGridId = 'chemCatalogueGrid';
  let activeFilterId = null;
  let displayLimit = 0;

  // Resolves relative asset prefix based on page depth
  function getAssetPrefix() {
    return (window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/'))
      ? '../'
      : '';
  }

  // Neutral verified fallback placeholder (zero fake packaging or factory assumptions)
  function getFallbackImage(division) {
    const prefix = getAssetPrefix();
    if (division === 'chemicals') {
      return `${prefix}assets/images/chemicals/chemical-placeholder.svg`;
    }
    return `${prefix}assets/images/fmcg/warehouse.jpg`;
  }

  // Safe path validator: rejects external javascript:, data:, or absolute protocol URLs
  function sanitizeImagePath(path, division) {
    if (!path || typeof path !== 'string') return getFallbackImage(division);
    const trimmed = path.trim();
    if (/^(https?:|\/\/|javascript:|data:)/i.test(trimmed)) {
      return getFallbackImage(division);
    }
    const prefix = getAssetPrefix();
    if (trimmed.startsWith('assets/')) {
      return prefix + trimmed;
    }
    return trimmed;
  }

  /**
   * Main Catalogue Initializer
   * Supports both:
   * 1. initProductCatalogue({ division, containerId, categoryFilter, categoryFilterTabsId, limit })
   * 2. initProductCatalogue(divisionType, containerId, categoryFilterContainerId, categoryFilter)
   */
  window.initProductCatalogue = async function (arg1, arg2, arg3, arg4) {
    if (typeof arg1 === 'object' && arg1 !== null) {
      activeDivision = arg1.division || 'chemicals';
      activeGridId = arg1.containerId || 'productsGrid';
      activeFilterId = arg1.categoryFilterTabsId || null;
      fixedCategoryFilter = arg1.categoryFilter ? arg1.categoryFilter.trim() : null;
      displayLimit = Number(arg1.limit) || 0;
    } else {
      activeDivision = arg1 || 'chemicals';
      activeGridId = arg2 || 'productsGrid';
      activeFilterId = arg3 || null;
      fixedCategoryFilter = arg4 ? arg4.trim() : null;
      displayLimit = 0;
    }

    currentCategory = fixedCategoryFilter || 'all';
    searchQuery = '';

    const prefix = getAssetPrefix();
    const dataPath = activeDivision === 'fmcg'
      ? `${prefix}data/fmcg-products.json`
      : `${prefix}data/chemical-products.json`;

    try {
      const res = await fetch(dataPath, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        allProducts = validateProductsArray(data);
        setupFilters(activeFilterId);
        setupSearchInput();
        renderProducts(activeGridId);
      } else {
        allProducts = [];
        renderEmptyCatalogue(activeGridId, 'empty');
      }
    } catch (e) {
      console.warn('Unable to load product catalogue JSON:', e);
      allProducts = [];
      renderEmptyCatalogue(activeGridId, 'empty');
    }
  };

  // Backwards compatibility alias
  window.initProductCatalog = window.initProductCatalogue;

  // Validate product records against schema requirements
  function validateProductsArray(data) {
    if (!Array.isArray(data)) return [];

    const seenIds = new Set();
    const valid = [];

    data.forEach((item, index) => {
      if (!item || typeof item !== 'object') return;

      const id = String(item.id || '').trim();
      const name = String(item.name || '').trim();
      const category = String(item.category || '').trim();
      const status = String(item.status || 'active').trim().toLowerCase();

      // Require valid ID, name, category, and unique active item
      if (!id || !name || !category) {
        console.warn(`Product record at index ${index} skipped: missing required fields (id, name, category).`);
        return;
      }

      if (seenIds.has(id)) {
        console.warn(`Duplicate product ID "${id}" detected at index ${index}. Skipped for integrity.`);
        return;
      }
      seenIds.add(id);

      valid.push({
        id: id,
        name: name,
        category: category,
        subCategory: item.subCategory ? String(item.subCategory).trim() : '',
        brand: item.brand ? String(item.brand).trim() : '',
        image: item.image ? String(item.image).trim() : '',
        shortDescription: item.shortDescription ? String(item.shortDescription).trim() : '',
        status: status
      });
    });

    return valid;
  }

  // Setup Dynamic Category Filter Tabs (only when tabs container exists and no fixed category is locked)
  function setupFilters(filterContainerId) {
    if (!filterContainerId) return;
    const container = document.getElementById(filterContainerId);
    if (!container) return;

    container.innerHTML = '';

    // If fixed category is locked (e.g. Textile or Industrial page), hide the tabs
    if (fixedCategoryFilter) {
      container.style.display = 'none';
      return;
    }

    const activeList = allProducts.filter(p => p.status === 'active');
    if (activeList.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'flex';
    const categories = ['all', ...new Set(activeList.map(p => p.category).filter(Boolean))];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `filter-btn ${cat === currentCategory ? 'active' : ''}`;
      btn.textContent = cat === 'all' ? 'All Products' : cat;
      btn.setAttribute('data-category', cat);

      btn.addEventListener('click', function () {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = cat;
        renderProducts(activeGridId);
      });

      container.appendChild(btn);
    });
  }

  // Setup Search Input with dynamic debounce/input listener
  function setupSearchInput() {
    const searchInput = document.getElementById('productSearchInput');
    if (!searchInput) return;

    // Remove any cloned duplicate listeners
    const newInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newInput, searchInput);

    newInput.addEventListener('input', function (e) {
      searchQuery = (e.target.value || '').toLowerCase().trim();
      renderProducts(activeGridId);
    });
  }

  // Clear search and reset view
  window.clearProductSearch = function () {
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) searchInput.value = '';
    searchQuery = '';
    renderProducts(activeGridId);
  };

  // Render Product Cards Grid safely
  function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // Determine total active products available in this division/category
    const pool = allProducts.filter(item => {
      if (item.status !== 'active') return false;
      if (fixedCategoryFilter) {
        return item.category.toLowerCase() === fixedCategoryFilter.toLowerCase();
      }
      return true;
    });

    // If whole catalogue or locked category has 0 published active products -> Condition A
    if (pool.length === 0) {
      renderEmptyCatalogue(containerId, 'empty');
      return;
    }

    // Filter by active category tab and search query
    const filtered = pool.filter(item => {
      const matchesCategory = currentCategory === 'all' ||
        item.category.toLowerCase() === currentCategory.toLowerCase() ||
        (item.subCategory && item.subCategory.toLowerCase() === currentCategory.toLowerCase());

      if (!matchesCategory) return false;

      if (!searchQuery) return true;

      const nameMatch = item.name.toLowerCase().includes(searchQuery);
      const brandMatch = item.brand.toLowerCase().includes(searchQuery);
      const descMatch = item.shortDescription.toLowerCase().includes(searchQuery);
      const catMatch = item.category.toLowerCase().includes(searchQuery);
      const subCatMatch = item.subCategory.toLowerCase().includes(searchQuery);

      return nameMatch || brandMatch || descMatch || catMatch || subCatMatch;
    });

    // If catalogue has items but search returned nothing -> Condition B (No Match)
    if (filtered.length === 0) {
      renderEmptyCatalogue(containerId, 'no-match');
      return;
    }

    const itemsToRender = displayLimit > 0 ? filtered.slice(0, displayLimit) : filtered;
    const detailPage = 'product-details.html';
    const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';

    itemsToRender.forEach(item => {
      const card = document.createElement('article');
      card.className = 'product-card';

      // Media
      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'product-card-media';

      const img = document.createElement('img');
      const fallbackSrc = getFallbackImage(activeDivision);
      img.src = sanitizeImagePath(item.image, activeDivision);
      img.alt = item.name;
      img.loading = 'lazy';
      img.onerror = function () {
        this.onerror = null;
        this.src = fallbackSrc;
      };
      mediaDiv.appendChild(img);
      card.appendChild(mediaDiv);

      // Body
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'product-card-body';

      const metaDiv = document.createElement('div');
      metaDiv.className = 'product-meta-unboxed';
      metaDiv.textContent = item.subCategory || item.category;
      bodyDiv.appendChild(metaDiv);

      const title = document.createElement('h3');
      title.className = 'product-title';
      title.textContent = item.name;
      bodyDiv.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'product-desc';
      desc.textContent = item.shortDescription || (activeDivision === 'chemicals'
        ? 'Verified chemical formulation. Inquire for technical documentation, TDS, and commercial packaging.'
        : 'Contact our sales desk for complete specifications and trade distribution details.');
      bodyDiv.appendChild(desc);

      // Actions
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'product-card-actions';

      const detailLink = document.createElement('a');
      detailLink.className = 'btn btn-outline btn-sm';
      detailLink.style.flex = '1';
      detailLink.textContent = 'View Details';
      detailLink.href = `${detailPage}?id=${encodeURIComponent(item.id)}`;
      actionsDiv.appendChild(detailLink);

      const contactBtn = document.createElement('button');
      contactBtn.type = 'button';
      contactBtn.className = 'btn btn-primary btn-sm';
      contactBtn.style.flex = '1';
      contactBtn.textContent = 'Contact for Details';
      contactBtn.addEventListener('click', function () {
        if (typeof window.openEnquiry === 'function') {
          window.openEnquiry(divisionKey, item.id, item.name, item.category);
        }
      });
      actionsDiv.appendChild(contactBtn);

      bodyDiv.appendChild(actionsDiv);
      card.appendChild(bodyDiv);
      container.appendChild(card);
    });
  }

  /**
   * Distinguish between:
   * A. 'empty' -> Catalogue has no published products
   * B. 'no-match' -> Search returned no matching products
   */
  function renderEmptyCatalogue(containerId, reason) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const divisionName = activeDivision === 'fmcg' ? 'Baburam Trading' : 'Om Sai Enterprise';
    const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';

    if (reason === 'no-match') {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; border-radius: var(--radius-sm); background-color: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h4 style="margin-bottom: 8px; font-size: 1.25rem;">No Matching Products Found</h4>
          <p style="color: var(--text-muted); font-size: 1rem; max-width: 520px; margin: 0 auto 20px auto; line-height: 1.6;">
            No matching products found. Try another chemical name or category.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" onclick="window.clearProductSearch()">
              Clear Search
            </button>
            <button type="button" class="btn btn-primary" onclick="window.openEnquiry('${divisionKey}', '', 'Custom Chemical Sourcing Request', '')">
              Inquire for Custom Sourcing
            </button>
          </div>
        </div>
      `;
    } else {
      // Condition A: Catalogue is updating
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 56px 24px; text-align: center; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; border-radius: var(--radius-sm); background-color: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h4 style="margin-bottom: 8px; font-size: 1.25rem;">Product Information Updating</h4>
          <p style="color: var(--text-muted); font-size: 1rem; max-width: 580px; margin: 0 auto 24px auto; line-height: 1.6;">
            Product catalogue is currently being updated. Please contact ${divisionName} for product availability.
          </p>
          <div>
            <button type="button" class="btn btn-primary" onclick="window.openEnquiry('${divisionKey}', '', 'Catalogue Inquiry', '')">
              Contact ${divisionName} for Details
            </button>
          </div>
        </div>
      `;
    }
  }

  // Render Single Product Detail Page
  window.renderProductDetailPage = async function (divisionType) {
    activeDivision = divisionType || 'chemicals';
    const container = document.getElementById('detailContainer');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Missing ID entirely
    if (!productId || !productId.trim()) {
      renderProductNotFound(container);
      return;
    }

    const prefix = getAssetPrefix();
    const dataPath = activeDivision === 'fmcg'
      ? `${prefix}data/fmcg-products.json`
      : `${prefix}data/chemical-products.json`;

    try {
      const res = await fetch(dataPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Data fetch failed');
      const rawProducts = await res.json();
      const products = validateProductsArray(rawProducts);

      if (products.length === 0) {
        renderProductNotFound(container);
        return;
      }

      // STRICT LOOKUP: Must match exact ID and status MUST be active
      const product = products.find(p => p.id.toLowerCase() === productId.trim().toLowerCase() && p.status === 'active');

      // STRICT: NEVER fallback to products[0]
      if (!product) {
        renderProductNotFound(container);
        return;
      }

      const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';
      const divisionTitle = activeDivision === 'fmcg' ? 'Baburam Trading' : 'Om Sai Enterprise';
      document.title = `${product.name} | ${divisionTitle}`;

      const mediaEl = document.getElementById('detailImage');
      if (mediaEl) {
        const fallbackSrc = getFallbackImage(activeDivision);
        mediaEl.src = sanitizeImagePath(product.image, activeDivision);
        mediaEl.alt = product.name;
        mediaEl.onerror = function () {
          this.onerror = null;
          this.src = fallbackSrc;
        };
      }

      const titleEl = document.getElementById('detailTitle');
      if (titleEl) titleEl.textContent = product.name;

      const descEl = document.getElementById('detailDesc');
      if (descEl) {
        descEl.textContent = product.shortDescription ||
          (activeDivision === 'chemicals'
            ? 'Verified chemical formulation. Inquire for technical documentation, TDS, and commercial packaging options.'
            : 'Please contact our team for verified availability and commercial trade details.');
      }

      const metaEl = document.getElementById('detailMeta');
      if (metaEl) {
        metaEl.textContent = product.subCategory ? `${product.category} • ${product.subCategory}` : product.category;
      }

      // Hide/clear any public technical specs table to comply with strict public information policy
      const tableEl = document.getElementById('detailTableBody');
      if (tableEl) {
        tableEl.innerHTML = '';
        const tableWrapper = tableEl.closest('table');
        if (tableWrapper) tableWrapper.style.display = 'none';
      }

      // Connect DESKTOP enquiry button
      const ctaBtn = document.getElementById('detailEnquiryBtn');
      if (ctaBtn) {
        ctaBtn.onclick = function () {
          if (typeof window.openEnquiry === 'function') {
            window.openEnquiry(divisionKey, product.id, product.name, product.category);
          }
        };
      }

      // Connect MOBILE navigation enquiry button (Bug fix for mobileChemDetailBtn)
      const mobileDetailBtn = document.getElementById('mobileChemDetailBtn') || document.getElementById('mobileFmcgDetailBtn');
      if (mobileDetailBtn) {
        mobileDetailBtn.onclick = function () {
          if (typeof window.openEnquiry === 'function') {
            window.openEnquiry(divisionKey, product.id, product.name, product.category);
          }
        };
      }

    } catch (e) {
      console.warn('Error rendering product detail:', e);
      renderProductNotFound(container);
    }
  };

  // Safe "Product Not Found" screen
  function renderProductNotFound(container) {
    const returnUrl = activeDivision === 'fmcg' ? 'products.html' : 'products.html';
    const contactUrl = activeDivision === 'fmcg' ? 'contact.html' : 'contact.html';

    container.innerHTML = `
      <div style="text-align: center; padding: 72px 24px; max-width: 600px; margin: 0 auto;">
        <div style="width: 48px; height: 48px; margin: 0 auto 16px auto; border-radius: var(--radius-sm); background-color: var(--bg-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary);">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2 style="font-size: 1.85rem; margin-bottom: 12px;">Product Not Found</h2>
        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.6; margin-bottom: 28px;">
          The requested product could not be found, is inactive, or has been updated. Please return to the product catalogue or contact our team for assistance.
        </p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <a href="${returnUrl}" class="btn btn-primary">Return to Catalogue</a>
          <a href="${contactUrl}" class="btn btn-outline">Contact Sales Desk</a>
        </div>
      </div>
    `;
  }
})();
