/**
 * Om Sai Enterprise - Chemicals Contact & RFQ Script
 * Directly processes chemical quote requests without double entry
 * Integrates popup-blocker safe tab handling and native form validation
 */

document.addEventListener('DOMContentLoaded', function () {
  const chemForm = document.getElementById('chemicalQuoteForm');
  if (!chemForm) return;

  window.submitChemicalQuote = function (channel) {
    if (typeof chemForm.reportValidity === 'function' && !chemForm.reportValidity()) {
      return;
    }

    let newTab = null;
    if (channel === 'whatsapp') {
      try {
        newTab = window.open('about:blank', '_blank');
      } catch (e) {
        newTab = null;
      }
    }

    const name = document.getElementById('chemName')?.value;
    const company = document.getElementById('chemCompany')?.value;
    const phone = document.getElementById('chemPhone')?.value;
    const email = document.getElementById('chemEmail')?.value;
    const industry = document.getElementById('chemIndustry')?.value || 'Industrial Manufacturing';
    const notes = document.getElementById('chemNotes')?.value;

    const fullMessage = `RFQ Requirement (${industry}): ${notes || 'Requesting commercial price quotation and product availability.'}`;

    window.processTradeEnquiry({
      division: 'omSaiEnterprise',
      productId: 'CHEM-RFQ',
      productName: `Industrial Quote Request (${industry})`,
      name,
      company,
      phone,
      email,
      requirement: fullMessage,
      channel: channel,
      alertElementId: 'chemContactAlert',
      newTab: newTab
    });
  };

  chemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.submitChemicalQuote('whatsapp');
  });
});
