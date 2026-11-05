/**
 * Baburam Trading & Om Sai Enterprise
 * Static Trade Enquiry Engine (WhatsApp Click-to-Chat & Mailto)
 */

(function () {
  'use strict';

  // State
  let currentEnquiry = {
    division: 'baburamTrading', // 'baburamTrading' | 'omSaiEnterprise'
    divisionLabel: 'Baburam Trading (FMCG Distribution)',
    productId: '',
    productName: '',
    category: ''
  };

  // Open Enquiry Modal
  window.openEnquiry = function (divisionKey, productId, productName, category) {
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
      if (currentEnquiry.productId) {
        productEl.textContent = `${currentEnquiry.productName} (Code: ${currentEnquiry.productId})`;
      } else {
        productEl.textContent = 'General Business & Distribution Inquiry';
      }
    }
    if (hiddenProduct) hiddenProduct.value = currentEnquiry.productId;

    // Reset message preview & alerts
    const alertBox = document.getElementById('modalAlertBox');
    if (alertBox) alertBox.style.display = 'none';

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

  // Send WhatsApp Action
  window.sendWhatsAppEnquiry = function () {
    const form = document.getElementById('enquiryForm');
    if (!form) return;

    const name = (document.getElementById('enquiryName')?.value || '').trim();
    const company = (document.getElementById('enquiryCompany')?.value || '').trim();
    const phone = (document.getElementById('enquiryPhone')?.value || '').trim();
    const email = (document.getElementById('enquiryEmail')?.value || '').trim();
    const message = (document.getElementById('enquiryMessage')?.value || '').trim();

    // Validation
    if (!name || !company || !phone) {
      showModalAlert('Please fill in your Name, Company Name, and Contact Number.', 'error');
      return;
    }

    // Lookup destination WhatsApp number
    let destNumber = '919876543210';
    if (window.APP_CONFIG && window.APP_CONFIG[currentEnquiry.division]) {
      destNumber = window.APP_CONFIG[currentEnquiry.division].whatsappNumber;
    } else if (currentEnquiry.division === 'omSaiEnterprise') {
      destNumber = '919876543211';
    }

    // Build structured message
    const lines = [
      `*Trade Enquiry - ${currentEnquiry.divisionLabel}*`,
      `---------------------------------`,
      currentEnquiry.productId ? `*Product:* ${currentEnquiry.productName} (Ref: ${currentEnquiry.productId})` : `*Subject:* General Partnership & Supply Enquiry`,
      `*Contact Person:* ${name}`,
      `*Company:* ${company}`,
      `*Phone:* ${phone}`,
      email ? `*Email:* ${email}` : '',
      message ? `*Requirement Details:* ${message}` : '*Requirement:* Please share availability, minimum order quantity (MOQ), and commercial terms.'
    ].filter(Boolean);

    const fullMessage = lines.join('\n');
    const encoded = encodeURIComponent(fullMessage);
    const whatsappUrl = `https://wa.me/${destNumber}?text=${encoded}`;

    // Show confirmation and open link
    showModalAlert('Opening WhatsApp with your pre-filled inquiry. You can review the details before sending directly to our trade desk.', 'success');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  // Send Mailto Action
  window.sendEmailEnquiry = function () {
    const name = (document.getElementById('enquiryName')?.value || '').trim();
    const company = (document.getElementById('enquiryCompany')?.value || '').trim();
    const phone = (document.getElementById('enquiryPhone')?.value || '').trim();
    const email = (document.getElementById('enquiryEmail')?.value || '').trim();
    const message = (document.getElementById('enquiryMessage')?.value || '').trim();

    if (!name || !company) {
      showModalAlert('Please provide at least your Name and Company Name.', 'error');
      return;
    }

    let destEmail = 'distribution@baburamtrading.com';
    if (window.APP_CONFIG && window.APP_CONFIG[currentEnquiry.division]) {
      destEmail = window.APP_CONFIG[currentEnquiry.division].email;
    } else if (currentEnquiry.division === 'omSaiEnterprise') {
      destEmail = 'inquiry@omsaienterprise.com';
    }

    const subject = `Trade Inquiry: ${currentEnquiry.productName || 'B2B Sourcing'} - ${company}`;
    const body = `Dear Sales Team,

I would like to submit a formal trade inquiry with ${currentEnquiry.divisionLabel}.

Product / Subject: ${currentEnquiry.productName} ${currentEnquiry.productId ? `(Code: ${currentEnquiry.productId})` : ''}
Company Name: ${company}
Contact Person: ${name}
Phone Number: ${phone}
Email: ${email}

Requirements / Scope:
${message || 'Please provide technical specifications, packaging sizes, delivery timelines, and commercial details.'}

Best regards,
${name}
${company}`;

    const mailtoUrl = `mailto:${destEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  function showModalAlert(text, type) {
    const alertBox = document.getElementById('modalAlertBox');
    if (!alertBox) return;
    alertBox.textContent = text;
    alertBox.style.display = 'block';
    if (type === 'error') {
      alertBox.style.backgroundColor = '#FDF2F2';
      alertBox.style.color = '#991B1B';
      alertBox.style.border = '1px solid #F87171';
    } else {
      alertBox.style.backgroundColor = '#F0FDF4';
      alertBox.style.color = '#166534';
      alertBox.style.border = '1px solid #86EFAC';
    }
  }

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
