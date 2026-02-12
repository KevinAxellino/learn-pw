// @ts-check

/**
 * LoginPage - Page Object Model untuk halaman login SauceDemo
 *
 * Class ini merepresentasikan halaman login dan menyediakan methods
 * untuk berinteraksi dengan elemen-elemen di halaman tersebut.
 *
 * Menggunakan POM (Page Object Model) membuat test lebih mudah di-maintain
 * karena semua locator dan logic ada di satu tempat.
 */
export class LoginPage {
  /**
   * Constructor - Menerima page object dari Playwright
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;

    // ==================== LOCATORS ====================
    // Locators adalah cara Playwright menemukan elemen di halaman
    // Menggunakan data-test attribute karena lebih stabil dari class/id

    /**
     * Input field untuk username
     * Menggunakan ID selector karena sudah unique
     */
    this.usernameInput = page.locator('#user-name');

    /**
     * Input field untuk password
     * Menggunakan ID selector karena sudah unique
     */
    this.passwordInput = page.locator('#password');

    /**
     * Button untuk submit login
     * Menggunakan ID selector karena sudah unique
     */
    this.loginButton = page.locator('#login-button');

    /**
     * Error message yang muncul ketika login gagal
     * Menggunakan data-test attribute untuk lebih reliable
     */
    this.errorMessage = page.locator('[data-test="error"]');

    /**
     * Button untuk close error message
     */
    this.errorCloseButton = page.locator('.error-button');

    /**
     * Logo SauceDemo (muncul di inventory page setelah login sukses)
     */
    this.inventoryLogo = page.locator('.app_logo');
  }

  // ==================== METHODS ====================
  // Methods adalah actions yang bisa dilakukan di halaman ini

  /**
   * Navigate ke halaman login
   * Method ini membuka URL login SauceDemo
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  /**
   * Melakukan login dengan username dan password
   *
   * @param {string} username - Username untuk login
   * @param {string} password - Password untuk login
   *
   * @example
   * await loginPage.login('standard_user', 'secret_sauce');
   */
  async login(username, password) {
    // Fill username
    await this.usernameInput.fill(username);

    // Fill password
    await this.passwordInput.fill(password);

    // Click login button
    await this.loginButton.click();
  }

  /**
   * Mendapatkan text dari error message
   *
   * @returns {Promise<string>} Text dari error message
   *
   * @example
   * const errorText = await loginPage.getErrorMessage();
   * expect(errorText).toContain('locked out');
   */
  async getErrorMessage() {
    // Wait sampai error message muncul
    await this.errorMessage.waitFor({ state: 'visible' });

    // Return text dari error message
    return await this.errorMessage.textContent();
  }

  /**
   * Mengecek apakah error message visible
   *
   * @returns {Promise<boolean>} True jika error message visible
   */
  async isErrorVisible() {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Mengecek apakah login berhasil
   * Login dianggap sukses jika sudah redirect ke inventory page
   *
   * @returns {Promise<boolean>} True jika login sukses
   *
   * @example
   * await loginPage.login('standard_user', 'secret_sauce');
   * const isSuccess = await loginPage.isLoginSuccessful();
   * expect(isSuccess).toBe(true);
   */
  async isLoginSuccessful() {
    try {
      // Cek apakah URL sudah berubah ke inventory.html
      await this.page.waitForURL('**/inventory.html', { timeout: 5000 });

      // Cek apakah logo app sudah visible (berarti sudah di inventory page)
      await this.inventoryLogo.waitFor({ state: 'visible', timeout: 3000 });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Mengecek apakah masih di halaman login
   *
   * @returns {Promise<boolean>} True jika masih di halaman login
   */
  async isOnLoginPage() {
    const currentUrl = this.page.url();
    return currentUrl === 'https://www.saucedemo.com/' ||
           currentUrl === 'https://www.saucedemo.com/index.html';
  }

  /**
   * Clear input fields (username dan password)
   * Berguna untuk test yang perlu reset form
   */
  async clearInputs() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Close error message dengan click button X
   */
  async closeErrorMessage() {
    if (await this.isErrorVisible()) {
      await this.errorCloseButton.click();
    }
  }

  /**
   * Take screenshot dengan nama yang deskriptif
   *
   * @param {string} screenshotName - Nama file screenshot
   */
  async takeScreenshot(screenshotName) {
    await this.page.screenshot({
      path: `screenshots/${screenshotName}.png`,
      fullPage: true
    });
  }
}
