/**
 * Om Sai Enterprise - Chemicals Contact & RFQ Script
 * Directly processes chemical quote requests without double entry
 */

document.addEventListener('DOMContentLoaded', function () {
  const chemForm = document.getElementById('chemicalQuoteForm');
  if (!chemForm) return;

  window.submitChemicalQuote = function (channel) {
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
      alertElementId: 'chemContactAlert'
    });
  };

  chemForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.submitChemicalQuote('whatsapp');
  });
});
