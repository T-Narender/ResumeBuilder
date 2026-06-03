import axiosInstance from "./axiosInstance";

export const generateTruePDF = async (resumeTitle = "Resume") => {
  try {
    // 1. Get the HTML of the resume container
    const container = document.querySelector('#ats-resume-container, .ats-resume-container');
    if (!container) {
      throw new Error("Resume container not found. Are you using an ATS template?");
    }

    // We clone it to preserve the original
    const clone = container.cloneNode(true);

    // Remove all UI-only controls and other non-resume elements from the export.
    const noPrintElements = clone.querySelectorAll(
      '[data-pdf-exclude], .no-print, button, input, select, textarea'
    );
    noPrintElements.forEach(el => el.remove());

    // Ensure all links have proper formatting for ATS PDFs
    const links = clone.querySelectorAll('a');
    links.forEach(link => {
      // Enforce proper link styles on the inline elements to guarantee Puppeteer renders them as clickable blue links
      link.style.color = '#2563EB';
      link.style.textDecoration = 'none';
    });

    const html = clone.outerHTML;

    // Send to backend for Puppeteer processing
    const response = await axiosInstance.post('/api/pdf/generate', { html }, {
      responseType: 'blob' // Must specify blob to handle binary PDF stream
    });

    // 4. Trigger the download automatically
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${resumeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume'}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error("Failed to generate PDF via backend:", error);
    throw error;
  }
};
