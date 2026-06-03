import puppeteer from 'puppeteer';
import fs from 'fs';

async function run() {
  const html = `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
    <body>
      <div id="ats-resume-container" style="font-family: Arial, sans-serif; margin: 0; padding: 40px 50px; color: #1a1a1a; font-size: 11.5px; line-height: 1.6; box-sizing: border-box;">
        <header style="text-align:center; margin-bottom:8px;">
          <h1 style="font-size:32px; font-weight:700; margin:0; letter-spacing:-0.02em; color:#111827;">Jane Doe</h1>
          <h2 style="font-size:14px; color:#555; margin:4px 0;">Software Engineer</h2>
          <div style="font-size:11px; color:#666; margin:4px 0; display:flex; justify-content:center; gap:16px;">jane@example.com • (555) 555-5555 • github.com/jane</div>
        </header>

        <section>
          <div style="margin-top:24px; margin-bottom:8px;">
            <h3 style="font-size:14px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 4px 0;">Experience</h3>
            <hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" />
          </div>
          <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline;">
              <div style="font-size:13px; font-weight:600;">Senior Developer</div>
              <div style="font-size:11px; color:#666;">Jan 2020 – Present</div>
            </div>
            <div style="font-size:12px; color:#444; margin-bottom:4px;">Acme Corp</div>
            <ul style="margin:4px 0 0 16px; padding:0;">
              <li style="margin-bottom:6px;">Led backend team to build microservices.</li>
              <li style="margin-bottom:6px;">Improved performance by 30%.</li>
            </ul>
          </div>
        </section>
      </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true, margin: { top: '40px', bottom: '40px', left: '50px', right: '50px' } });
  await browser.close();

  const outPath = './backend/output/test_resume.pdf';
  try { fs.mkdirSync('./backend/output', { recursive: true }); } catch (e) { }
  fs.writeFileSync(outPath, pdfBuffer);
  console.log('Wrote PDF to', outPath);
}

run().catch(err => { console.error(err); process.exit(1); });
