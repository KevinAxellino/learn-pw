# 🎭 Playwright Educational Project - SauceDemo

Project Playwright educational untuk belajar automation testing dari dasar sampai advanced. Project ini menggunakan [SauceDemo](https://www.saucedemo.com/) sebagai website testing dan implement best practices dengan **Page Object Model (POM)**.

> 📚 Project ini dibuat khusus untuk beginners yang ingin belajar Playwright dari nol hingga mahir.

---

## 📋 Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur-Fitur](#fitur-fitur)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Cara Menjalankan Tests](#cara-menjalankan-tests)
- [Struktur Project](#struktur-project)
- [Test Scenarios](#test-scenarios)
- [Page Object Model](#page-object-model)
- [Reports dan Screenshots](#reports-dan-screenshots)
- [Dokumentasi Tambahan](#dokumentasi-tambahan)
- [Tips dan Best Practices](#tips-dan-best-practices)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## 🎯 Tentang Project

Project ini adalah **comprehensive guide** untuk belajar Playwright automation testing dengan:

✅ **28+ Test Cases** yang mencakup berbagai scenarios
✅ **Page Object Model (POM)** untuk code yang clean dan maintainable
✅ **Indonesian Comments** di setiap file untuk memudahkan pembelajaran
✅ **Best Practices** yang bisa langsung diapply di production
✅ **Multiple Browser Testing** (Chromium, Firefox, WebKit)
✅ **Comprehensive Documentation** (README, Cheatsheet, Tutorial)

Website yang digunakan: **[SauceDemo](https://www.saucedemo.com/)** - Demo e-commerce website untuk testing purposes.

---

## ✨ Fitur-Fitur

### 🧪 Test Coverage
- **Login Tests**: Valid/invalid credentials, locked user, empty fields
- **Products Tests**: Product display, sorting (name, price), product details
- **Cart Tests**: Add/remove items, cart badge, multiple items, empty cart

### 🏗️ Architecture
- **Page Object Model (POM)**: Semua page logic ada di `pages/` folder
- **Test Data Management**: Centralized test data di `utils/testData.js`
- **Modular Structure**: Tests organized by feature/functionality

### 📊 Reports
- **HTML Report**: Interactive report yang bisa dibuka di browser
- **JSON Report**: Data-driven report untuk analysis
- **Screenshots**: Automatic screenshots untuk semua tests
- **Videos**: Video recording ketika test gagal (untuk debugging)

### 🌐 Multi-Browser
- ✅ Chromium (Chrome, Edge, Opera)
- ✅ Firefox
- ✅ WebKit (Safari)

---

## 📦 Prerequisites

Sebelum memulai, pastikan sudah install:

1. **Node.js** (version 16 atau lebih baru)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **npm** (biasanya sudah include dengan Node.js)
   - Check version: `npm --version`

3. **Git** (untuk clone repository)
   - Download: https://git-scm.com/

---

## 🚀 Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd testProject
```

### Step 2: Install Dependencies

```bash
npm install
```

Ini akan install:
- `@playwright/test` - Playwright testing framework
- Semua dependencies yang diperlukan

### Step 3: Install Browsers

```bash
npx playwright install --with-deps
```

Ini akan install:
- Chromium browser
- Firefox browser
- WebKit browser
- System dependencies yang diperlukan

**Note**: Install bisa memakan waktu beberapa menit dan membutuhkan ~1GB space.

---

## 🏃 Cara Menjalankan Tests

### Run All Tests (Semua Browsers)

```bash
npx playwright test
```

Ini akan run **semua tests** di **3 browsers** (Chromium, Firefox, WebKit).

### Run Tests di Specific Browser

```bash
# Run di Chromium saja
npx playwright test --project=chromium

# Run di Firefox saja
npx playwright test --project=firefox

# Run di WebKit saja
npx playwright test --project=webkit
```

### Run Specific Test File

```bash
# Run login tests saja
npx playwright test tests/login.spec.js

# Run products tests saja
npx playwright test tests/products.spec.js

# Run cart tests saja
npx playwright test tests/cart.spec.js
```

### Run Single Test by Title

```bash
# Run specific test berdasarkan title
npx playwright test -g "should login successfully"

# Run tests yang contain kata "cart"
npx playwright test -g "cart"
```

### Run Tests dengan UI Mode (Interactive)

```bash
npx playwright test --ui
```

UI Mode sangat berguna untuk:
- ✅ Debug tests step by step
- ✅ Lihat DOM structure
- ✅ Time travel debugging
- ✅ Watch mode (auto-rerun on changes)

### Run Tests di Headed Mode (Visible Browser)

```bash
# Run dengan browser yang terlihat (not headless)
npx playwright test --headed

# Run dengan browser terlihat + slow motion
npx playwright test --headed --slow-mo=1000
```

### Debug Mode

```bash
# Run test dengan debug mode (pause execution)
npx playwright test --debug

# Debug specific test
npx playwright test tests/login.spec.js --debug
```

### View Test Reports

```bash
# Open HTML report di browser
npx playwright show-report

# Ini akan buka interactive report dengan:
# - Test results (pass/fail)
# - Screenshots
# - Videos (jika ada test yang fail)
# - Traces
# - Error messages
```

---

## 📁 Struktur Project

```
testProject/
├── pages/                          # 📄 Page Object Models
│   ├── LoginPage.js                # POM untuk halaman login
│   ├── ProductsPage.js             # POM untuk halaman products/inventory
│   └── CartPage.js                 # POM untuk shopping cart
│
├── tests/                          # 🧪 Test Files
│   ├── login.spec.js               # Login tests (8 tests)
│   ├── products.spec.js            # Products tests (10 tests)
│   ├── cart.spec.js                # Shopping cart tests (10 tests)
│   └── example.spec.js             # Example test (reference)
│
├── utils/                          # 🛠️ Helper Utilities
│   └── testData.js                 # Test data constants (users, products, etc)
│
├── docs/                           # 📚 Documentation
│   ├── CHEATSHEET.md               # Playwright commands reference
│   └── TUTORIAL.md                 # Step-by-step tutorial
│
├── test-results/                   # 📊 Test Results (auto-generated)
│   ├── results.json                # JSON report
│   └── [screenshots & videos]      # Screenshots dan videos dari tests
│
├── playwright-report/              # 📈 HTML Report (auto-generated)
│   └── index.html                  # Interactive HTML report
│
├── playwright.config.js            # ⚙️ Playwright Configuration
├── package.json                    # 📦 NPM Dependencies
├── CLAUDE.md                       # 🤖 Claude Code Instructions
└── README.md                       # 📖 This file
```

### Penjelasan Struktur:

#### `pages/` - Page Object Models
Berisi class-class yang merepresentasikan setiap halaman. Setiap POM punya:
- **Locators**: Untuk find elements di page
- **Methods**: Untuk interact dengan elements (click, fill, etc)
- **Assertions**: Helper methods untuk verify state

**Benefits POM:**
- ✅ Code lebih maintainable
- ✅ Reusable across tests
- ✅ Easier to update ketika UI berubah
- ✅ Cleaner test code

#### `tests/` - Test Files
Berisi actual test cases, organized by feature:
- `login.spec.js`: Tests untuk login functionality
- `products.spec.js`: Tests untuk products browsing, sorting
- `cart.spec.js`: Tests untuk shopping cart operations

#### `utils/` - Utilities
Berisi helper functions dan test data:
- `testData.js`: Constants untuk users, passwords, product names, sort options, error messages

#### `docs/` - Documentation
- `CHEATSHEET.md`: Quick reference untuk Playwright commands
- `TUTORIAL.md`: Step-by-step guide untuk beginners

---

## 🎬 Test Scenarios

### Login Tests (8 tests)
1. ✅ Login sukses dengan valid credentials
2. ✅ Login gagal dengan invalid username
3. ✅ Login gagal dengan invalid password
4. ✅ Login gagal dengan locked user
5. ✅ Login gagal dengan empty username
6. ✅ Login gagal dengan empty password
7. ✅ Verify login button enabled
8. ✅ Verify login form elements visible

### Products Tests (10 tests)
1. ✅ Products page loaded successfully
2. ✅ Sort products by name A-Z
3. ✅ Sort products by name Z-A
4. ✅ Sort products by price low to high
5. ✅ Sort products by price high to low
6. ✅ Navigate to product details
7. ✅ Verify all products have images
8. ✅ Verify all products have prices
9. ✅ Verify sort dropdown updates correctly
10. ✅ Verify product names are not empty

### Cart Tests (10 tests)
1. ✅ Add single product to cart
2. ✅ Add multiple products to cart
3. ✅ Remove item from cart
4. ✅ Cart badge shows correct count
5. ✅ Continue shopping button works
6. ✅ Remove multiple items from cart
7. ✅ Verify item details in cart
8. ✅ Toggle add/remove button correctly
9. ✅ Verify empty cart state
10. ✅ Add all products to cart

**Total: 28 tests** × **3 browsers** = **84 test executions** 🚀

---

## 🏗️ Page Object Model

### Apa itu Page Object Model (POM)?

**Page Object Model** adalah design pattern di automation testing dimana:
- Setiap **page** atau **component** direpresentasikan sebagai **class**
- Setiap class berisi **locators** dan **methods** untuk interact dengan page
- Test code hanya call methods dari POM, tidak langsung interact dengan UI

### Benefits POM:

#### 1. **Maintainability**
Ketika UI berubah, cukup update POM saja, tidak perlu update semua tests.

**Without POM:**
```javascript
// Test 1
await page.locator('#user-name').fill('standard_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();

// Test 2
await page.locator('#user-name').fill('locked_user');
await page.locator('#password').fill('secret_sauce');
await page.locator('#login-button').click();

// Jika locator berubah, harus update DI SEMUA TESTS! 😱
```

**With POM:**
```javascript
// Test 1
await loginPage.login('standard_user', 'secret_sauce');

// Test 2
await loginPage.login('locked_user', 'secret_sauce');

// Jika locator berubah, cukup update di LoginPage.js saja! ✨
```

#### 2. **Reusability**
Methods di POM bisa dipakai di multiple tests.

#### 3. **Readability**
Test code lebih mudah dibaca dan dipahami.

```javascript
// Without POM - Hard to read
await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

// With POM - Easy to understand
await productsPage.sortProducts(SORT_OPTIONS.PRICE_ASC);
```

#### 4. **Collaboration**
Team bisa collaborate lebih mudah dengan structure yang jelas.

### Structure POM di Project Ini:

```javascript
// pages/LoginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    // Locators
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  // Methods
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// tests/login.spec.js
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  // Assertions...
});
```

---

## 📊 Reports dan Screenshots

### HTML Report

Setelah run tests, buka HTML report:

```bash
npx playwright show-report
```

HTML Report includes:
- ✅ Test results (passed/failed/skipped)
- ✅ Execution time per test
- ✅ Screenshots untuk setiap test
- ✅ Videos ketika test fail
- ✅ Error messages dan stack traces
- ✅ Traces untuk debugging

### JSON Report

JSON report tersimpan di: `test-results/results.json`

Berguna untuk:
- Data analysis
- Custom reporting
- CI/CD integration

### Screenshots

Semua tests automatically take screenshots. Location:
- `test-results/[test-name]/[screenshot].png`

Konfigurasi di `playwright.config.js`:
```javascript
screenshot: 'on'  // Screenshot untuk semua tests
```

### Videos

Videos direcord ketika test **gagal**. Location:
- `test-results/[test-name]/video.webm`

Konfigurasi di `playwright.config.js`:
```javascript
video: 'retain-on-failure'  // Save video hanya ketika fail
```

---

## 📚 Dokumentasi Tambahan

### 📄 CHEATSHEET.md
Quick reference untuk Playwright commands yang sering dipakai:
- Navigation commands
- Locators & Selectors
- Actions (click, fill, select, etc)
- Assertions (expect, toBeVisible, etc)
- Waits & Timeouts
- Screenshots & Videos
- Debugging techniques

👉 **[Baca CHEATSHEET.md](docs/CHEATSHEET.md)**

### 📘 TUTORIAL.md
Step-by-step tutorial untuk belajar Playwright dari nol:
1. Setup project dari scratch
2. Menulis test pertama
3. Memahami locators dan selectors
4. Refactor ke Page Object Model
5. Menjalankan dan melihat reports
6. Debugging ketika test gagal
7. Best practices untuk production

👉 **[Baca TUTORIAL.md](docs/TUTORIAL.md)**

---

## 💡 Tips dan Best Practices

### 1. **Selalu Gunakan Page Object Model**
- Jangan hardcode locators di test files
- Buat reusable methods di POM

### 2. **Gunakan Test Data Constants**
- Simpan test data di `utils/testData.js`
- Avoid magic strings di test code

### 3. **Write Descriptive Test Names**
```javascript
// ❌ Bad
test('test 1', async ({ page }) => { ... });

// ✅ Good
test('should login successfully with valid credentials', async ({ page }) => { ... });
```

### 4. **Use Proper Assertions**
```javascript
// ❌ Bad - Weak assertion
const url = page.url();
expect(url).toContain('inventory');

// ✅ Good - Strong assertion
await page.waitForURL('**/inventory.html');
await expect(page.locator('.title')).toHaveText('Products');
```

### 5. **Handle Waits Properly**
```javascript
// ❌ Bad - Hard wait
await page.waitForTimeout(5000);

// ✅ Good - Smart wait
await page.waitForLoadState('networkidle');
await element.waitFor({ state: 'visible' });
```

### 6. **Run Tests Locally Before Pushing**
```bash
# Run all tests sebelum commit
npx playwright test

# Fix any failing tests
# Check reports for issues
```

### 7. **Use UI Mode untuk Debugging**
```bash
npx playwright test --ui
```

### 8. **Keep Tests Independent**
- Setiap test harus bisa run independently
- Jangan depend on execution order
- Use `beforeEach` untuk setup yang consistent

---

## 🔧 Troubleshooting

### Issue: Browser tidak ter-install

**Error:**
```
Executable doesn't exist at C:\Users\...\chromium-1234\chrome.exe
```

**Solution:**
```bash
npx playwright install --with-deps
```

---

### Issue: Tests timeout

**Error:**
```
Test timeout of 30000ms exceeded
```

**Solution:**
- Check internet connection (SauceDemo requires internet)
- Increase timeout di `playwright.config.js`:
  ```javascript
  timeout: 60000  // 60 seconds
  ```
- Check website status: https://www.saucedemo.com/

---

### Issue: Port sudah digunakan (untuk local dev server)

**Error:**
```
Port 3000 is already in use
```

**Solution:**
- Kill process yang menggunakan port tersebut
- Atau ganti port di config

---

### Issue: Cannot find module

**Error:**
```
Cannot find module '../pages/LoginPage.js'
```

**Solution:**
```bash
# Make sure di correct directory
cd testProject

# Install dependencies
npm install
```

---

## 📖 Resources

### Playwright Documentation
- **Official Docs**: https://playwright.dev/
- **API Reference**: https://playwright.dev/docs/api/class-playwright
- **Best Practices**: https://playwright.dev/docs/best-practices

### SauceDemo Website
- **URL**: https://www.saucedemo.com/
- **Valid Users**:
  - `standard_user` / `secret_sauce`
  - `problem_user` / `secret_sauce`
  - `performance_glitch_user` / `secret_sauce`

### Learning Resources
- **Playwright YouTube Channel**: https://www.youtube.com/@Playwrightdev
- **Playwright Discord**: https://aka.ms/playwright/discord

---

## 🤝 Contributing

Project ini open untuk contribution! Jika ada:
- Bug reports
- Feature requests
- Documentation improvements
- Test scenarios tambahan

Silakan create issue atau pull request.

---

## 📄 License

This project is for educational purposes.

---

## 👨‍💻 Author

Dibuat dengan ❤️ untuk membantu beginners belajar Playwright automation testing.

**Happy Testing! 🎭🚀**

---

## 🎯 Next Steps

Setelah familiar dengan project ini:

1. ✅ Coba buat test scenarios tambahan
2. ✅ Explore Playwright features lain (API testing, mobile testing)
3. ✅ Integrate dengan CI/CD (GitHub Actions, Jenkins)
4. ✅ Add visual regression testing (Playwright screenshot comparison)
5. ✅ Try performance testing dengan Playwright
6. ✅ Explore test dengan different authentication methods

Keep learning and keep testing! 🚀
