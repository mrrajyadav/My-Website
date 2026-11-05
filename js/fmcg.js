/**
 * Baburam Trading - FMCG Scripts
 */

document.addEventListener('DOMContentLoaded', function () {
  // Direct FMCG Partnership Form handler
  const partnerForm = document.getElementById('fmcgPartnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('partnerName')?.value || '';
      const company = document.getElementById('partnerCompany')?.value || '';
      const phone = document.getElementById('partnerPhone')?.value || '';
      const channel = document.getElementById('partnerChannel')?.value || 'Retailer';
      const notes = document.getElementById('partnerNotes')?.value || '';

      if (!name || !company || !phone) {
        alert('Please fill in your Name, Company, and Contact Number.');
        return;
      }

      // Pre-fill enquiry modal or WhatsApp
      window.openEnquiry('baburamTrading', 'PARTNERSHIP', `Distributor Partnership (${channel})`, 'Business Collaboration');
      const msgField = document.getElementById('enquiryMessage');
      if (msgField) {
        msgField.value = `Partnership Proposal: Distribution Channel: ${channel}. Message: ${notes}`;
      }
    });
  }
});
