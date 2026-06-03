/**
 * exportPDF.js
 * Phase 9: PDF Export Requirements
 * 
 * To ensure 100% ATS compatibility and selectable text, we use native browser printing
 * to generate the PDF instead of html2canvas (which flattens to an image).
 * 
 * Usage:
 * Call exportV2PDF() from a button click. It relies on CSS `@media print` rules
 * (which should hide UI elements like sidebars, buttons, etc.).
 */

export const exportV2PDF = () => {
  // We can add a class to body to ensure only the resume is printed
  document.body.classList.add('ats-printing');
  
  // Trigger native print dialog which allows saving as PDF
  window.print();
  
  // Cleanup
  document.body.classList.remove('ats-printing');
};
