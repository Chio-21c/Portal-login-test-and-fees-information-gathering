# KIST Portal Playwright Script

This Playwright automation script logs into the KIST portal and extracts financial information from the Fees Statement.

## Features

✅ Automated login to KIST portal  
✅ Navigate to Financials > Fees > Fees Statement  
✅ Extract and display fees data from tables  
✅ Extract financial summary information  
✅ Screenshot capture for verification  

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Credentials (Optional)

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
KIST_USERNAME=your_username
KIST_PASSWORD=your_password
KIST_PORTAL_URL=https://portal.kist.ac.ke/
```

## Running the Script

### Run the test in headless mode (no browser window):

```bash
npm test -- tests/kist-portal-fees.spec.ts
```

### Run with browser visible (headed mode):

```bash
npx playwright test tests/kist-portal-fees.spec.ts --headed
```

### Run in a specific browser:

```bash
# Chrome only
npx playwright test tests/kist-portal-fees.spec.ts --project=chromium

# Firefox only
npx playwright test tests/kist-portal-fees.spec.ts --project=firefox

# Safari only
npx playwright test tests/kist-portal-fees.spec.ts --project=webkit
```

### Debug mode (slow down execution, see what's happening):

```bash
npx playwright test tests/kist-portal-fees.spec.ts --headed --debug
```

## Output

The script will:

1. **Console Logs**: Display all extracted fees information in the terminal
2. **Screenshot**: Save `fees-statement.png` showing the fees statement page
3. **HTML Report**: Generate a detailed report in `playwright-report/`

View the HTML report:

```bash
npx playwright show-report
```

## Troubleshooting

### Script doesn't find elements

If the script fails to login or navigate:

1. **Run in headed mode** to see what's happening:
   ```bash
   npx playwright test tests/kist-portal-fees.spec.ts --headed
   ```

2. **Enable debug mode**:
   ```bash
   npx playwright test tests/kist-portal-fees.spec.ts --headed --debug
   ```

3. **The login page might use different selectors** - Check the page manually and update the selectors in the script

### Security Notes

- **Never commit credentials** to version control
- Use `.env` files and add them to `.gitignore`
- Consider using environment variables instead of hardcoded credentials
- The script uses the credentials provided: `Username: dct/0686/23, Password: beyourself`

## Common Issues

| Issue | Solution |
|-------|----------|
| Login fails | Check if portal URL is correct and credentials are valid |
| Can't find Financials menu | Page structure may have changed - run in headed mode to inspect |
| Tables not extracting properly | Portal might load data dynamically - increase wait times in script |
| Screenshot is blank | Add more wait time before screenshot: `await page.waitForTimeout(3000)` |

## Next Steps

- Modify the script to export data to CSV or JSON
- Add error handling and retry logic
- Schedule the script to run automatically using cron jobs or task scheduler
- Add email notifications when fees are updated
