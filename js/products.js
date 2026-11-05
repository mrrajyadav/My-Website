/**
 * Baburam Trading & Om Sai Enterprise
 * Product Catalogue Loader, Search, Category Filter & Safe Detail Renderer
 */

(function () {
  'use strict';

  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let activeDivision = 'fmcg';
  let activeGridId = 'productsGrid';
  let activeFilterId = 'categoryFilterTabs';

  // Fallback image paths
  function getFallbackImage(division) {
    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const prefix = isSubDir ? '../' : '';
    return division === 'fmcg'
      ? `${prefix}assets/images/fmcg/warehouse.jpg`
      : `${prefix}assets/images/chemicals/facility.jpg`;
  }

  // Initialize Product Catalogue
  window.initProductCatalogue = async function (divisionType, containerId, categoryFilterContainerId) {
    activeDivision = divisionType || 'fmcg';
    activeGridId = containerId || 'productsGrid';
    activeFilterId = categoryFilterContainerId || 'categoryFilterTabs';

    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const dataPath = isSubDir
      ? (activeDivision === 'fmcg' ? '../data/fmcg-products.json' : '../data/chemical-products.json')
      : (activeDivision === 'fmcg' ? 'data/fmcg-products.json' : 'data/chemical-products.json');

    try {
      const res = await fetch(dataPath, { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        allProducts = Array.isArray(data) ? data : [];
        setupFilters(activeFilterId);
        setupSearchInput();
        renderProducts(activeGridId);
      } else {
        renderEmptyCatalogue(activeGridId);
      }
    } catch (e) {
      console.warn('Unable to load product catalog JSON:', e);
      renderEmptyCatalogue(activeGridId);
    }
  };

  // Render Category Filter Tabs
  function setupFilters(filterContainerId) {
    if (!filterContainerId) return;
    const container = document.getElementById(filterContainerId);
    if (!container) return;

    container.innerHTML = '';

    const activeList = allProducts.filter(p => p && p.status === 'active');
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

  // Setup Search Input Listener
  function setupSearchInput() {
    const searchInput = document.getElementById('productSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
      searchQuery = (e.target.value || '').toLowerCase().trim();
      renderProducts(activeGridId);
    });
  }

  // Render Product Cards Grid
  function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    // Filter only active verified products
    const filtered = allProducts.filter(item => {
      if (!item || item.status !== 'active') return false;
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory || item.subCategory === currentCategory;
      const nameMatch = (item.name || '').toLowerCase().includes(searchQuery);
      const brandMatch = (item.brand || '').toLowerCase().includes(searchQuery);
      const descMatch = (item.shortDescription || '').toLowerCase().includes(searchQuery);
      const catMatch = (item.category || '').toLowerCase().includes(searchQuery);
      const matchesSearch = !searchQuery || nameMatch || brandMatch || descMatch || catMatch;

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      renderEmptyCatalogue(containerId);
      return;
    }

    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const prefix = isSubDir ? '../' : '';
    const detailPage = 'product-details.html';
    const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'product-card';

      // Media
      const mediaDiv = document.createElement('div');
      mediaDiv.className = 'product-card-media';

      const img = document.createElement('img');
      let imgSrc = item.image || '';
      if (imgSrc.startsWith('assets/')) {
        imgSrc = prefix + imgSrc;
      }
      img.src = imgSrc || getFallbackImage(activeDivision);
      img.alt = item.name || 'Product Image';
      img.loading = 'lazy';
      img.onerror = function () {
        this.src = getFallbackImage(activeDivision);
      };
      mediaDiv.appendChild(img);
      card.appendChild(mediaDiv);

      // Body
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'product-card-body';

      const metaDiv = document.createElement('div');
      metaDiv.className = 'product-meta-unboxed';
      if (activeDivision === 'fmcg') {
        metaDiv.textContent = item.category || 'Consumer Goods';
      } else {
        metaDiv.textContent = item.category || 'Industrial Chemicals';
      }
      bodyDiv.appendChild(metaDiv);

      const title = document.createElement('h3');
      title.className = 'product-title';
      title.textContent = item.name || 'Verified Product';
      bodyDiv.appendChild(title);

      const desc = document.createElement('p');
      desc.className = 'product-desc';
      desc.textContent = item.shortDescription || 'Contact our sales desk for complete specifications and trade distribution details.';
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

  // Professional Empty State as explicitly required by prompt
  function renderEmptyCatalogue(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

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
          Product information is currently being updated. Please contact our team for product details and availability.
        </p>
        <div>
          <button type="button" class="btn btn-primary" onclick="window.openEnquiry('${activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise'}', '', 'Catalogue Inquiry', '')">
            Contact Trade Desk for Availability
          </button>
        </div>
      </div>
    `;
  }

  // Render Single Product Detail Page
  // RULES:
  // 1. NEVER show first product when invalid ID is requested.
  // 2. Show only: Product Name, Image, Category, Short Description, Enquiry Button.
  // 3. No public pricing, pack size, shelf life, or technical chemical specifications tables.
  window.renderProductDetailPage = async function (divisionType) {
    activeDivision = divisionType || 'fmcg';
    const container = document.getElementById('detailContainer');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // If ID is missing entirely
    if (!productId || !productId.trim()) {
      renderProductNotFound(container);
      return;
    }

    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const dataPath = isSubDir
      ? (activeDivision === 'fmcg' ? '../data/fmcg-products.json' : '../data/chemical-products.json')
      : (activeDivision === 'fmcg' ? 'data/fmcg-products.json' : 'data/chemical-products.json');

    try {
      const res = await fetch(dataPath, { cache: 'no-cache' });
      if (!res.ok) throw new Error('Data fetch failed');
      const products = await res.json();

      if (!Array.isArray(products) || products.length === 0) {
        renderProductNotFound(container);
        return;
      }

      // STRICT LOOKUP: Must match exact ID and status MUST be active
      const product = products.find(p => p && p.id === productId.trim() && p.status === 'active');

      // DO NOT fallback to products[0]!
      if (!product) {
        renderProductNotFound(container);
        return;
      }

      // Safe populate detail view
      const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';
      document.title = `${product.name} | ${activeDivision === 'fmcg' ? 'Baburam Trading' : 'Om Sai Enterprise'}`;

      let imageSrc = product.image || '';
      if (imageSrc.startsWith('assets/')) {
        imageSrc = (isSubDir ? '../' : '') + imageSrc;
      }

      const mediaEl = document.getElementById('detailImage');
      if (mediaEl) {
        mediaEl.src = imageSrc || getFallbackImage(activeDivision);
        mediaEl.alt = product.name || 'Product Image';
        mediaEl.onerror = function () {
          this.src = getFallbackImage(activeDivision);
        };
      }

      const titleEl = document.getElementById('detailTitle');
      if (titleEl) titleEl.textContent = product.name || '';

      const descEl = document.getElementById('detailDesc');
      if (descEl) descEl.textContent = product.shortDescription || 'Please contact our team for verified availability and commercial trade details.';

      const metaEl = document.getElementById('detailMeta');
      if (metaEl) {
        metaEl.textContent = product.category || (activeDivision === 'fmcg' ? 'FMCG Distribution' : 'Chemical Trading');
      }

      // Ensure any table is removed or cleared so public tables never leak
      const tableEl = document.getElementById('detailTableBody');
      if (tableEl) {
        tableEl.innerHTML = '';
        const tableWrapper = tableEl.closest('table');
        if (tableWrapper) tableWrapper.style.display = 'none';
      }

      // Configure CTA button safely
      const ctaBtn = document.getElementById('detailEnquiryBtn');
      if (ctaBtn) {
        ctaBtn.onclick = function () {
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
          <a href="products.html" class="btn btn-primary">Return to Catalogue</a>
          <a href="contact.html" class="btn btn-outline">Contact Sales Desk</a>
        </div>
      </div>
    `;
  }
})();
