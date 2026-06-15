import { test, expect } from '@playwright/test';

test('Login to KIST Portal and access Fees Statement', async ({ page }) => {
  // Navigate to the portal
  await page.goto('https://portal.kist.ac.ke/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  console.log('Portal page loaded');

  // Enter username and password
  const usernameInput = page.locator('input[type="text"]').first();
  await usernameInput.fill('dct/0686/23');
  console.log('Username entered: /*enter admission number*/');

  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill('enter your password here');
  console.log('Password entered');

  // Click Sign In button
  const signInButton = page.locator('button:has-text("Sign In"), button:has-text("Sign in"), button:has-text("LOGIN"), input[type="submit"]').first();
  await signInButton.click();
  console.log('Sign In button clicked');

  // Wait for dashboard to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Dashboard loaded');

  // Navigate to Financials menu
  const financialsMenu = page.locator('text=Financials, text=financials, a:has-text("Financials")').first();
  
  // Try multiple selectors for Financials
  let financialsElement;
  try {
    financialsElement = page.locator(':text("Financials")').first();
    await financialsElement.click({ timeout: 5000 });
    console.log('✓ Clicked on Financials menu');
  } catch (error) {
    // Try alternative approach
    const menuItems = page.locator('nav >> text, aside >> text, [role="navigation"] >> text');
    const count = await menuItems.count();
    
    for (let i = 0; i < count; i++) {
      const text = await menuItems.nth(i).textContent();
      if (text?.includes('Financials')) {
        await menuItems.nth(i).click();
        console.log('Clicked on Financials menu');
        break;
      }
    }
  }

  await page.waitForTimeout(1000);

  // Click on Fees submenu
  const feesMenu = page.locator(':text("Fees")').first();
  await feesMenu.click();
  console.log('Clicked on Fees submenu');

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Click on Fees Statement
  const feesStatement = page.locator(':text("Fees Statement"), text=Fees Statement').first();
  await feesStatement.click();
  console.log('Clicked on Fees Statement');

  // Wait for the Fees Statement page to load
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Fees Statement page loaded');

  // Extract fees information from the page
  const pageContent = await page.content();
  
  // Try to extract table data
  const tables = page.locator('table');
  const tableCount = await tables.count();
  
  console.log(`\n Found ${tableCount} table(s) on the page\n`);

  // Extract data from each table
  for (let i = 0; i < tableCount; i++) {
    const table = tables.nth(i);
    const rows = table.locator('tr');
    const rowCount = await rows.count();
    
    console.log(`\n--- Table ${i + 1} (${rowCount} rows) ---`);
    
    for (let j = 0; j < rowCount; j++) {
      const row = rows.nth(j);
      const cells = row.locator('td, th');
      const cellCount = await cells.count();
      
      let rowData = '';
      for (let k = 0; k < cellCount; k++) {
        const cellText = await cells.nth(k).textContent();
        rowData += `${cellText?.trim()} | `;
      }
      
      if (rowData.trim().length > 0) {
        console.log(rowData);
      }
    }
  }

  // Extract any summary information or total amounts
  const textContent = await page.innerText('body');
  
  // Look for common financial terms
  const financialTerms = ['Total', 'Due', 'Paid', 'Balance', 'Amount', 'Fee'];
  console.log('\n--- Summary Information ---');
  financialTerms.forEach(term => {
    if (textContent.includes(term)) {
      const lines = textContent.split('\n').filter(line => line.includes(term));
      lines.slice(0, 5).forEach(line => {
        if (line.trim().length > 0) {
          console.log(line.trim());
        }
      });
    }
  });

  console.log('\nFees Statement data extraction complete');

  // Optional: Take a screenshot for verification
  await page.screenshot({ path: 'fees-statement.png', fullPage: true });
  console.log('Screenshot saved as fees-statement.png');
});

test.describe.skip('Alternative login approach - if first test fails', () => {
  test('Login with alternative selectors', async ({ page }) => {
    await page.goto('https://portal.kist.ac.ke/');
    await page.waitForLoadState('networkidle');

    // Try different input selectors
    await page.fill('input[name="username"], input[id*="user"], input[placeholder*="user" i]', 'dct/0686/23');
    await page.fill('input[name="password"], input[id*="pass"], input[type="password"]', 'beyourself');

    // Click any button that might be Sign In
    await page.click('button, input[type="submit"], [role="button"]');

    await page.waitForLoadState('networkidle');
    console.log('Alternative login attempted');
  });
});
