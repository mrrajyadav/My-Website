/**
 * Baburam Trading & Om Sai Enterprise
 * Core JavaScript Module
 */

(function () {
  'use strict';

  // Global Company Config Cache
  window.APP_CONFIG = null;

  // Fetch Company Config
  async function loadCompanyConfig() {
    try {
      // Determine root path prefix based on whether current page is in subdirectory
      const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
      const configPath = isSubDir ? '../data/company-config.json' : 'data/company-config.json';
      const response = await fetch(configPath);
      if (response.ok) {
        window.APP_CONFIG = await response.json();
      }
    } catch (e) {
      console.warn('Config loaded from default fallback:', e);
    }
  }

  // Setup Mobile Navigation Drawer
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close when clicking nav link
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
      });
    });
  }

  // Highlight Active Link
  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath === ''))) {
        link.classList.add('active');
      }
    });
  }

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', () => {
    loadCompanyConfig();
    initMobileNav();
    highlightActiveLink();
  });
})();
