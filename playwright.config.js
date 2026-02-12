// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration untuk SauceDemo Educational Project
 *
 * File ini mengatur semua konfigurasi untuk menjalankan Playwright tests.
 * Setiap option dijelaskan dalam Bahasa Indonesia untuk memudahkan pembelajaran.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  /**
   * testDir: Folder tempat test files berada
   * Semua file .spec.js di folder ini akan dijalankan sebagai test
   */
  testDir: './tests',

  /**
   * fullyParallel: Menjalankan semua tests secara parallel
   * true = Test berjalan bersamaan (lebih cepat)
   * false = Test berjalan satu per satu (lebih lambat tapi lebih aman)
   *
   * Untuk educational purposes, kita pakai true supaya cepat.
   */
  fullyParallel: true,

  /**
   * forbidOnly: Mencegah test.only() di CI environment
   * test.only() berguna saat development untuk run satu test saja,
   * tapi di CI harus run semua tests.
   */
  forbidOnly: !!process.env.CI,

  /**
   * retries: Jumlah retry ketika test gagal
   * Di CI: retry 2x (karena CI environment bisa unstable)
   * Di local: 0x (tidak retry, langsung tahu kalau ada error)
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * workers: Jumlah parallel workers untuk run tests
   * Di CI: 1 worker (untuk stability dan resource constraints)
   * Di local: undefined (otomatis sesuai CPU cores)
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * timeout: Timeout untuk setiap test (dalam milliseconds)
   * Default: 30000ms (30 detik)
   * Kita set 60000ms (60 detik) untuk educational purposes
   * agar ada waktu lebih untuk observe test execution
   */
  timeout: 60000,

  /**
   * reporter: Reporter untuk menampilkan test results
   *
   * Kita menggunakan multiple reporters:
   * 1. html: Interactive HTML report (bisa buka di browser)
   * 2. json: JSON report (untuk data analysis)
   * 3. list: Console output (menampilkan progress di terminal)
   *
   * HTML report akan tersimpan di playwright-report/ folder
   * JSON report akan tersimpan di test-results/results.json
   */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  /**
   * use: Settings yang digunakan untuk semua tests
   * Settings ini apply ke semua browsers (chromium, firefox, webkit)
   */
  use: {
    /**
     * baseURL: Base URL untuk website yang di-test
     * Dengan ini, kita bisa pakai page.goto('/') instead of full URL
     *
     * Example:
     * page.goto('/') -> https://www.saucedemo.com/
     * page.goto('/inventory.html') -> https://www.saucedemo.com/inventory.html
     */
    baseURL: 'https://www.saucedemo.com',

    /**
     * trace: Kapan Playwright mengcollect trace
     * Trace adalah recording dari test execution (screenshots, network calls, dll)
     *
     * Options:
     * - 'on-first-retry': Collect trace hanya ketika test retry pertama kali
     * - 'on': Collect trace untuk semua tests (slow, tidak recommended)
     * - 'off': Tidak collect trace
     *
     * Trace bisa dilihat di Trace Viewer untuk debugging.
     */
    trace: 'on-first-retry',

    /**
     * screenshot: Kapan take screenshot
     * - 'on': Screenshot untuk semua tests (educational purposes)
     * - 'only-on-failure': Screenshot hanya ketika test gagal
     * - 'off': Tidak take screenshot
     *
     * Screenshots tersimpan di test-results/ folder
     */
    screenshot: 'on',

    /**
     * video: Kapan record video
     * - 'retain-on-failure': Simpan video hanya ketika test gagal
     * - 'on': Record video untuk semua tests (banyak space)
     * - 'off': Tidak record video
     *
     * Videos tersimpan di test-results/ folder
     */
    video: 'retain-on-failure',

    /**
     * actionTimeout: Timeout untuk setiap action (click, fill, etc)
     * Default: 0 (no timeout, menggunakan test timeout)
     * Kita set 10000ms (10 detik) untuk setiap action
     */
    actionTimeout: 10000,

    /**
     * navigationTimeout: Timeout untuk navigation (page.goto, etc)
     * Kita set 30000ms (30 detik) untuk load page
     */
    navigationTimeout: 30000,
  },

  /**
   * projects: Konfigurasi browsers untuk test
   *
   * Playwright support multiple browsers:
   * - Chromium (Chrome, Edge, Opera)
   * - Firefox
   * - WebKit (Safari)
   *
   * Setiap test akan dijalankan di SEMUA browsers di bawah ini.
   * Jadi kalau ada 10 tests, total akan ada 30 test executions (10 x 3 browsers).
   *
   * Cara run specific browser:
   * - npx playwright test --project=chromium
   * - npx playwright test --project=firefox
   * - npx playwright test --project=webkit
   */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Viewport size untuk Chromium
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        // Viewport size untuk Firefox
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        // Viewport size untuk WebKit (Safari)
        viewport: { width: 1280, height: 720 },
      },
    },

    /**
     * OPTIONAL: Test against mobile viewports
     *
     * Uncomment ini jika ingin test di mobile browsers.
     * Untuk educational purposes, kita fokus ke desktop dulu.
     */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /**
     * OPTIONAL: Test against branded browsers
     *
     * Memerlukan browser yang ter-install di system:
     * - Microsoft Edge (channel: 'msedge')
     * - Google Chrome (channel: 'chrome')
     */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /**
   * webServer: Local development server (OPTIONAL)
   *
   * Jika test untuk local application, uncomment ini untuk
   * automatically start dev server sebelum run tests.
   *
   * Untuk SauceDemo (external website), kita tidak perlu ini.
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

