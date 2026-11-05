/**
 * Baburam Trading & Om Sai Enterprise
 * Static Trade Enquiry Engine
 * - Zero double entry
 * - Validated WhatsApp & Mailto encoding
 * - Respects configuration status (NO FAKE FALLBACKS)
 * - Clear disclosure: opens external application, no fake database
 */

(function () {
  'use strict';

  let currentEnquiry = {
    division: 'baburamTrading',
    divisionLabel: 'Baburam Trading (FMCG Distribution)',
    productId: '',
    productName: '',
    category: ''
  };

  // Open Enquiry Modal (optionally with pre-filled fields from another form)
  window.openEnquiry = function (divisionKey, productId, productName, category, prefilled) {
    currentEnquiry.division = divisionKey || 'baburamTrading';
    currentEnquiry.productId = productId || '';
    currentEnquiry.productName = productName || 'General Trade Inquiry';
    currentEnquiry.category = category || '';

    if (currentEnquiry.division === 'baburamTrading') {
      currentEnquiry.divisionLabel = 'Baburam Trading – FMCG Distribution';
    } else {
      currentEnquiry.divisionLabel = 'Om Sai Enterprise – Chemicals Specialist';
    }

    const modal = document.getElementById('enquiryModal');
    if (!modal) return;

    // Populate modal fields
    const divisionEl = document.getElementById('modalDivisionLabel');
    const productEl = document.getElementById('modalProductLabel');
    const hiddenProduct = document.getElementById('enquiryProductId');

    if (divisionEl) divisionEl.textContent = currentEnquiry.divisionLabel;
    if (productEl) {
      productEl.textContent = currentEnquiry.productId
        ? `${currentEnquiry.productName} (Code: ${currentEnquiry.productId})`
        : currentEnquiry.productName;
    }
    if (hiddenProduct) hiddenProduct.value = currentEnquiry.productId;

    // If prefilled data provided, fill them in
    if (prefilled) {
      if (prefilled.name && document.getElementById('enquiryName')) document.getElementById('enquiryName').value = prefilled.name;
      if (prefilled.company && document.getElementById('enquiryCompany')) document.getElementById('enquiryCompany').value = prefilled.company;
      if (prefilled.phone && document.getElementById('enquiryPhone')) document.getElementById('enquiryPhone').value = prefilled.phone;
      if (prefilled.email && document.getElementById('enquiryEmail')) document.getElementById('enquiryEmail').value = prefilled.email;
      if (prefilled.message && document.getElementById('enquiryMessage')) document.getElementById('enquiryMessage').value = prefilled.message;
    }

    // Reset alert
    const alertBox = document.getElementById('modalAlertBox');
    if (alertBox) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    }

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  // Close Enquiry Modal
  window.closeEnquiry = function () {
    const modal = document.getElementById('enquiryModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Common Direct Submission Engine used by both Modal and Inline Page Forms
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
      alertElementId
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

    // Validation
    const trimmedName = (name || '').trim();
    const trimmedCompany = (company || '').trim();
    const trimmedPhone = (phone || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedReq = (requirement || '').trim();

    if (!trimmedName) {
      showAlert('Please enter your full name.', 'error');
      return false;
    }
    if (!trimmedCompany) {
      showAlert('Please enter your business or company name.', 'error');
      return false;
    }
    if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 8) {
      showAlert('Please enter a valid contact phone or WhatsApp number (at least 8 digits).', 'error');
      return false;
    }
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      showAlert('Please enter a valid email address, or leave it blank.', 'error');
      return false;
    }

    // Fetch and verify configuration
    const config = await window.getConfig();
    const divConfig = config ? config[division] : null;

    if (!divConfig || !divConfig.isConfigured) {
      showAlert(
        `Contact information for ${divConfig ? divConfig.name : division} is currently being updated in data/company-config.json. Please contact the administrator directly.`,
        'error'
      );
      return false;
    }

    const divisionName = divConfig.name || (division === 'baburamTrading' ? 'Baburam Trading' : 'Om Sai Enterprise');

    if (channel === 'whatsapp') {
      const destNumber = (divConfig.whatsappNumber || '').replace(/\D/g, '');
      if (!destNumber) {
        showAlert(`WhatsApp contact number for ${divisionName} is not yet configured. Please use email or check back shortly.`, 'error');
        return false;
      }

      const lines = [
        `*Trade Enquiry - ${divisionName}*`,
        `---------------------------------`,
        productName ? `*Subject/Product:* ${productName} ${productId ? `(Code: ${productId})` : ''}` : `*Subject:* Commercial Supply & Distribution`,
        `*Contact Person:* ${trimmedName}`,
        `*Company Name:* ${trimmedCompany}`,
        `*Phone:* ${trimmedPhone}`,
        trimmedEmail ? `*Email:* ${trimmedEmail}` : '',
        `*Requirement:* ${trimmedReq || 'Please provide commercial terms, availability, and ordering details.'}`
      ].filter(Boolean);

      const encoded = encodeURIComponent(lines.join('\n'));
      const whatsappUrl = `https://wa.me/${destNumber}?text=${encoded}`;

      showAlert('Opening WhatsApp with your prefilled enquiry. Please click Send in WhatsApp to complete your message.', 'success');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 350);
      return true;

    } else if (channel === 'email') {
      const destEmail = (divConfig.email || '').trim();
      if (!destEmail) {
        showAlert(`Official email for ${divisionName} is not yet configured. Please check back shortly.`, 'error');
        return false;
      }

      const subject = `Trade Enquiry: ${productName || 'B2B Sourcing'} - ${trimmedCompany}`;
      const body = `Dear Sales Desk,

I would like to submit a formal trade enquiry with ${divisionName}.

Subject / Product: ${productName || 'General Trade Inquiry'} ${productId ? `(Code: ${productId})` : ''}
Company: ${trimmedCompany}
Contact Person: ${trimmedName}
Phone Number: ${trimmedPhone}
Email: ${trimmedEmail || 'N/A'}

Requirement Details:
${trimmedReq || 'Please share product specifications, availability, and commercial terms.'}

Note: Sent from static corporate website inquiry desk.`;

      const mailtoUrl = `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      showAlert('Opening your email application with the prefilled inquiry. Please review and press Send.', 'success');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 350);
      return true;
    }

    return false;
  };

  // Modal Submit Handlers
  window.sendWhatsAppEnquiry = function () {
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
      alertElementId: 'modalAlertBox'
    });
  };

  window.sendEmailEnquiry = function () {
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

  // Close on backdrop click & ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeEnquiry();
  });

  document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('enquiryModal');
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) window.closeEnquiry();
      });
    }
  });
})();
