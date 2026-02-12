# 🎓 Playwright Tutorial - Step by Step

Tutorial lengkap untuk belajar Playwright automation testing dari **nol sampai mahir**. Tutorial ini cocok untuk **complete beginners** yang belum pernah coding automation testing.

> 💡 **Estimated Time**: 2-3 hours untuk complete semua steps

---

## 📑 Daftar Isi

1. [Setup Project dari Nol](#step-1-setup-project-dari-nol)
2. [Menulis Test Pertama](#step-2-menulis-test-pertama)
3. [Memahami Locators dan Selectors](#step-3-memahami-locators-dan-selectors)
4. [Refactor ke Page Object Model](#step-4-refactor-ke-page-object-model)
5. [Menjalankan dan Melihat Reports](#step-5-menjalankan-dan-melihat-reports)
6. [Debugging Ketika Test Gagal](#step-6-debugging-ketika-test-gagal)
7. [Best Practices untuk Production](#step-7-best-practices-untuk-production)

---

## Step 1: Setup Project dari Nol

### Prerequisites

Sebelum mulai, pastikan sudah install:
- **Node.js** (version 16+): https://nodejs.org/
- **Code Editor** (VSCode recommended): https://code.visualstudio.com/

### 1.1 Create New Project

```bash
# Create folder baru
mkdir my-playwright-project
cd my-playwright-project

# Initialize npm project
npm init -y
```

Ini akan create `package.json` file.

### 1.2 Install Playwright

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps
```

**Note**: Install browsers bisa memakan waktu 5-10 menit dan ~1GB space.

### 1.3 Create Playwright Config

Create file `playwright.config.js`:

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  reporter: 'html',

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### 1.4 Create Tests Folder

```bash
mkdir tests
```

**✅ Checkpoint**: Project structure sekarang:
```
my-playwright-project/
├── tests/              (folder kosong untuk test files)
├── node_modules/       (Playwright dependencies)
├── package.json
└── playwright.config.js
```

---

## Step 2: Menulis Test Pertama

Mari kita tulis test pertama untuk login ke SauceDemo!

### 2.1 Create Test File

Create file `tests/first-test.spec.js`:

```javascript
// tests/first-test.spec.js
import { test, expect } from '@playwright/test';

test('my first test', async ({ page }) => {
  // Navigate ke website
  await page.goto('https://www.saucedemo.com/');

  // Verify title
  await expect(page).toHaveTitle(/Swag Labs/);

  console.log('Test passed! 🎉');
});
```

### 2.2 Run Test

```bash
npx playwright test
```

**Expected Output:**
```
Running 1 test using 1 worker
  ✓  1 first-test.spec.js:3:5 › my first test (2s)

  1 passed (3s)
```

**🎉 Congratulations!** Test pertama berhasil!

### 2.3 Breakdown: Apa yang Terjadi?

```javascript
import { test, expect } from '@playwright/test';
// Import test runner dan assertion library dari Playwright

test('my first test', async ({ page }) => {
  // test() = function untuk define test
  // 'my first test' = test name (descriptive)
  // async = karena operations adalah asynchronous
  // { page } = fixture dari Playwright (browser page object)

  await page.goto('https://www.saucedemo.com/');
  // await = wait sampai operation selesai
  // page.goto() = navigate ke URL

  await expect(page).toHaveTitle(/Swag Labs/);
  // expect() = assertion
  // toHaveTitle() = check page title
  // /Swag Labs/ = regex pattern (partial match)
});
```

### 2.4 Tambahkan More Actions

Update test untuk actually login:

```javascript
// tests/first-test.spec.js
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  // 1. Navigate ke login page
  await page.goto('https://www.saucedemo.com/');

  // 2. Fill username
  await page.locator('#user-name').fill('standard_user');

  // 3. Fill password
  await page.locator('#password').fill('secret_sauce');

  // 4. Click login button
  await page.locator('#login-button').click();

  // 5. Verify redirect ke products page
  await expect(page).toHaveURL(/inventory.html/);

  // 6. Verify page title "Products"
  const pageTitle = page.locator('.title');
  await expect(pageTitle).toHaveText('Products');

  console.log('Login successful! ✅');
});
```

### 2.5 Run Updated Test

```bash
npx playwright test
```

Test sekarang akan:
1. ✅ Open browser
2. ✅ Navigate ke SauceDemo
3. ✅ Fill username dan password
4. ✅ Click login
5. ✅ Verify berhasil login

**🎉 Great job!** Test sudah bisa login!

---

## Step 3: Memahami Locators dan Selectors

**Locators** adalah cara Playwright menemukan elements di halaman. Ada berbagai jenis locators:

### 3.1 CSS Selectors

```javascript
// By ID
await page.locator('#user-name').fill('text');

// By Class
await page.locator('.inventory_item').click();

// By Attribute
await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

// By Tag + Class
await page.locator('button.btn-primary').click();

// Nested (child selector)
await page.locator('.inventory_item .inventory_item_name').click();
```

### 3.2 Text-based Locators (Recommended)

```javascript
// By text content
await page.getByText('Sauce Labs Backpack').click();

// By role (best for accessibility)
await page.getByRole('button', { name: 'Login' }).click();

// By label (for form inputs)
await page.getByLabel('Username').fill('standard_user');

// By placeholder
await page.getByPlaceholder('Username').fill('standard_user');

// By test ID (best practice)
await page.getByTestId('submit-button').click();
```

### 3.3 Exercise: Rewrite Test dengan Better Locators

**Before (CSS Selectors):**
```javascript
await page.locator('#user-name').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();
```

**After (Role-based - Better):**
```javascript
await page.getByPlaceholder('Username').fill('standard_user');
await page.getByPlaceholder('Password').fill('secret_sauce');
await page.getByRole('button', { name: 'Login' }).click();
```

### 3.4 Combining Locators

```javascript
// Find product item yang contains text "Backpack"
const backpackItem = page.locator('.inventory_item', {
  hasText: 'Sauce Labs Backpack'
});

// Find button di dalam product item
const addToCartButton = backpackItem.locator('button');
await addToCartButton.click();
```

### 3.5 Nth Element

```javascript
// Get first product
const firstProduct = page.locator('.inventory_item').nth(0);

// Get last product
const lastProduct = page.locator('.inventory_item').last();

// Get third product
const thirdProduct = page.locator('.inventory_item').nth(2);
```

### 3.6 Practice Exercise

Create test untuk add product to cart:

```javascript
test('should add product to cart', async ({ page }) => {
  // Login first
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  // Find product dengan text "Backpack"
  const backpackProduct = page.locator('.inventory_item', {
    hasText: 'Sauce Labs Backpack'
  });

  // Click "Add to cart" button di product tersebut
  const addButton = backpackProduct.locator('button', { hasText: 'Add to cart' });
  await addButton.click();

  // Verify cart badge shows "1"
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');

  console.log('Product added to cart! 🛒');
});
```

---

## Step 4: Refactor ke Page Object Model

Test code sekarang sudah works, tapi ada masalah:
- ❌ Locators di-hardcode di test
- ❌ Kalau UI berubah, harus update di banyak tempat
- ❌ Code tidak reusable

**Solution**: **Page Object Model (POM)**

### 4.1 Apa itu Page Object Model?

POM adalah design pattern dimana:
- Setiap **page** = **class**
- Class berisi **locators** dan **methods**
- Tests call methods dari POM, bukan langsung interact dengan UI

**Benefits:**
- ✅ Maintainable (update di 1 tempat saja)
- ✅ Reusable (methods bisa dipake di multiple tests)
- ✅ Readable (test code lebih clean)

### 4.2 Create LoginPage POM

Create folder `pages/` dan file `pages/LoginPage.js`:

```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Methods
  async goto() {
    await this.page.goto('/');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isLoginSuccessful() {
    await this.page.waitForURL('**/inventory.html');
    return this.page.url().includes('inventory.html');
  }
}
```

### 4.3 Refactor Test untuk Use LoginPage

**Before (Without POM):**
```javascript
test('should login successfully', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory.html/);
});
```

**After (With POM):**
```javascript
import { LoginPage } from '../pages/LoginPage.js';

test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const isSuccess = await loginPage.isLoginSuccessful();
  expect(isSuccess).toBe(true);
});
```

**🎉 Jauh lebih clean!**

### 4.4 Benefits POM - Real Example

Imagine UI berubah, button ID dari `#login-button` jadi `#submit-btn`:

**Without POM:**
```javascript
// Harus update di SEMUA tests! 😱
test('test 1', async ({ page }) => {
  await page.locator('#login-button').click(); // ❌ Broken
});

test('test 2', async ({ page }) => {
  await page.locator('#login-button').click(); // ❌ Broken
});

test('test 3', async ({ page }) => {
  await page.locator('#login-button').click(); // ❌ Broken
});
```

**With POM:**
```javascript
// Cukup update di LoginPage.js saja! ✨
// pages/LoginPage.js
this.loginButton = page.locator('#submit-btn'); // Update disini aja

// Semua tests langsung works! ✅
test('test 1', async ({ page }) => {
  await loginPage.login('user', 'pass'); // ✅ Works
});
```

### 4.5 Exercise: Create ProductsPage POM

Create `pages/ProductsPage.js`:

```javascript
// pages/ProductsPage.js
export class ProductsPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.productItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  async isPageLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
    const title = await this.pageTitle.textContent();
    return title === 'Products';
  }

  async getProductCount() {
    return await this.productItems.count();
  }

  async sortProducts(sortValue) {
    await this.sortDropdown.selectOption(sortValue);
    await this.page.waitForTimeout(500); // Wait for sort animation
  }

  async addProductToCart(productName) {
    const buttonId = productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '');

    await this.page.locator(`#add-to-cart-${buttonId}`).click();
  }

  async getCartItemCount() {
    try {
      const badgeText = await this.cartBadge.textContent();
      return parseInt(badgeText);
    } catch {
      return 0; // Cart empty
    }
  }
}
```

### 4.6 Use ProductsPage di Test

```javascript
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';

test('should add product to cart', async ({ page }) => {
  // Login
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // Add product
  const productsPage = new ProductsPage(page);
  await productsPage.addProductToCart('Sauce Labs Backpack');

  // Verify
  const cartCount = await productsPage.getCartItemCount();
  expect(cartCount).toBe(1);
});
```

**✅ Clean, readable, maintainable!**

---

## Step 5: Menjalankan dan Melihat Reports

### 5.1 Run All Tests

```bash
npx playwright test
```

### 5.2 Run Specific Test File

```bash
npx playwright test tests/login.spec.js
```

### 5.3 Run with UI Mode (Recommended untuk Development)

```bash
npx playwright test --ui
```

UI Mode features:
- ✅ Watch mode (auto-rerun on file changes)
- ✅ Time travel debugging
- ✅ Step-by-step execution
- ✅ DOM inspector
- ✅ Network inspector

### 5.4 Run in Headed Mode (See Browser)

```bash
# Run dengan browser visible
npx playwright test --headed

# Run dengan slow motion (easier to follow)
npx playwright test --headed --slow-mo=1000
```

### 5.5 View HTML Report

Setelah tests selesai run:

```bash
npx playwright show-report
```

Report akan open di browser dan show:
- ✅ Test results (pass/fail)
- ✅ Execution time
- ✅ Screenshots
- ✅ Videos (jika ada yang fail)
- ✅ Error messages
- ✅ Traces

### 5.6 Understanding Test Output

```
Running 3 tests using 1 worker

  ✓  1 login.spec.js:3:5 › should login successfully (2.1s)
  ✓  2 login.spec.js:15:5 › should show error with invalid password (1.5s)
  ✗  3 products.spec.js:8:5 › should sort products (3.2s)

  2 passed (7s)
  1 failed (7s)
```

Legend:
- ✓ = Test passed
- ✗ = Test failed
- ⊘ = Test skipped

### 5.7 Screenshots

Semua tests automatically take screenshots (configured di `playwright.config.js`).

Location: `test-results/[test-name]/[screenshot].png`

### 5.8 Videos

Videos direcord ketika test **fails** (configured: `video: 'retain-on-failure'`).

Location: `test-results/[test-name]/video.webm`

---

## Step 6: Debugging Ketika Test Gagal

Test failed? Don't panic! Ini tutorial debugging.

### 6.1 Read Error Message

```
Error: expect(received).toBe(expected)

Expected: "Products"
Received: "Login"

  at tests/products.spec.js:15:5
```

Error message tells you:
- **What failed**: expect().toBe()
- **Expected value**: "Products"
- **Actual value**: "Login"
- **Location**: products.spec.js line 15

### 6.2 Check Screenshot

HTML report includes screenshots. Check screenshot untuk see what happened.

```bash
npx playwright show-report
```

Click failed test → See screenshot

### 6.3 Watch Video

Jika test failed, video available. Video shows exactly what happened step-by-step.

### 6.4 Use Debug Mode

```bash
npx playwright test --debug
```

Debug mode:
- ✅ Opens Playwright Inspector
- ✅ Pause execution
- ✅ Step through test
- ✅ Inspect elements
- ✅ Try commands live

### 6.5 Add `page.pause()` untuk Manual Debugging

```javascript
test('debug this test', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');

  // Pause disini
  await page.pause();

  // Test will pause, Inspector will open
  // You can:
  // - Inspect page
  // - Try different selectors
  // - Run commands manually
  // - Then click "Resume" to continue

  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
});
```

### 6.6 Console Logs untuk Debugging

```javascript
test('debug with console logs', async ({ page }) => {
  await page.goto('/');

  // Log current URL
  console.log('Current URL:', page.url());

  await page.getByPlaceholder('Username').fill('standard_user');

  // Log element visibility
  const isVisible = await page.locator('#password').isVisible();
  console.log('Password field visible:', isVisible);

  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Log before critical action
  console.log('About to click login button...');
  await page.getByRole('button', { name: 'Login' }).click();

  // Log after action
  console.log('Login button clicked!');
  console.log('New URL:', page.url());
});
```

### 6.7 Common Issues & Solutions

#### Issue 1: Element Not Found

**Error:**
```
Error: locator.click: Target closed
```

**Reasons:**
- Element selector salah
- Element belum loaded
- Element hidden/not visible

**Solution:**
```javascript
// Add wait
await page.locator('.element').waitFor({ state: 'visible' });
await page.locator('.element').click();

// Or use better selector
await page.getByRole('button', { name: 'Click Me' }).click();
```

#### Issue 2: Test Timeout

**Error:**
```
Test timeout of 30000ms exceeded
```

**Reasons:**
- Page load lambat
- Element takes long time to appear
- Infinite wait

**Solution:**
```javascript
// Increase timeout untuk specific test
test.setTimeout(60000); // 60 seconds

// Or wait untuk specific condition
await page.waitForLoadState('networkidle');
```

#### Issue 3: Flaky Tests (Kadang Pass, Kadang Fail)

**Reasons:**
- Race conditions
- Animation timing
- Network delays

**Solution:**
```javascript
// Avoid hard waits
// ❌ Bad
await page.waitForTimeout(5000);

// ✅ Good
await page.locator('.element').waitFor({ state: 'visible' });

// Wait for network idle
await page.waitForLoadState('networkidle');
```

---

## Step 7: Best Practices untuk Production

### 7.1 Use Test Hooks untuk DRY Code

**Without hooks (Repetitive):**
```javascript
test('test 1', async ({ page }) => {
  await page.goto('/');
  await loginPage.login('user', 'pass');
  // Test code...
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  await loginPage.login('user', 'pass'); // Duplicate!
  // Test code...
});
```

**With hooks (DRY):**
```javascript
test.beforeEach(async ({ page }) => {
  // Run before each test
  await page.goto('/');
  await loginPage.login('user', 'pass');
});

test('test 1', async ({ page }) => {
  // Already logged in!
  // Test code...
});

test('test 2', async ({ page }) => {
  // Already logged in!
  // Test code...
});
```

### 7.2 Use Test Data Constants

**Without constants (Magic strings):**
```javascript
test('test 1', async ({ page }) => {
  await loginPage.login('standard_user', 'secret_sauce');
});

test('test 2', async ({ page }) => {
  await loginPage.login('standard_user', 'secret_sauce'); // Duplicate!
});
```

**With constants (Maintainable):**
```javascript
// utils/testData.js
export const VALID_USER = {
  username: 'standard_user',
  password: 'secret_sauce'
};

// tests
import { VALID_USER } from '../utils/testData.js';

test('test 1', async ({ page }) => {
  await loginPage.login(VALID_USER.username, VALID_USER.password);
});

test('test 2', async ({ page }) => {
  await loginPage.login(VALID_USER.username, VALID_USER.password);
});
```

### 7.3 Write Descriptive Test Names

```javascript
// ❌ Bad
test('test 1', async ({ page }) => { ... });
test('login', async ({ page }) => { ... });

// ✅ Good
test('should login successfully with valid credentials', async ({ page }) => { ... });
test('should show error message when password is incorrect', async ({ page }) => { ... });
test('should redirect to products page after successful login', async ({ page }) => { ... });
```

### 7.4 Use Proper Assertions

```javascript
// ❌ Weak assertion
expect(page.url()).toContain('inventory');

// ✅ Strong assertion
await page.waitForURL('**/inventory.html');
await expect(page.locator('.title')).toHaveText('Products');
await expect(page.locator('.inventory_item')).toHaveCount(6);
```

### 7.5 Keep Tests Independent

```javascript
// ❌ Bad - Tests depend on each other
test('create user', async ({ page }) => {
  // Create user
});

test('login with created user', async ({ page }) => {
  // This test depends on previous test!
  // Will fail if run alone!
});

// ✅ Good - Each test is independent
test('should create user', async ({ page }) => {
  // Create user
  // Clean up after test
});

test('should login successfully', async ({ page }) => {
  // Create user for this test
  // Test login
  // Clean up
});
```

### 7.6 Use Page Object Model

Always use POM untuk production tests. Benefits:
- ✅ Maintainable
- ✅ Reusable
- ✅ Testable
- ✅ Team collaboration

### 7.7 Configure Timeouts Properly

```javascript
// playwright.config.js
export default defineConfig({
  timeout: 30000,        // Test timeout: 30s
  use: {
    actionTimeout: 10000,      // Action timeout: 10s
    navigationTimeout: 30000,  // Navigation timeout: 30s
  }
});
```

### 7.8 Use Multiple Reporters

```javascript
// playwright.config.js
reporter: [
  ['html'],                                      // HTML report
  ['json', { outputFile: 'results.json' }],      // JSON for data analysis
  ['list'],                                      // Console output
  ['junit', { outputFile: 'junit.xml' }],        // For CI/CD
],
```

### 7.9 Run Tests in CI/CD

Example GitHub Actions workflow:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### 7.10 Organize Tests by Feature

```
tests/
├── login/
│   ├── login-valid.spec.js
│   ├── login-invalid.spec.js
│   └── login-locked.spec.js
├── products/
│   ├── products-display.spec.js
│   ├── products-sort.spec.js
│   └── products-filter.spec.js
└── cart/
    ├── cart-add.spec.js
    ├── cart-remove.spec.js
    └── cart-checkout.spec.js
```

---

## 🎯 Next Steps

Congrats! 🎉 Kamu sudah belajar:
- ✅ Setup Playwright project
- ✅ Menulis tests
- ✅ Menggunakan locators
- ✅ Implement Page Object Model
- ✅ Run dan debug tests
- ✅ Best practices

### What's Next?

1. **Practice More**
   - Write tests untuk different websites
   - Try different scenarios
   - Explore more Playwright features

2. **Advanced Topics**
   - API Testing dengan Playwright
   - Visual Regression Testing
   - Mobile Testing
   - Performance Testing
   - Test Data Management
   - Database Integration

3. **Integrate dengan Tools**
   - CI/CD (GitHub Actions, Jenkins)
   - Test Management (TestRail, Zephyr)
   - Bug Tracking (Jira)
   - Monitoring (Sentry, DataDog)

4. **Community**
   - Join Playwright Discord
   - Read official docs
   - Watch tutorials
   - Contribute to open source

---

## 📚 Resources

### Official
- **Playwright Docs**: https://playwright.dev/
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **GitHub**: https://github.com/microsoft/playwright

### Learning
- **Playwright YouTube**: https://www.youtube.com/@Playwrightdev
- **Playwright Discord**: https://aka.ms/playwright/discord
- **Examples**: https://github.com/microsoft/playwright/tree/main/examples

### Tools
- **Trace Viewer**: https://playwright.dev/docs/trace-viewer
- **Codegen**: https://playwright.dev/docs/codegen
- **UI Mode**: https://playwright.dev/docs/test-ui-mode

---

**Happy Learning! 🎭🚀**

Keep practicing, keep testing, and never stop learning!
