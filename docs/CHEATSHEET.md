# 📝 Playwright Cheatsheet - Command Reference

Cheatsheet ini berisi semua Playwright commands yang sering dipakai, dengan penjelasan dalam **Bahasa Indonesia** dan **code examples**.

> 💡 **Tips**: Bookmark halaman ini sebagai quick reference saat menulis tests!

---

## 📑 Daftar Isi

- [Navigation](#navigation)
- [Locators & Selectors](#locators--selectors)
- [Actions](#actions)
- [Assertions](#assertions)
- [Waits & Timeouts](#waits--timeouts)
- [Screenshots & Videos](#screenshots--videos)
- [Debugging](#debugging)
- [Test Hooks](#test-hooks)
- [Test Configuration](#test-configuration)

---

## 🧭 Navigation

### `page.goto(url)`
Navigate ke URL tertentu.

```javascript
// Navigate ke URL lengkap
await page.goto('https://www.saucedemo.com/');

// Navigate ke relative URL (jika baseURL sudah di-set di config)
await page.goto('/inventory.html');

// Navigate dengan options
await page.goto('https://www.saucedemo.com/', {
  waitUntil: 'networkidle',  // Wait sampai network idle
  timeout: 30000              // Timeout 30 detik
});
```

### `page.goBack()`
Kembali ke halaman sebelumnya (seperti tombol Back di browser).

```javascript
await page.goBack();
```

### `page.goForward()`
Maju ke halaman berikutnya (seperti tombol Forward di browser).

```javascript
await page.goForward();
```

### `page.reload()`
Reload/refresh halaman.

```javascript
// Reload halaman
await page.reload();

// Reload dengan options
await page.reload({ waitUntil: 'networkidle' });
```

### `page.url()`
Get current URL.

```javascript
const currentUrl = page.url();
console.log(currentUrl);  // https://www.saucedemo.com/inventory.html
```

---

## 🎯 Locators & Selectors

Locators adalah cara Playwright menemukan elements di halaman.

### `page.locator(selector)`
Locator paling fleksibel, bisa pakai CSS selector, text, dll.

```javascript
// By ID
const usernameInput = page.locator('#user-name');

// By Class
const products = page.locator('.inventory_item');

// By Attribute
const errorMessage = page.locator('[data-test="error"]');

// By CSS Selector
const loginButton = page.locator('button#login-button');

// Chaining (nested locators)
const productName = page.locator('.inventory_item').locator('.inventory_item_name');

// Get nth element
const firstProduct = page.locator('.inventory_item').nth(0);
const lastProduct = page.locator('.inventory_item').last();
```

### `page.getByRole(role, options)`
Locator berdasarkan ARIA role (recommended untuk accessibility).

```javascript
// By button role
const loginButton = page.getByRole('button', { name: 'Login' });

// By link role
const logoutLink = page.getByRole('link', { name: 'Logout' });

// By heading
const pageTitle = page.getByRole('heading', { name: 'Products' });

// Common roles: button, link, textbox, checkbox, radio, heading, listitem
```

### `page.getByText(text)`
Locator berdasarkan text content.

```javascript
// Exact text match
const productName = page.getByText('Sauce Labs Backpack');

// Partial text match
const productName = page.getByText('Backpack', { exact: false });

// Case insensitive
const errorMsg = page.getByText(/username is required/i);
```

### `page.getByLabel(text)`
Locator berdasarkan label (berguna untuk form inputs).

```javascript
// Find input by label
const usernameInput = page.getByLabel('Username');
const passwordInput = page.getByLabel('Password');
```

### `page.getByPlaceholder(text)`
Locator berdasarkan placeholder attribute.

```javascript
// Find input by placeholder
const usernameInput = page.getByPlaceholder('Username');
const emailInput = page.getByPlaceholder('Enter your email');
```

### `page.getByTestId(testId)`
Locator berdasarkan data-testid attribute (best practice).

```javascript
// HTML: <button data-testid="submit-btn">Submit</button>
const submitButton = page.getByTestId('submit-btn');
```

### Combining Locators

```javascript
// Has Text - Find element yang contains specific text
const productWithName = page.locator('.inventory_item', { hasText: 'Backpack' });

// Has - Find parent element yang contains child
const itemWithRemoveButton = page.locator('.cart_item', {
  has: page.locator('button[id^="remove"]')
});

// Filter - Filter locators
const visibleButtons = page.locator('button').filter({ hasText: 'Add to cart' });
```

---

## 🖱️ Actions

### Click

```javascript
// Simple click
await page.locator('#login-button').click();

// Click dengan options
await page.locator('#login-button').click({
  button: 'left',       // 'left', 'right', 'middle'
  clickCount: 1,        // Double click = 2
  delay: 100,           // Delay before mouseup (ms)
  force: true,          // Force click even if element is not visible
});

// Double click
await page.locator('.element').dblclick();

// Right click (context menu)
await page.locator('.element').click({ button: 'right' });
```

### Fill (Input Text)

```javascript
// Fill input field (clear dulu, terus fill)
await page.locator('#user-name').fill('standard_user');

// Fill dengan check
await page.locator('#user-name').fill('standard_user', { force: true });
```

### Type (Simulate Keyboard Typing)

```javascript
// Type text (character by character)
await page.locator('#user-name').type('standard_user');

// Type dengan delay
await page.locator('#user-name').type('standard_user', { delay: 100 });
```

### Clear

```javascript
// Clear input field
await page.locator('#user-name').clear();
```

### Check / Uncheck (Checkbox, Radio)

```javascript
// Check checkbox
await page.locator('#terms-checkbox').check();

// Uncheck checkbox
await page.locator('#terms-checkbox').uncheck();

// Set checked state
await page.locator('#terms-checkbox').setChecked(true);  // Check
await page.locator('#terms-checkbox').setChecked(false); // Uncheck
```

### Select Option (Dropdown)

```javascript
// Select by value
await page.locator('select#sort').selectOption('lohi');

// Select by label
await page.locator('select#sort').selectOption({ label: 'Price (low to high)' });

// Select by index
await page.locator('select#sort').selectOption({ index: 2 });

// Select multiple options
await page.locator('select#countries').selectOption(['US', 'UK', 'JP']);
```

### Hover

```javascript
// Hover over element
await page.locator('.product-image').hover();

// Hover dengan options
await page.locator('.product-image').hover({
  position: { x: 50, y: 50 },  // Hover at specific position
  force: true
});
```

### Focus

```javascript
// Focus on element
await page.locator('#username').focus();
```

### Press Key

```javascript
// Press single key
await page.locator('#search').press('Enter');

// Press keyboard shortcuts
await page.locator('#search').press('Control+A');  // Select all
await page.locator('#search').press('Control+C');  // Copy

// Common keys: Enter, Tab, Escape, ArrowDown, ArrowUp, Backspace, Delete
```

### Drag and Drop

```javascript
// Drag and drop
const source = page.locator('#source-element');
const target = page.locator('#target-element');

await source.dragTo(target);
```

### Upload File

```javascript
// Upload single file
await page.locator('input[type="file"]').setInputFiles('path/to/file.pdf');

// Upload multiple files
await page.locator('input[type="file"]').setInputFiles([
  'path/to/file1.pdf',
  'path/to/file2.pdf'
]);

// Remove uploaded file
await page.locator('input[type="file"]').setInputFiles([]);
```

---

## ✅ Assertions

Assertions menggunakan `expect()` dari Playwright.

### Visibility Assertions

```javascript
// Check element visible
await expect(page.locator('.title')).toBeVisible();

// Check element hidden
await expect(page.locator('.error')).toBeHidden();

// Check element exists in DOM (tapi mungkin tidak visible)
await expect(page.locator('.element')).toBeAttached();
```

### Text Assertions

```javascript
// Exact text match
await expect(page.locator('.title')).toHaveText('Products');

// Partial text match
await expect(page.locator('.error')).toContainText('Username is required');

// Multiple texts
await expect(page.locator('.item-name')).toHaveText([
  'Product 1',
  'Product 2',
  'Product 3'
]);

// Regex match
await expect(page.locator('.price')).toHaveText(/\$\d+\.\d{2}/);
```

### Value Assertions (for inputs)

```javascript
// Check input value
await expect(page.locator('#username')).toHaveValue('standard_user');

// Check input empty
await expect(page.locator('#username')).toHaveValue('');
```

### Attribute Assertions

```javascript
// Check attribute exists dan punya value tertentu
await expect(page.locator('button')).toHaveAttribute('type', 'submit');

// Check class attribute
await expect(page.locator('.btn')).toHaveClass('btn btn-primary');
await expect(page.locator('.btn')).toHaveClass(/btn-primary/);

// Check href attribute
await expect(page.locator('a')).toHaveAttribute('href', '/products');
```

### Count Assertions

```javascript
// Check jumlah elements
await expect(page.locator('.product-item')).toHaveCount(6);

// Check at least one element exists
const count = await page.locator('.product-item').count();
expect(count).toBeGreaterThan(0);
```

### State Assertions

```javascript
// Check enabled/disabled
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('button')).toBeDisabled();

// Check checked (checkbox/radio)
await expect(page.locator('#terms')).toBeChecked();
await expect(page.locator('#terms')).not.toBeChecked();

// Check focused
await expect(page.locator('#username')).toBeFocused();

// Check editable
await expect(page.locator('input')).toBeEditable();
```

### URL Assertions

```javascript
// Check current URL
await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

// Check URL contains
await expect(page).toHaveURL(/inventory/);

// Check page title
await expect(page).toHaveTitle('Swag Labs');
```

### Screenshot Comparison (Visual Testing)

```javascript
// Compare screenshot dengan baseline
await expect(page).toHaveScreenshot('homepage.png');

// Compare specific element
await expect(page.locator('.header')).toHaveScreenshot('header.png');

// With options
await expect(page).toHaveScreenshot('homepage.png', {
  maxDiffPixels: 100,  // Allow 100 pixels difference
});
```

---

## ⏱️ Waits & Timeouts

### Wait for Selector

```javascript
// Wait sampai element visible
await page.locator('.product').waitFor({ state: 'visible' });

// Wait sampai element hidden
await page.locator('.loading').waitFor({ state: 'hidden' });

// Wait sampai element attached to DOM
await page.locator('.element').waitFor({ state: 'attached' });

// Wait dengan timeout
await page.locator('.element').waitFor({
  state: 'visible',
  timeout: 10000  // 10 seconds
});
```

### Wait for URL

```javascript
// Wait sampai URL match
await page.waitForURL('**/inventory.html');

// Wait dengan regex
await page.waitForURL(/inventory/);

// Wait dengan options
await page.waitForURL('**/inventory.html', {
  timeout: 10000,
  waitUntil: 'networkidle'
});
```

### Wait for Load State

```javascript
// Wait sampai page fully loaded
await page.waitForLoadState('load');

// Wait sampai DOM content loaded
await page.waitForLoadState('domcontentloaded');

// Wait sampai network idle (no more than 2 network connections for 500ms)
await page.waitForLoadState('networkidle');
```

### Wait for Timeout (❌ Not Recommended)

```javascript
// Hard wait - AVOID ini jika bisa
await page.waitForTimeout(5000);  // Wait 5 seconds

// Lebih baik pakai waitFor dengan condition
```

### Wait for Function

```javascript
// Wait sampai condition true
await page.waitForFunction(() => {
  return document.querySelectorAll('.product-item').length === 6;
});

// Wait dengan parameter
await page.waitForFunction(
  (minCount) => document.querySelectorAll('.product-item').length >= minCount,
  6  // Parameter: minCount = 6
);
```

### Set Timeout

```javascript
// Set timeout untuk specific action
await page.locator('.element').click({ timeout: 10000 });

// Set default timeout untuk test
test.setTimeout(60000);  // 60 seconds

// Set timeout di config
// playwright.config.js:
// timeout: 60000
```

---

## 📸 Screenshots & Videos

### Take Screenshot

```javascript
// Screenshot entire page
await page.screenshot({ path: 'screenshot.png' });

// Screenshot dengan full page (scroll)
await page.screenshot({ path: 'screenshot.png', fullPage: true });

// Screenshot specific element
await page.locator('.header').screenshot({ path: 'header.png' });

// Screenshot tanpa save (return buffer)
const buffer = await page.screenshot();

// Screenshot dengan options
await page.screenshot({
  path: 'screenshot.png',
  fullPage: true,
  type: 'jpeg',      // 'png' atau 'jpeg'
  quality: 80,       // 0-100 (untuk jpeg only)
});
```

### Configure Video Recording

```javascript
// Di playwright.config.js
export default defineConfig({
  use: {
    video: 'on',                    // Record semua tests
    video: 'retain-on-failure',     // Record hanya ketika fail
    video: 'off',                   // No video

    // Video options
    videoSize: { width: 1280, height: 720 },
  }
});

// Get video path di test
const videoPath = await page.video().path();
```

---

## 🐛 Debugging

### Run with UI Mode

```bash
# Interactive debugging dengan UI
npx playwright test --ui
```

### Run in Headed Mode

```bash
# Run dengan browser visible
npx playwright test --headed

# Run dengan slow motion
npx playwright test --headed --slow-mo=1000
```

### Debug Mode

```bash
# Playwright Inspector akan open, bisa step through test
npx playwright test --debug

# Debug specific test
npx playwright test tests/login.spec.js --debug
```

### `page.pause()`
Pause execution dan open Playwright Inspector.

```javascript
test('debug test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Pause execution disini
  await page.pause();

  // Test akan pause, Inspector akan open
  // Bisa inspect elements, run commands, dll
});
```

### Console Logs

```javascript
// Listen to console messages dari browser
page.on('console', msg => {
  console.log('Browser console:', msg.text());
});

// Evaluate JavaScript di browser console
const result = await page.evaluate(() => {
  console.log('Hello from browser!');
  return document.title;
});
console.log(result);
```

### Page Errors

```javascript
// Listen to page errors
page.on('pageerror', error => {
  console.error('Page error:', error.message);
});
```

### Take Screenshot on Failure

```javascript
// Di test
test('my test', async ({ page }) => {
  try {
    // Test code here
  } catch (error) {
    // Take screenshot when test fails
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    throw error;  // Re-throw untuk mark test sebagai failed
  }
});

// Atau configure di playwright.config.js
screenshot: 'only-on-failure'
```

### Trace Viewer

```javascript
// Enable trace di playwright.config.js
trace: 'on-first-retry'  // atau 'on'

// View trace setelah test run
// npx playwright show-trace test-results/trace.zip

// Trace shows:
// - Screenshots at each step
// - DOM snapshots
// - Network requests
// - Console logs
// - Test source code
```

---

## 🪝 Test Hooks

Hooks adalah functions yang dijalankan sebelum/sesudah tests.

### `test.beforeEach()`
Dijalankan **sebelum setiap test** di test file.

```javascript
test.beforeEach(async ({ page }) => {
  // Setup sebelum setiap test
  await page.goto('https://www.saucedemo.com/');

  // Login (jika diperlukan untuk semua tests)
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
});

test('test 1', async ({ page }) => {
  // Test akan start dengan user sudah login
});

test('test 2', async ({ page }) => {
  // Test ini juga start dengan user sudah login
});
```

### `test.afterEach()`
Dijalankan **setelah setiap test** di test file.

```javascript
test.afterEach(async ({ page }, testInfo) => {
  // Cleanup setelah test

  // Take screenshot jika test failed
  if (testInfo.status === 'failed') {
    await page.screenshot({
      path: `screenshots/${testInfo.title}-failed.png`,
      fullPage: true
    });
  }

  // Logout (jika perlu)
  await page.goto('/logout');
});
```

### `test.beforeAll()`
Dijalankan **satu kali sebelum semua tests** di test file.

```javascript
test.beforeAll(async () => {
  // Setup yang cuma perlu run sekali
  // Example: Database seeding, setup test data, dll

  console.log('Setting up test data...');
  // Setup code here
});
```

### `test.afterAll()`
Dijalankan **satu kali setelah semua tests** di test file.

```javascript
test.afterAll(async () => {
  // Cleanup setelah semua tests selesai
  // Example: Database cleanup, delete test data, dll

  console.log('Cleaning up test data...');
  // Cleanup code here
});
```

---

## ⚙️ Test Configuration

### Skip Tests

```javascript
// Skip single test
test.skip('this test is skipped', async ({ page }) => {
  // This test will not run
});

// Skip test conditionally
test('test name', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'This test is not for Safari');
  // Test code...
});

// Skip entire describe block
test.describe.skip('Skipped tests', () => {
  test('test 1', async ({ page }) => {});
  test('test 2', async ({ page }) => {});
});
```

### Run Only Specific Tests

```javascript
// Run only this test (ignore others)
test.only('only this test will run', async ({ page }) => {
  // Test code
});

// IMPORTANT: Remove .only before commit!
```

### Annotate Tests

```javascript
// Add annotation to test
test('test with annotation', async ({ page }) => {
  test.info().annotations.push({ type: 'issue', description: 'BUG-123' });
  // Test code
});

// Slow annotation (increase timeout 3x)
test('slow test', async ({ page }) => {
  test.slow();  // Timeout akan 3x lipat
  // Test code yang memang slow
});
```

### Test Timeout

```javascript
// Set timeout untuk specific test
test('test with custom timeout', async ({ page }) => {
  test.setTimeout(120000);  // 120 seconds
  // Test code
});
```

### Retry Tests

```javascript
// Retry failed test
test('flaky test', async ({ page }) => {
  test.info().retry = 2;  // Retry 2x if failed
  // Test code
});
```

---

## 🎯 Quick Tips

### 1. **Prefer getByRole() for better accessibility**
```javascript
// ✅ Good
await page.getByRole('button', { name: 'Login' }).click();

// ❌ Okay, but less semantic
await page.locator('#login-button').click();
```

### 2. **Use data-testid for stable locators**
```javascript
// HTML: <button data-testid="submit-btn">Submit</button>
await page.getByTestId('submit-btn').click();
```

### 3. **Avoid hard waits (waitForTimeout)**
```javascript
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.locator('.element').waitFor({ state: 'visible' });
await page.waitForLoadState('networkidle');
```

### 4. **Use soft assertions untuk continue test meskipun ada failure**
```javascript
// Hard assertion - stop test jika fail
await expect(page.locator('.title')).toHaveText('Products');

// Soft assertion - continue test meskipun fail
await expect.soft(page.locator('.title')).toHaveText('Products');
```

### 5. **Use Page Object Model untuk maintainability**
```javascript
// Lihat example di pages/ folder
```

---

## 📚 Resources

- **Official Docs**: https://playwright.dev/
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **Examples**: https://github.com/microsoft/playwright/tree/main/examples

---

**Happy Testing! 🎭🚀**
