 import puppeteer from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const generatePDF = async (req, res) => {
  try {
    const { html, expectedPageCount } = req.body;

    if (!html) {
      return res.status(400).json({ message: "HTML content is required" });
    }

    // Render does NOT automatically set NODE_ENV=production, but it does set RENDER=true.
    // We want to use sparticuz in Render or any production Linux environment.
    // Local Windows/Mac environments should use the standard puppeteer executable.
    const isRender = process.env.RENDER === 'true';
    const isProduction = process.env.NODE_ENV === 'production';
    const useSparticuz = process.platform === 'linux' && (isRender || isProduction);
    
    let browser;
    try {
      if (useSparticuz) {
        console.log("Using Sparticuz Chromium...");
        const executablePath = await chromium.executablePath();
        console.log("Sparticuz Executable Path:", executablePath);
        
        browser = await puppeteerCore.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: executablePath,
          headless: chromium.headless,
        });
      } else {
        console.log("Using Local Puppeteer...");
        browser = await puppeteer.launch({
          headless: "new",
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
          executablePath: puppeteer.executablePath(),
        });
      }
    } catch (launchError) {
      console.error("Failed to launch browser:", launchError);
      return res.status(500).json({ 
        message: "Failed to launch PDF browser", 
        error: launchError.message,
        stack: launchError.stack 
      });
    }

    const page = await browser.newPage();

    // Use the provided HTML directly; components should now contain full inline styles.
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { -webkit-print-color-adjust: exact; }
          body { font-family: Arial, Helvetica, sans-serif; }
          a { color: #1a1a1a !important; text-decoration: none !important; }
        </style>
      </head>
      <body>
        ${html}
      </body>
      </html>
    `;

    // Wait until network is idle so the Inter font loads
    await page.setContent(fullHtml, { waitUntil: 'networkidle0', timeout: 60000 });

    // Ensure the PDF uses a plain sans-serif font stack for ATS readability
    await page.addStyleTag({
      content: `
        body { font-family: Arial, Helvetica, sans-serif !important; }
      `
    });

    const bodyFontSize = await page.evaluate(() => {
      const el = document.querySelector('h1');
      return el ? window.getComputedStyle(el).fontSize : null;
    });
    console.log('H1 font size in Puppeteer:', bodyFontSize);

    const pdfOptions = () => ({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '40px',
        right: '40px'
      }
    });

    const getPageCount = (buffer) => {
      const raw = Buffer.from(buffer).toString('latin1');
      return (raw.match(/\/Type\s*\/Page\b/g) || []).length || 1;
    };

    let pdfBuffer = await page.pdf(pdfOptions());

    console.log('PDF generated');

    try {
      let pageCount = getPageCount(pdfBuffer);
      console.log('PDF page count (heuristic):', pageCount);

      if (
        process.env.NODE_ENV !== 'production' &&
        Number.isInteger(expectedPageCount) &&
        expectedPageCount !== pageCount
      ) {
        console.warn(
          `Pagination mismatch: Preview: ${expectedPageCount} page(s), PDF: ${pageCount} page(s)`,
        );
      }

      res.set('X-PDF-Page-Count', String(pageCount));
    } catch (err) {
      console.log('Unable to determine PDF page count:', err.message);
    }

    await browser.close();

    // Send PDF as binary buffer
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Length': pdfBuffer.length,
      'Content-Disposition': 'attachment; filename="Resume.pdf"'
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};
