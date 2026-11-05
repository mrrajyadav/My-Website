/**
 * Baburam Trading & Om Sai Enterprise
 * Core JavaScript Module
 * - Asynchronous Configuration Management (race-condition free)
 * - Accessible Mobile Navigation Drawer (Escape key, outside click, aria states)
 * - Safe Dynamic Contact Display
 */

(function () {
  'use strict';

  // Default unconfigured fallback (explicitly unconfigured - NO FAKE DATA)
  const DEFAULT_CONFIG = {
    general: {
      siteTitle: 'Baburam Trading & Om Sai Enterprise',
      siteUrl: '',
      description: 'Baburam Trading (FMCG Distribution) and Om Sai Enterprise (Chemicals Specialist).',
      businessHours: 'Monday – Saturday: 9:00 AM – 6:30 PM',
      countryCode: ''
    },
    baburamTrading: {
      name: 'Baburam Trading',
      division: 'FMCG Distribution',
      tagline: 'Connecting Brands. Empowering Markets.',
      isConfigured: false,
      whatsappNumber: '',
      whatsappDisplay: '',
      email: '',
      phone: '',
      address: '',
      logoPath: 'assets/logos/baburam-trading.png'
    },
    omSaiEnterprise: {
      name: 'Om Sai Enterprise',
      tagline: 'Chemicals Specialist',
      division: 'Textile and Industrial Chemical Trading',
      isConfigured: false,
      whatsappNumber: '',
      whatsappDisplay: '',
      email: '',
      phone: '',
      address: '',
      logoPath: 'assets/logos/om-sai-enterprise.jpeg'
    }
  };

  let configPromise = null;

  // Asynchronous Config Loader returning a Promise
  window.getConfig = function () {
    if (configPromise) return configPromise;

    configPromise = new Promise(async (resolve) => {
      try {
        const isSubDir = window.location.pathname.includes('/fmcg/') || window.location.pathname.includes('/chemicals/');
        const configPath = isSubDir ? '../data/company-config.json' : 'data/company-config.json';
        const response = await fetch(configPath, { cache: 'no-cache' });
        if (response.ok) {
          const json = await response.json();
          window.APP_CONFIG = {
            general: { ...DEFAULT_CONFIG.general, ...(json.general || {}) },
            baburamTrading: { ...DEFAULT_CONFIG.baburamTrading, ...(json.baburamTrading || {}) },
            omSaiEnterprise: { ...DEFAULT_CONFIG.omSaiEnterprise, ...(json.omSaiEnterprise || {}) }
          };
        } else {
          console.warn('Configuration file not found, using default unconfigured state.');
          window.APP_CONFIG = DEFAULT_CONFIG;
        }
      } catch (e) {
        console.warn('Error reading company-config.json, using safe unconfigured state:', e);
        window.APP_CONFIG = DEFAULT_CONFIG;
      }
      resolve(window.APP_CONFIG);
    });

    return configPromise;
  };

  // Populate dynamic contact fields across pages safely without false information
  async function populateContactFields() {
    const config = await window.getConfig();
    const contactElements = document.querySelectorAll('[data-division-contact]');

    contactElements.forEach(el => {
      const divisionKey = el.getAttribute('data-division-contact');
      const divData = config[divisionKey];
      if (!divData) return;

      const isConfigured = Boolean(divData.isConfigured && (divData.phone || divData.email || divData.whatsappNumber));

      const statusBox = el.querySelector('.contact-status-notice');
      const infoList = el.querySelector('.contact-info-list');

      if (!isConfigured) {
        if (statusBox) {
          statusBox.textContent = 'Contact details are currently being updated. Please use the enquiry desk below to send your trade requirement.';
          statusBox.style.display = 'block';
        }
        if (infoList) {
          infoList.style.display = 'none';
        }
      } else {
        if (statusBox) statusBox.style.display = 'none';
        if (infoList) infoList.style.display = 'block';

        const phoneEl = el.querySelector('[data-field="phone"]');
        const emailEl = el.querySelector('[data-field="email"]');
        const addressEl = el.querySelector('[data-field="address"]');

        if (phoneEl && divData.phone) phoneEl.textContent = divData.phone;
        if (emailEl && divData.email) emailEl.textContent = divData.email;
        if (addressEl && divData.address) addressEl.textContent = divData.address;
      }
    });
  }

  // Setup Accessible Mobile Navigation Drawer
  function initMobileNav() {
    const toggle = document.querySelector('.mobile-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    }

    function closeMenu() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = nav.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when clicking nav link
    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close on Escape key press and restore focus to toggle button
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Close when clicking outside of nav drawer and toggle
    document.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
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
    window.getConfig().then(() => {
      populateContactFields();
    });
    initMobileNav();
    highlightActiveLink();
  });
})();
