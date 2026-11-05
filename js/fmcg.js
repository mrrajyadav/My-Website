/**
 * Baburam Trading - FMCG Contact & Partnership Script
 * Directly processes enquiry from the contact page without double entry
 */

document.addEventListener('DOMContentLoaded', function () {
  const fmcgForm = document.getElementById('fmcgPartnerForm');
  if (!fmcgForm) return;

  window.submitFMCGContact = function (channel) {
    const name = document.getElementById('partnerName')?.value;
    const company = document.getElementById('partnerCompany')?.value;
    const phone = document.getElementById('partnerPhone')?.value;
    const email = document.getElementById('partnerEmail')?.value;
    const channelType = document.getElementById('partnerChannel')?.value || 'General Retail';
    const notes = document.getElementById('partnerNotes')?.value;

    const fullMessage = `Partnership Proposal (${channelType}): ${notes || 'Interested in FMCG retail distribution partnership.'}`;

    window.processTradeEnquiry({
      division: 'baburamTrading',
      productId: 'FMCG-PARTNER',
      productName: `Distributor Partnership (${channelType})`,
      name,
      company,
      phone,
      email,
      requirement: fullMessage,
      channel: channel,
      alertElementId: 'fmcgContactAlert'
    });
  };

  fmcgForm.addEventListener('submit', function (e) {
    e.preventDefault();
    window.submitFMCGContact('whatsapp');
  });
});
