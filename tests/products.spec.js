// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { VALID_USER, PRODUCTS, SORT_OPTIONS } from '../utils/testData.js';

/**
 * Test Suite: Products Page Functionality
 *
 * Test suite ini mengcover functionality di halaman products:
 * - Verify products loaded successfully
 * - Sorting products (A-Z, Z-A, Price low-high, Price high-low)
 * - View product details
 * - Product interactions
 *
 * Semua test memerlukan login terlebih dahulu.
 */
test.describe('Products Page Functionality', () => {
  /**
   * Hook yang dijalankan sebelum setiap test
   * Login dulu sebelum test products page
   */
  test.beforeEach(async ({ page }) => {
    // Login terlebih dahulu karena products page requires authentication
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);

    // Verify sudah di products page
    await page.waitForURL('**/inventory.html');
  });

  /**
   * Test Case 1: Verify Products Page Loaded Successfully
   *
   * Steps:
   * 1. Login dengan valid credentials
   * 2. Check halaman products loaded
   *
   * Expected Result:
   * - Page title "Products" visible
   * - Ada 6 products ditampilkan
   * - Sort dropdown visible
   * - Shopping cart icon visible
   */
  test('should load products page successfully', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Assert
    // 1. Verify page loaded
    const isLoaded = await productsPage.isPageLoaded();
    expect(isLoaded).toBe(true);

    // 2. Verify page title
    await expect(productsPage.pageTitle).toBeVisible();
    await expect(productsPage.pageTitle).toHaveText('Products');

    // 3. Verify ada 6 products (SauceDemo punya 6 products)
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBe(6);

    // 4. Verify sort dropdown visible
    await expect(productsPage.sortDropdown).toBeVisible();

    // 5. Verify cart icon visible
    await expect(productsPage.cartIcon).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-page-loaded.png', fullPage: true });
  });

  /**
   * Test Case 2: Sort Products by Name (A to Z)
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Select sort option "Name (A to Z)"
   * 3. Verify products tersort dengan benar
   *
   * Expected Result:
   * - Products disort alphabetically A-Z
   * - Urutan: Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Red T-Shirt
   */
  test('should sort products by name A to Z', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act - Sort by name A-Z (ini adalah default sort)
    await productsPage.sortProducts(SORT_OPTIONS.NAME_ASC);

    // Assert
    // Get product names setelah sort
    const productNames = await productsPage.getProductNames();

    // Verify urutan alphabetically
    const expectedOrder = [
      PRODUCTS.BACKPACK,           // Sauce Labs Backpack
      PRODUCTS.BIKE_LIGHT,         // Sauce Labs Bike Light
      PRODUCTS.BOLT_TSHIRT,        // Sauce Labs Bolt T-Shirt
      PRODUCTS.FLEECE_JACKET,      // Sauce Labs Fleece Jacket
      PRODUCTS.ONESIE,             // Sauce Labs Onesie
      PRODUCTS.TSHIRT_RED          // Test.allTheThings() T-Shirt (Red)
    ];

    expect(productNames).toEqual(expectedOrder);

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-sort-name-asc.png', fullPage: true });
  });

  /**
   * Test Case 3: Sort Products by Name (Z to A)
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Select sort option "Name (Z to A)"
   * 3. Verify products tersort dengan benar
   *
   * Expected Result:
   * - Products disort alphabetically Z-A (reverse)
   */
  test('should sort products by name Z to A', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act - Sort by name Z-A
    await productsPage.sortProducts(SORT_OPTIONS.NAME_DESC);

    // Assert
    const productNames = await productsPage.getProductNames();

    // Expected order adalah reverse dari A-Z
    const expectedOrder = [
      PRODUCTS.TSHIRT_RED,         // Test.allTheThings() T-Shirt (Red)
      PRODUCTS.ONESIE,             // Sauce Labs Onesie
      PRODUCTS.FLEECE_JACKET,      // Sauce Labs Fleece Jacket
      PRODUCTS.BOLT_TSHIRT,        // Sauce Labs Bolt T-Shirt
      PRODUCTS.BIKE_LIGHT,         // Sauce Labs Bike Light
      PRODUCTS.BACKPACK            // Sauce Labs Backpack
    ];

    expect(productNames).toEqual(expectedOrder);

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-sort-name-desc.png', fullPage: true });
  });

  /**
   * Test Case 4: Sort Products by Price (Low to High)
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Select sort option "Price (low to high)"
   * 3. Verify products tersort by price ascending
   *
   * Expected Result:
   * - Products disort dari harga terendah ke tertinggi
   * - Onesie ($7.99) -> Bike Light ($9.99) -> ... -> Fleece Jacket ($49.99)
   */
  test('should sort products by price low to high', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act - Sort by price low to high
    await productsPage.sortProducts(SORT_OPTIONS.PRICE_ASC);

    // Assert
    const productPrices = await productsPage.getProductPrices();

    // Verify prices dalam ascending order
    const sortedPrices = [...productPrices].sort((a, b) => a - b);
    expect(productPrices).toEqual(sortedPrices);

    // Verify harga pertama dan terakhir
    expect(productPrices[0]).toBe(7.99);   // Onesie (termurah)
    expect(productPrices[5]).toBe(49.99);  // Fleece Jacket (termahal)

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-sort-price-asc.png', fullPage: true });
  });

  /**
   * Test Case 5: Sort Products by Price (High to Low)
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Select sort option "Price (high to low)"
   * 3. Verify products tersort by price descending
   *
   * Expected Result:
   * - Products disort dari harga tertinggi ke terendah
   * - Fleece Jacket ($49.99) -> ... -> Onesie ($7.99)
   */
  test('should sort products by price high to low', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act - Sort by price high to low
    await productsPage.sortProducts(SORT_OPTIONS.PRICE_DESC);

    // Assert
    const productPrices = await productsPage.getProductPrices();

    // Verify prices dalam descending order
    const sortedPrices = [...productPrices].sort((a, b) => b - a);
    expect(productPrices).toEqual(sortedPrices);

    // Verify harga pertama dan terakhir
    expect(productPrices[0]).toBe(49.99);  // Fleece Jacket (termahal)
    expect(productPrices[5]).toBe(7.99);   // Onesie (termurah)

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-sort-price-desc.png', fullPage: true });
  });

  /**
   * Test Case 6: Click Product Name to View Details
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Click salah satu product name
   * 3. Verify redirect ke product detail page
   *
   * Expected Result:
   * - Redirect ke halaman product detail
   * - URL berubah ke inventory-item.html
   * - Product name dan details visible
   */
  test('should navigate to product details when clicking product name', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const productToClick = PRODUCTS.BACKPACK;

    // Act - Click product name
    await productsPage.clickProductName(productToClick);

    // Assert
    // 1. Verify URL berubah ke product detail page
    await page.waitForURL('**/inventory-item.html*');
    expect(page.url()).toContain('inventory-item.html');

    // 2. Verify product name visible di detail page
    const detailProductName = page.locator('.inventory_details_name');
    await expect(detailProductName).toBeVisible();
    await expect(detailProductName).toHaveText(productToClick);

    // 3. Verify product description visible
    const productDesc = page.locator('.inventory_details_desc');
    await expect(productDesc).toBeVisible();

    // 4. Verify product price visible
    const productPrice = page.locator('.inventory_details_price');
    await expect(productPrice).toBeVisible();

    // Take screenshot of product detail page
    await page.screenshot({ path: 'test-results/product-detail-page.png', fullPage: true });
  });

  /**
   * Test Case 7: Verify All Products Have Images
   *
   * Test untuk verify semua products punya images dan images loaded
   */
  test('should display images for all products', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Assert
    const productCount = await productsPage.getProductCount();

    // Check setiap product punya image
    for (let i = 0; i < productCount; i++) {
      const productImage = productsPage.productImages.nth(i);

      // Verify image visible
      await expect(productImage).toBeVisible();
    }

    // Take screenshot
    await page.screenshot({ path: 'test-results/products-with-images.png', fullPage: true });
  });

  /**
   * Test Case 8: Verify All Products Have Prices
   *
   * Test untuk verify semua products menampilkan harga
   */
  test('should display prices for all products', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act
    const prices = await productsPage.getProductPrices();

    // Assert
    // 1. Verify ada 6 prices
    expect(prices).toHaveLength(6);

    // 2. Verify semua prices adalah number dan > 0
    for (const price of prices) {
      expect(price).toBeGreaterThan(0);
      expect(typeof price).toBe('number');
    }

    // 3. Verify format harga (semua harga punya 2 decimal places)
    const priceElements = await productsPage.productPrices.all();
    for (const priceElement of priceElements) {
      const priceText = await priceElement.textContent();

      // Check format $XX.XX
      expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
    }
  });

  /**
   * Test Case 9: Verify Current Sort Option
   *
   * Test untuk verify bahwa sort option yang dipilih correct
   */
  test('should update sort dropdown when selecting different sort option', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act & Assert untuk setiap sort option
    // 1. Sort by name Z-A
    await productsPage.sortProducts(SORT_OPTIONS.NAME_DESC);
    let currentSort = await productsPage.getCurrentSortOption();
    expect(currentSort).toBe(SORT_OPTIONS.NAME_DESC);

    // 2. Sort by price low to high
    await productsPage.sortProducts(SORT_OPTIONS.PRICE_ASC);
    currentSort = await productsPage.getCurrentSortOption();
    expect(currentSort).toBe(SORT_OPTIONS.PRICE_ASC);

    // 3. Sort by price high to low
    await productsPage.sortProducts(SORT_OPTIONS.PRICE_DESC);
    currentSort = await productsPage.getCurrentSortOption();
    expect(currentSort).toBe(SORT_OPTIONS.PRICE_DESC);

    // 4. Sort by name A-Z (kembali ke default)
    await productsPage.sortProducts(SORT_OPTIONS.NAME_ASC);
    currentSort = await productsPage.getCurrentSortOption();
    expect(currentSort).toBe(SORT_OPTIONS.NAME_ASC);
  });

  /**
   * Test Case 10: Verify Product Names are Not Empty
   *
   * Test untuk verify semua products punya nama yang tidak kosong
   */
  test('should have non-empty product names', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act
    const productNames = await productsPage.getProductNames();

    // Assert
    // 1. Ada 6 product names
    expect(productNames).toHaveLength(6);

    // 2. Semua names tidak kosong
    for (const name of productNames) {
      expect(name).toBeTruthy();
      expect(name.length).toBeGreaterThan(0);
    }
  });
});
