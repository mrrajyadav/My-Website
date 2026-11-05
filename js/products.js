/**
 * Baburam Trading & Om Sai Enterprise
 * Product Catalogue Loader, Search & Detail Renderer
 */

(function () {
  'use strict';

  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let activeDivision = 'fmcg'; // 'fmcg' or 'chemicals'

  // Initialize Product Catalogue
  window.initProductCatalogue = async function (divisionType, containerId, categoryFilterContainerId) {
    activeDivision = divisionType;
    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const dataPath = isSubDir
      ? (divisionType === 'fmcg' ? '../data/fmcg-products.json' : '../data/chemical-products.json')
      : (divisionType === 'fmcg' ? 'data/fmcg-products.json' : 'data/chemical-products.json');

    try {
      const res = await fetch(dataPath);
      if (res.ok) {
        allProducts = await res.json();
        setupFilters(categoryFilterContainerId);
        setupSearchInput();
        renderProducts(containerId);
      } else {
        renderError(containerId, 'Unable to load product catalogue.');
      }
    } catch (e) {
      console.error('Error loading products:', e);
      renderError(containerId, 'Catalogue data temporarily unavailable.');
    }
  };

  // Render Category Filter Tabs
  function setupFilters(filterContainerId) {
    if (!filterContainerId) return;
    const container = document.getElementById(filterContainerId);
    if (!container) return;

    // Collect unique categories
    const categories = ['all', ...new Set(allProducts.map(p => p.category).filter(Boolean))];

    container.innerHTML = categories.map(cat => {
      const label = cat === 'all' ? 'All Products' : cat;
      const activeClass = cat === currentCategory ? 'active' : '';
      return `<button type="button" class="filter-btn ${activeClass}" data-category="${cat}">${label}</button>`;
    }).join('');

    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentCategory = this.getAttribute('data-category');
        renderProducts('productsGrid');
      });
    });
  }

  // Setup Search Input Listener
  function setupSearchInput() {
    const searchInput = document.getElementById('productSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
      searchQuery = (e.target.value || '').toLowerCase().trim();
      renderProducts('productsGrid');
    });
  }

  // Render Product Cards Grid
  function renderProducts(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filter products
    const filtered = allProducts.filter(item => {
      if (item.status && item.status !== 'active') return false;
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory || item.subCategory === currentCategory;
      const matchesSearch = !searchQuery ||
        item.name.toLowerCase().includes(searchQuery) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery)) ||
        (item.shortDescription && item.shortDescription.toLowerCase().includes(searchQuery)) ||
        (item.category && item.category.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: #FFFFFF; border: 1px solid var(--border-color); border-radius: var(--radius-md);">
          <h4 style="margin-bottom: 8px;">No products found</h4>
          <p style="color: var(--text-muted); font-size: 0.9375rem;">Try adjusting your category filter or search keyword.</p>
        </div>
      `;
      return;
    }

    const divisionKey = activeDivision === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';
    const detailPage = activeDivision === 'fmcg' ? 'product-details.html' : 'product-details.html';

    container.innerHTML = filtered.map(item => {
      // Relative path handling
      let imageSrc = item.image;
      if (imageSrc.startsWith('assets/')) {
        imageSrc = '../' + imageSrc;
      }

      const metaLabel = activeDivision === 'fmcg'
        ? `<span>${item.brand || 'Baburam Trading'}</span> <span aria-hidden="true">·</span> <span>${item.category}</span>`
        : `<span>${item.category}</span> ${item.subCategory ? `<span aria-hidden="true">·</span> <span>${item.subCategory}</span>` : ''}`;

      return `
        <article class="product-card">
          <div class="product-card-media">
            <img src="${imageSrc}" alt="${item.name}" loading="lazy" onerror="this.src='../assets/images/corporate/hero.jpg'">
          </div>
          <div class="product-card-body">
            <div class="product-meta-unboxed">
              ${metaLabel}
            </div>
            <h3 class="product-title">${item.name}</h3>
            <p class="product-desc">${item.shortDescription || 'Contact our sales desk for complete specifications and distribution availability.'}</p>
            <div class="product-card-actions">
              <a href="${detailPage}?id=${item.id}" class="btn btn-outline btn-sm" style="flex: 1;">View Details</a>
              <button type="button" class="btn btn-primary btn-sm" style="flex: 1;" onclick="openEnquiry('${divisionKey}', '${item.id}', '${item.name.replace(/'/g, "\\'")}', '${(item.category || '').replace(/'/g, "\\'")}')">
                Contact
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // Render Single Product Detail Page
  window.renderProductDetailPage = async function (divisionType) {
    activeDivision = divisionType;
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
    const dataPath = isSubDir
      ? (divisionType === 'fmcg' ? '../data/fmcg-products.json' : '../data/chemical-products.json')
      : (divisionType === 'fmcg' ? 'data/fmcg-products.json' : 'data/chemical-products.json');

    try {
      const res = await fetch(dataPath);
      if (!res.ok) throw new Error('Data fetch failed');
      const products = await res.json();
      const product = products.find(p => p.id === productId) || products[0];

      if (!product) {
        document.getElementById('detailContainer').innerHTML = `
          <div style="text-align: center; padding: 60px 20px;">
            <h2>Product Not Found</h2>
            <p style="margin: 16px 0 24px 0;">The requested product could not be found or has been updated.</p>
            <a href="products.html" class="btn btn-primary">Return to Catalogue</a>
          </div>
        `;
        return;
      }

      // Populate Detail View
      const divisionKey = divisionType === 'fmcg' ? 'baburamTrading' : 'omSaiEnterprise';
      document.title = `${product.name} | ${divisionType === 'fmcg' ? 'Baburam Trading' : 'Om Sai Enterprise'}`;

      let imageSrc = product.image;
      if (imageSrc.startsWith('assets/')) imageSrc = '../' + imageSrc;

      const mediaEl = document.getElementById('detailImage');
      if (mediaEl) mediaEl.src = imageSrc;

      const titleEl = document.getElementById('detailTitle');
      if (titleEl) titleEl.textContent = product.name;

      const descEl = document.getElementById('detailDesc');
      if (descEl) descEl.textContent = product.shortDescription;

      const metaEl = document.getElementById('detailMeta');
      if (metaEl) {
        metaEl.innerHTML = divisionType === 'fmcg'
          ? `<span>${product.brand || 'Partner Brand'}</span> <span aria-hidden="true">·</span> <span>${product.category}</span> <span aria-hidden="true">·</span> <span>SKU: ${product.id}</span>`
          : `<span>${product.category}</span> <span aria-hidden="true">·</span> <span>Ref: ${product.id}</span>`;
      }

      const tableEl = document.getElementById('detailTableBody');
      if (tableEl) {
        if (divisionType === 'fmcg') {
          tableEl.innerHTML = `
            <tr><th>Product Code</th><td>${product.id}</td></tr>
            <tr><th>Brand</th><td>${product.brand || 'Verified FMCG Brand'}</td></tr>
            <tr><th>Category</th><td>${product.category}</td></tr>
            <tr><th>Pack Size</th><td>${product.packSize || 'Inquire for pack sizes'}</td></tr>
            <tr><th>Shelf Life</th><td>${product.shelfLife || 'Commercial standard'}</td></tr>
            <tr><th>Storage Conditions</th><td>${product.storage || 'Ambient standard'}</td></tr>
            <tr><th>Target Channels</th><td>${product.targetChannel || 'General Trade, Modern Trade, Supermarkets'}</td></tr>
            <tr><th>Commercial Terms</th><td>Available on official distributor enquiry</td></tr>
          `;
        } else {
          tableEl.innerHTML = `
            <tr><th>Product Code</th><td>${product.id}</td></tr>
            <tr><th>Category</th><td>${product.category}</td></tr>
            <tr><th>Sub-Category</th><td>${product.subCategory || 'Industrial Specialty'}</td></tr>
            <tr><th>Target Application</th><td>${product.application || 'Textile & Industrial Processing'}</td></tr>
            <tr><th>Standard Packaging</th><td>${product.packaging || '25kg / 50kg / 200kg industrial containers'}</td></tr>
            <tr><th>Documentation (TDS/SDS)</th><td>${product.documentation || 'Available upon verified business enquiry'}</td></tr>
            <tr><th>Commercial Pricing</th><td>Available on request via trade inquiry</td></tr>
          `;
        }
      }

      // Configure CTA button
      const ctaBtn = document.getElementById('detailEnquiryBtn');
      if (ctaBtn) {
        ctaBtn.onclick = function () {
          window.openEnquiry(divisionKey, product.id, product.name, product.category);
        };
      }

    } catch (e) {
      console.error('Failed to render detail page:', e);
    }
  };

  function renderError(containerId, message) {
    const el = document.getElementById(containerId);
    if (el) {
      el.innerHTML = `<div style="grid-column: 1 / -1; padding: 32px; text-align: center; color: var(--text-muted);">${message}</div>`;
    }
  }
})();
