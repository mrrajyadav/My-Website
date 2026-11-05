/**
 * Om Sai Enterprise - Chemicals Specialist Scripts
 */

document.addEventListener('DOMContentLoaded', function () {
  // Quote & TDS Request Form handler
  const chemForm = document.getElementById('chemicalQuoteForm');
  if (chemForm) {
    chemForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('chemName')?.value || '';
      const company = document.getElementById('chemCompany')?.value || '';
      const phone = document.getElementById('chemPhone')?.value || '';
      const industry = document.getElementById('chemIndustry')?.value || 'Textile';
      const notes = document.getElementById('chemNotes')?.value || '';

      if (!name || !company || !phone) {
        alert('Please fill in your Name, Company, and Contact Number.');
        return;
      }

      window.openEnquiry('omSaiEnterprise', 'QUOTE-REQ', `Chemical Sourcing Quote (${industry})`, 'Industrial Supply');
      const msgField = document.getElementById('enquiryMessage');
      if (msgField) {
        msgField.value = `Industrial Quote Request for ${industry} sector. Details: ${notes}`;
      }
    });
  }
});
