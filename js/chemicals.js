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
    const productName = document.getElementById('chemProductName')?.value?.trim();
    const grade = document.getElementById('chemGrade')?.value?.trim();
    const quantity = document.getElementById('chemQuantity')?.value?.trim();
    const packaging = document.getElementById('chemPackaging')?.value?.trim();
    const location = document.getElementById('chemLocation')?.value?.trim();
    const industry = document.getElementById('chemIndustry')?.value || 'Industrial Manufacturing';
    const notes = document.getElementById('chemNotes')?.value?.trim();
    const tdsRequest = document.getElementById('chemTdsRequest')?.checked;

    const details = [
      productName ? `Target Product / Family: ${productName}` : '',
      grade ? `Required Grade / Concentration: ${grade}` : '',
      quantity ? `Estimated Volume / Quantity: ${quantity}` : '',
      packaging ? `Packaging Preference: ${packaging}` : '',
      location ? `Delivery Destination: ${location}` : '',
      industry ? `Industry Sector: ${industry}` : '',
      tdsRequest ? `Documentation Requested: Manufacturer TDS & SDS (Subject to confirmation)` : '',
      notes ? `Specific Sourcing Scope: ${notes}` : ''
    ].filter(Boolean).join('\n• ');

    const fullMessage = `Chemical Trade RFQ Details:\n• ${details}`;

    window.processTradeEnquiry({
      division: 'omSaiEnterprise',
      productId: 'CHEM-RFQ',
      productName: productName ? `Chemical RFQ - ${productName}` : `Chemical RFQ (${industry})`,
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
