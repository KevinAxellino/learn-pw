// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import {
  VALID_USER,
  LOCKED_USER,
  INVALID_USER,
  INVALID_PASSWORD,
  ERROR_MESSAGES
} from '../utils/testData.js';

/**
 * Test Suite: Login Functionality
 *
 * Test suite ini mengcover semua skenario login di SauceDemo:
 * - Login dengan valid credentials (sukses)
 * - Login dengan invalid username (gagal)
 * - Login dengan invalid password (gagal)
 * - Login dengan locked user (gagal)
 *
 * Menggunakan LoginPage (Page Object Model) untuk cleaner test code.
 */
test.describe('Login Functionality', () => {
  /**
   * Hook yang dijalankan sebelum setiap test
   * Membuat instance LoginPage dan navigate ke halaman login
   */
  test.beforeEach(async ({ page }) => {
    // Create LoginPage instance
    const loginPage = new LoginPage(page);

    // Navigate ke halaman login
    await loginPage.goto();
  });

  /**
   * Test Case 1: Login Sukses dengan Valid Credentials
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Input username yang valid (standard_user)
   * 3. Input password yang valid (secret_sauce)
   * 4. Click button login
   *
   * Expected Result:
   * - User berhasil login
   * - Redirect ke halaman products/inventory
   * - URL berubah menjadi inventory.html
   */
  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange - Setup test
    const loginPage = new LoginPage(page);

    // Act - Perform action
    await loginPage.login(VALID_USER.username, VALID_USER.password);

    // Assert - Verify result
    // 1. Check apakah login sukses
    const isSuccess = await loginPage.isLoginSuccessful();
    expect(isSuccess).toBe(true);

    // 2. Check URL sudah berubah ke inventory page
    expect(page.url()).toContain('inventory.html');

    // 3. Check page title "Products" visible
    const pageTitle = page.locator('.title');
    await expect(pageTitle).toBeVisible();
    await expect(pageTitle).toHaveText('Products');

    // Take screenshot untuk dokumentasi
    await page.screenshot({ path: 'test-results/login-success.png', fullPage: true });
  });

  /**
   * Test Case 2: Login Gagal dengan Invalid Username
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Input username yang invalid/tidak terdaftar
   * 3. Input password
   * 4. Click button login
   *
   * Expected Result:
   * - Login gagal
   * - Error message muncul
   * - Error message: "Username and password do not match any user"
   * - User tetap di halaman login (tidak redirect)
   */
  test('should show error with invalid username', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login(INVALID_USER.username, INVALID_USER.password);

    // Assert
    // 1. Check error message visible
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);

    // 2. Check error message text correct
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);

    // 3. Check masih di login page (tidak redirect)
    const isOnLoginPage = await loginPage.isOnLoginPage();
    expect(isOnLoginPage).toBe(true);

    // Take screenshot error message
    await page.screenshot({ path: 'test-results/login-invalid-username.png', fullPage: true });
  });

  /**
   * Test Case 3: Login Gagal dengan Invalid Password
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Input username yang valid
   * 3. Input password yang salah
   * 4. Click button login
   *
   * Expected Result:
   * - Login gagal
   * - Error message muncul
   * - Error message: "Username and password do not match any user"
   */
  test('should show error with invalid password', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act - Login dengan valid username tapi invalid password
    await loginPage.login(VALID_USER.username, INVALID_PASSWORD);

    // Assert
    // 1. Check error message muncul
    await expect(loginPage.errorMessage).toBeVisible();

    // 2. Check error message text
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);

    // 3. Verify login tidak sukses
    const isSuccess = await loginPage.isLoginSuccessful();
    expect(isSuccess).toBe(false);

    // Take screenshot
    await page.screenshot({ path: 'test-results/login-invalid-password.png', fullPage: true });
  });

  /**
   * Test Case 4: Login Gagal dengan Locked User
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Input username locked_out_user
   * 3. Input password yang valid
   * 4. Click button login
   *
   * Expected Result:
   * - Login gagal
   * - Error message: "Sorry, this user has been locked out"
   * - User tetap di login page
   *
   * Note: Ini adalah test case khusus SauceDemo untuk simulate user yang di-block
   */
  test('should show error with locked out user', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act
    await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);

    // Assert
    // 1. Check error message visible
    await expect(loginPage.errorMessage).toBeVisible();

    // 2. Check error message specific untuk locked user
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.LOCKED_USER);

    // 3. Verify user masih di login page
    expect(page.url()).not.toContain('inventory.html');

    // Take screenshot locked user error
    await page.screenshot({ path: 'test-results/login-locked-user.png', fullPage: true });
  });

  /**
   * Test Case 5: Login Gagal dengan Empty Username
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Biarkan username kosong
   * 3. Input password
   * 4. Click button login
   *
   * Expected Result:
   * - Error message: "Username is required"
   */
  test('should show error when username is empty', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act - Login dengan username kosong
    await loginPage.login('', VALID_USER.password);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.MISSING_USERNAME);

    // Take screenshot
    await page.screenshot({ path: 'test-results/login-empty-username.png', fullPage: true });
  });

  /**
   * Test Case 6: Login Gagal dengan Empty Password
   *
   * Steps:
   * 1. Buka halaman login
   * 2. Input username
   * 3. Biarkan password kosong
   * 4. Click button login
   *
   * Expected Result:
   * - Error message: "Password is required"
   */
  test('should show error when password is empty', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Act - Login dengan password kosong
    await loginPage.login(VALID_USER.username, '');

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.MISSING_PASSWORD);

    // Take screenshot
    await page.screenshot({ path: 'test-results/login-empty-password.png', fullPage: true });
  });

  /**
   * Test Case 7: Verify Login Button is Enabled
   *
   * Simple test untuk verify button login clickable
   */
  test('should have enabled login button', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Assert
    await expect(loginPage.loginButton).toBeEnabled();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toHaveValue('Login');
  });

  /**
   * Test Case 8: Verify Input Fields are Visible
   *
   * Test untuk verify semua elemen login form ada dan visible
   */
  test('should display all login form elements', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);

    // Assert - Check semua elemen visible
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();

    // Check placeholder text
    await expect(loginPage.usernameInput).toHaveAttribute('placeholder', 'Username');
    await expect(loginPage.passwordInput).toHaveAttribute('placeholder', 'Password');

    // Take screenshot halaman login
    await page.screenshot({ path: 'test-results/login-page-elements.png', fullPage: true });
  });
});
