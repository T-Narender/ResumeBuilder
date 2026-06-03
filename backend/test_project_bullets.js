import puppeteer from 'puppeteer';
import fs from 'fs';

async function runTest() {
  console.log('--- STARTING PROJECT BULLETS DIAGNOSTIC TEST ---');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 900 });
  
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('Projects received') && !text.includes('Education:')) {
      console.log('BROWSER LOG:', text);
    }
  });
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.toString()));

  try {
    // 1. Login
    console.log('Logging in as testuser@example.com...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'testuser@example.com');
    await page.type('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => window.location.pathname.includes('/dashboard'), { timeout: 10000 });
    console.log('Login successful.');

    // 2. Click on the resume card to edit
    console.log('Waiting for Dashboard cards...');
    await page.waitForFunction(
      () => document.body.innerText.includes('Full Stack Engineer Resume'),
      { timeout: 10000 }
    );
    
    console.log('Clicking the Full Stack Engineer Resume card...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('h5'));
      const targetCard = cards.find(c => c.textContent.includes('Full Stack Engineer Resume'));
      if (targetCard) {
        const parentCard = targetCard.closest('.group');
        if (parentCard) parentCard.click();
        else targetCard.click();
      }
    });

    // 3. Wait for Editor page
    console.log('Waiting for Editor page to load...');
    await page.waitForFunction(() => window.location.pathname.includes('/edit-resume/'), { timeout: 10000 });
    
    console.log('Waiting for resume data to load...');
    await page.waitForSelector('input[value="Jane Doe"]', { timeout: 10000 });
    
    // Setup window error listener
    await page.evaluateOnNewDocument(() => {
      window.addEventListener('error', e => console.log('WINDOW ERROR:', e.message, e.filename, e.lineno));
      window.addEventListener('unhandledrejection', e => console.log('UNHANDLED REJECTION:', e.reason));
    });

    // 4. Click Next 5 times to reach Projects
    const pagesList = ["contact-info", "work-experience", "education-info", "skills", "projects"];
    for (let i = 0; i < pagesList.length; i++) {
      await page.waitForSelector('button');
      
      const headingText = await page.evaluate(() => {
        const h2 = document.querySelector('h2');
        return h2 ? h2.textContent : 'No H2 found';
      });
      const errorText = await page.evaluate(() => {
        const el = document.querySelector('.text-amber-700');
        return el ? el.textContent : 'None';
      });
      console.log(`At step ${i}: Heading: "${headingText}", Error: "${errorText}"`);

      // Print all inputs on the current page
      const inputs = await page.evaluate(() => {
        const list = [];
        document.querySelectorAll('input').forEach(input => {
          list.push({ label: input.previousElementSibling?.textContent || 'no-label', value: input.value });
        });
        return list;
      });
      console.log(`Inputs at step ${i}:`, inputs);

      console.log(`Clicking Next to advance to: ${pagesList[i]}...`);
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nextBtn = btns.find(b => b.textContent.trim() === 'Next');
        if (nextBtn) nextBtn.click();
      });
      // Small pause to allow step transition
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    console.log('Successfully navigated to Projects step.');

    // Print final page text
    const pageText = await page.evaluate(() => document.body.innerText);
    console.log('--- VISIBLE PAGE TEXT ---');
    console.log(pageText);
    console.log('-------------------------');

    // 5. Verify BulletInput is rendered in Projects form
    console.log('Verifying BulletInput components are present in Projects...');
    await page.waitForSelector('textarea[placeholder*="e.g. Developed a new feature"]', { timeout: 10000 });
    
    // Type in a project description bullet
    console.log('Typing bullet point text for first project...');
    const bulletTextarea = await page.$('textarea[placeholder*="e.g. Developed a new feature"]');
    // Clear and type
    await page.evaluate(el => el.value = '', bulletTextarea);
    await bulletTextarea.type('Developed database backend with MongoDB and Express');

    // Click "Improve" button for the project bullet
    console.log('Clicking "Improve" button...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const improveBtn = btns.find(b => b.textContent.includes('Improve'));
      if (improveBtn) improveBtn.click();
    });

    // Wait for AI Suggestion block
    console.log('Waiting for AI suggestion to return...');
    await page.waitForFunction(
      () => document.body.innerText.includes('AI Suggestion') && document.body.innerText.includes('Accept'),
      { timeout: 15000 }
    );
    console.log('AI suggestion popup detected.');

    // Click "Accept"
    console.log('Clicking "Accept"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.textContent.includes('Accept'));
      if (acceptBtn) acceptBtn.click();
    });

    // Verify textarea has the improved text (it should no longer be the original)
    const updatedValue = await page.evaluate(el => el.value, bulletTextarea);
    console.log('Updated bullet text:', updatedValue);
    
    if (updatedValue && updatedValue !== 'Developed database backend with MongoDB and Express') {
      console.log('SUCCESS: First project bullet was successfully improved by AI and accepted!');
    } else {
      throw new Error('First project bullet text was not updated or accepted.');
    }

    // --- TEST ADD PROJECT SECTION ---
    console.log('Clicking "Add Project"...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const addProjBtn = btns.find(b => b.textContent.includes('Add Project'));
      if (addProjBtn) addProjBtn.click();
    });

    // Small pause to let UI render the new project
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get all textareas on the page
    const textareas = await page.$$('textarea[placeholder*="e.g. Developed a new feature"]');
    console.log(`Found ${textareas.length} bullet point textareas.`);

    if (textareas.length < 3) {
      // Expected 3: 2 from first project + 1 from second project (or 1 from first + 1 from second depending on state)
      // Since first project has 2 bullets (one we modified, and one 'Integrated analytics tracking.'), and the new project has 1.
    }

    const secondProjectBulletTextarea = textareas[textareas.length - 1];
    console.log('Typing bullet point text for the added project...');
    await secondProjectBulletTextarea.type('Built secure user authentication module');

    // Click the last "Improve" button (corresponds to the added project)
    console.log('Clicking "Improve" button for the added project...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const improveBtns = btns.filter(b => b.textContent.includes('Improve'));
      if (improveBtns.length > 0) {
        // Click the last one
        improveBtns[improveBtns.length - 1].click();
      } else {
        throw new Error('Could not find any Improve buttons.');
      }
    });

    // Wait for AI Suggestion block
    console.log('Waiting for AI suggestion to return for added project...');
    await page.waitForFunction(
      () => document.body.innerText.includes('AI Suggestion') && document.body.innerText.includes('Accept'),
      { timeout: 15000 }
    );
    console.log('AI suggestion popup detected for added project.');

    // Click "Accept"
    console.log('Clicking "Accept" for added project...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.textContent.includes('Accept'));
      if (acceptBtn) acceptBtn.click();
    });

    // Verify textarea has the improved text
    const updatedAddedValue = await page.evaluate(el => el.value, secondProjectBulletTextarea);
    console.log('Updated added project bullet text:', updatedAddedValue);
    
    if (updatedAddedValue && updatedAddedValue !== 'Built secure user authentication module') {
      console.log('SUCCESS: Added project bullet was successfully improved by AI and accepted!');
    } else {
      throw new Error('Added project bullet text was not updated or accepted.');
    }

  } catch (error) {
    console.error('TEST FAILED:', error);
  } finally {
    await browser.close();
    console.log('--- TEST RUN FINISHED ---');
  }
}

runTest();
