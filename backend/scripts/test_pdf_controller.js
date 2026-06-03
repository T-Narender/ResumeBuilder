import fs from 'fs';
import { generatePDF } from '../controllers/pdfController.js';

const html = `
<div id="ats-resume-container" style="font-family: Arial, sans-serif; margin: 0; padding: 30px 40px; color: #1a1a1a; font-size: 11px; line-height: 1.6; box-sizing: border-box;">
  <header style="text-align:center; margin-bottom:8px;">
    <h1 style="font-size:28px; font-weight:700; margin:0; letter-spacing:-0.02em; color:#111827;">Jane Doe</h1>
    <h2 style="font-size:13px; color:#555; margin:4px 0;">Software Engineer</h2>
    <div style="font-size:10px; color:#666; margin:4px 0; display:flex; justify-content:center; gap:16px; flex-wrap:wrap;">jane@example.com • (555) 555-5555</div>
  </header>
  <div style="margin-top:24px;">
    <h3 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 4px 0;">Projects</h3>
    <hr style="border:none; border-top:1px solid #e0e0e0; margin:4px 0 12px 0;" />
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; gap:12px;">
        <div style="font-size:13px; font-weight:600;">AIRESUME BUILDER</div>
        <div style="font-size:10px; color:#666; display:flex; gap:8px; align-items:center;">GitHub | Live Demo</div>
      </div>
      <div style="font-style:italic; color:#666; font-size:11px; margin-bottom:4px;">React, Node.js, MongoDB</div>
      <ul style="margin:4px 0 0 16px; padding:0;">
        <li style="margin-bottom:6px;">Built ATS-focused resume generation.</li>
      </ul>
    </div>
  </div>
  <section style="page-break-inside:avoid; break-inside:avoid;">
    <div style="margin-top:24px;">
      <h3 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 4px 0;">Certifications</h3>
      <hr style="border:none; border-top:1px solid #e0e0e0; margin:4px 0 12px 0;" />
    </div>
    <ul style="margin:4px 0 0 16px; padding:0;">
      <li style="margin-bottom:6px;"><span style="font-weight:600; color:#111827;">AWS Certified Developer</span> <span style="color:#666;">(2026)</span></li>
    </ul>
  </section>
</div>
`;

const outPath = './output/test_pdf_controller.pdf';

await generatePDF(
  { body: { html } },
  {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      throw new Error(`Unexpected JSON response: ${JSON.stringify(payload)}`);
    },
    set(headers) {
      this.headers = headers;
      return this;
    },
    send(buffer) {
      fs.mkdirSync('./output', { recursive: true });
      fs.writeFileSync(outPath, buffer);
      console.log(`Wrote PDF to ${outPath}`);
    },
  },
);
