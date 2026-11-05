/**
 * Baburam Trading & Om Sai Enterprise
 * Static Trade Enquiry Engine
 * - Zero double entry
 * - Browser-safe synchronous tab opening for WhatsApp (prevents popup blockers)
 * - Safe validation with reportValidity support
 * - Strict verification of division configuration status
 * - Explicit disclosure: external messaging app opens with pre-filled draft
 * - Keyboard accessible modal (ESC key, outside click, clean reset)
 */

(function () {
  'use strict';

  let currentEnquiry = {
    division: 'omSaiEnterprise',
    divisionLabel: 'Om Sai Enterprise – Chemicals Specialist',
    productId: '',
    productName: '',
    category: ''
  };

  let lastActiveElement = null;

  // Open Enquiry Modal (optionally with pre-filled fields)
  window.openEnquiry = function (divisionKey, productId, productName, category, prefilled) {
    lastActiveElement = document.activeElement;

    currentEnquiry.division = divisionKey || 'omSaiEnterprise';
    currentEnquiry.productId = (productId || '').trim();
    currentEnquiry.productName = (productName || 'General Trade Inquiry').trim();
    currentEnquiry.category = (category || '').trim();

    if (currentEnquiry.division === 'baburamTrading') {
      currentEnquiry.divisionLabel = 'Baburam Trading – FMCG Distribution';
    } else {
      currentEnquiry.divisionLabel = 'Om Sai Enterprise – Chemicals Specialist';
    }

    const modal = document.getElementById('enquiryModal');
    if (!modal) return;

    // Reset stale fields first
    const nameInput = document.getElementById('enquiryName');
    const companyInput = document.getElementById('enquiryCompany');
    const phoneInput = document.getElementById('enquiryPhone');
    const emailInput = document.getElementById('enquiryEmail');
    const messageInput = document.getElementById('enquiryMessage');
    const hiddenProduct = document.getElementById('enquiryProductId');

    if (!prefilled) {
      if (messageInput) messageInput.value = '';
    }

    // Populate modal context labels
    const divisionEl = document.getElementById('modalDivisionLabel');
    const productEl = document.getElementById('modalProductLabel');

    if (divisionEl) divisionEl.textContent = currentEnquiry.divisionLabel;
    if (productEl) {
      productEl.textContent = currentEnquiry.productId
        ? `${currentEnquiry.productName} (Item Code: ${currentEnquiry.productId})`
        : currentEnquiry.productName;
    }
    if (hiddenProduct) hiddenProduct.value = currentEnquiry.productId;

    // If pre-filled data provided, populate inputs
    if (prefilled) {
      if (prefilled.name && nameInput) nameInput.value = prefilled.name;
      if (prefilled.company && companyInput) companyInput.value = prefilled.company;
      if (prefilled.phone && phoneInput) phoneInput.value = prefilled.phone;
      if (prefilled.email && emailInput) emailInput.value = prefilled.email;
      if (prefilled.message && messageInput) messageInput.value = prefilled.message;
    }

    // Reset alert box
    const alertBox = document.getElementById('modalAlertBox');
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Set focus to the first interactive field
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 100);
  };

  // Close Enquiry Modal
  window.closeEnquiry = function () {
    const modal = document.getElementById('enquiryModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  };

  /**
   * Common Direct Submission Engine
   * Validates form and opens WhatsApp or Mail client
   */
  window.processTradeEnquiry = async function (options) {
    const {
      division,
      productId,
      productName,
      name,
      company,
      phone,
      email,
      requirement,
      channel, // 'whatsapp' | 'email'
      alertElementId,
      newTab // Optional pre-opened blank window for popup-blocker safety
    } = options;

    function showAlert(text, type) {
      if (alertElementId) {
        const el = document.getElementById(alertElementId);
        if (el) {
          el.textContent = text;
          el.style.display = 'block';
          if (type === 'error') {
            el.style.backgroundColor = '#FDF2F2';
            el.style.color = '#991B1B';
            el.style.border = '1px solid #F87171';
          } else {
            el.style.backgroundColor = '#F0FDF4';
            el.style.color = '#166534';
            el.style.border = '1px solid #86EFAC';
          }
        }
      } else {
        alert(text);
      }
    }

    function abortSubmission(errorMsg) {
      if (newTab && typeof newTab.close === 'function') {
        try {
          newTab.close();
        } catch (e) {
          // ignore
        }
      }
      showAlert(errorMsg, 'error');
    }

    // Input Validation
    const trimmedName = (name || '').trim();
    const trimmedCompany = (company || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedReq = (requirement || '').trim();

    if (!trimmedName) {
      abortSubmission('Please enter your full contact name.');
      return false;
    }
    if (!trimmedCompany) {
      abortSubmission('Please enter your company or mill name.');
      return false;
    }
    if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 8) {
      abortSubmission('Please enter a valid phone number (at least 8 digits).');
      return false;
    }
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      abortSubmission('Please enter a valid email address or leave it empty.');
      return false;
    }

    // Verify configuration
    let config = null;
    try {
      config = await window.getConfig();
    } catch (e) {
      console.warn('Config fetch error:', e);
    }

    const divKey = division || 'omSaiEnterprise';
    const divConfig = config ? config[divKey] : null;

    if (!divConfig || !divConfig.isConfigured) {
      const displayBiz = divConfig ? divConfig.name : (divKey === 'baburamTrading' ? 'Baburam Trading' : 'Om Sai Enterprise');
      abortSubmission(
        `Direct digital enquiry for ${displayBiz} is currently paused while official business channels are being configured in company-config.json. Please check back shortly.`
      );
      return false;
    }

    const divisionName = divConfig.name || (divKey === 'baburamTrading' ? 'Baburam Trading' : 'Om Sai Enterprise');

    if (channel === 'whatsapp') {
      const destNumber = (divConfig.whatsappNumber || '').replace(/\D/g, '');
      if (!destNumber) {
        abortSubmission(`WhatsApp contact number for ${divisionName} is not yet configured. Please use email or contact directly.`);
        return false;
      }

      const lines = [
        `*Trade Enquiry - ${divisionName}*`,
        `---------------------------------`,
        productName ? `*Subject/Product:* ${productName} ${productId ? `(Code: ${productId})` : ''}` : `*Subject:* Chemical Supply & Sourcing Inquiry`,
        `*Contact Person:* ${trimmedName}`,
        `*Company Name:* ${trimmedCompany}`,
        `*Phone:* ${trimmedPhone}`,
        trimmedEmail ? `*Email:* ${trimmedEmail}` : '',
        `*Requirement:* ${trimmedReq || 'Please provide commercial specifications, TDS availability, and ordering terms.'}`
      ].filter(Boolean);

      const encoded = encodeURIComponent(lines.join('\n'));
      const whatsappUrl = `https://wa.me/${destNumber}?text=${encoded}`;

      showAlert('WhatsApp application is opening with your pre-filled inquiry. Please review and click Send in WhatsApp.', 'success');

      if (newTab && typeof newTab.location !== 'undefined') {
        newTab.location.href = whatsappUrl;
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
      return true;

    } else if (channel === 'email') {
      const destEmail = (divConfig.email || '').trim();
      if (!destEmail) {
        abortSubmission(`Official email address for ${divisionName} is not yet configured. Please check back shortly.`);
        return false;
      }

      const subject = `Trade Enquiry: ${productName || 'B2B Sourcing'} - ${trimmedCompany}`;
      const body = `Dear ${divisionName} Sales Desk,

I would like to submit a commercial trade enquiry.

Subject / Product: ${productName || 'General Sourcing Inquiry'} ${productId ? `(Code: ${productId})` : ''}
Company Name: ${trimmedCompany}
Contact Person: ${trimmedName}
Phone Number: ${trimmedPhone}
Email: ${trimmedEmail || 'N/A'}

Requirement Details:
${trimmedReq || 'Please provide technical specifications, availability, and commercial terms.'}

Note: Sent from corporate static trade desk.`;

      const mailtoUrl = `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showAlert('Your email client is opening with a pre-filled draft. Please review and press Send.', 'success');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 250);
      return true;
    }

    return false;
  };

  // Modal Submit Handlers
  window.sendWhatsAppEnquiry = function () {
    const form = document.getElementById('enquiryForm');
    if (form && typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }

    // Synchronously open blank window to defeat popup blockers
    let newTab = null;
    try {
      newTab = window.open('about:blank', '_blank');
    } catch (e) {
      newTab = null;
    }

    const name = document.getElementById('enquiryName')?.value;
    const company = document.getElementById('enquiryCompany')?.value;
    const phone = document.getElementById('enquiryPhone')?.value;
    const email = document.getElementById('enquiryEmail')?.value;
    const requirement = document.getElementById('enquiryMessage')?.value;
    const productId = document.getElementById('enquiryProductId')?.value || currentEnquiry.productId;

    window.processTradeEnquiry({
      division: currentEnquiry.division,
      productId: productId,
      productName: currentEnquiry.productName,
      name,
      company,
      phone,
      email,
      requirement,
      channel: 'whatsapp',
      alertElementId: 'modalAlertBox',
      newTab: newTab
    });
  };

  window.sendEmailEnquiry = function () {
    const form = document.getElementById('enquiryForm');
    if (form && typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }

    const name = document.getElementById('enquiryName')?.value;
    const company = document.getElementById('enquiryCompany')?.value;
    const phone = document.getElementById('enquiryPhone')?.value;
    const email = document.getElementById('enquiryEmail')?.value;
    const requirement = document.getElementById('enquiryMessage')?.value;
    const productId = document.getElementById('enquiryProductId')?.value || currentEnquiry.productId;

    window.processTradeEnquiry({
      division: currentEnquiry.division,
      productId: productId,
      productName: currentEnquiry.productName,
      name,
      company,
      phone,
      email,
      requirement,
      channel: 'email',
      alertElementId: 'modalAlertBox'
    });
  };

  // Keyboard accessibility: ESC key to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      window.closeEnquiry();
    }
  });

  // Click outside modal dialog to close
  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          window.closeEnquiry();
        }
      });
    }
  });
})();
