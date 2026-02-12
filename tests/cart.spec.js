// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { CartPage } from '../pages/CartPage.js';
import { VALID_USER, PRODUCTS } from '../utils/testData.js';

/**
 * Test Suite: Shopping Cart Functionality
 *
 * Test suite ini mengcover functionality shopping cart:
 * - Add single product to cart
 * - Add multiple products to cart
 * - Remove item from cart
 * - Cart badge shows correct count
 * - Cart interactions
 *
 * Semua test memerlukan login dan navigation ke products page terlebih dahulu.
 */
test.describe('Shopping Cart Functionality', () => {
  /**
   * Hook yang dijalankan sebelum setiap test
   * Login dan navigate ke products page
   */
  test.beforeEach(async ({ page }) => {
    // Login terlebih dahulu
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.username, VALID_USER.password);

    // Verify sudah di products page
    await page.waitForURL('**/inventory.html');
  });

  /**
   * Test Case 1: Add Single Product to Cart
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Click "Add to cart" pada salah satu product
   * 3. Navigate ke cart page
   * 4. Verify product ada di cart
   *
   * Expected Result:
   * - Product berhasil ditambahkan ke cart
   * - Cart badge menunjukkan angka 1
   * - Product visible di cart page dengan nama dan harga yang benar
   */
  test('should add single product to cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const productToAdd = PRODUCTS.BACKPACK;

    // Act
    // 1. Add product to cart
    await productsPage.addProductToCart(productToAdd);

    // 2. Verify cart badge shows 1
    const badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(1);

    // 3. Navigate to cart
    await productsPage.goToCart();

    // Assert
    // 1. Verify di cart page
    const isLoaded = await cartPage.isPageLoaded();
    expect(isLoaded).toBe(true);

    // 2. Verify cart ada 1 item
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    // 3. Verify product name correct
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toContain(productToAdd);

    // 4. Verify product price
    const itemPrice = await cartPage.getItemPrice(productToAdd);
    expect(itemPrice).toBe(29.99); // Backpack price

});

  /**
   * Test Case 2: Add Multiple Products to Cart
   *
   * Steps:
   * 1. Login dan ke products page
   * 2. Add beberapa products ke cart
   * 3. Navigate ke cart page
   * 4. Verify semua products ada di cart
   *
   * Expected Result:
   * - Semua products berhasil ditambahkan
   * - Cart badge menunjukkan jumlah yang benar
   * - Semua products visible di cart
   */
  test('should add multiple products to cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const productsToAdd = [
      PRODUCTS.BACKPACK,      // $29.99
      PRODUCTS.BIKE_LIGHT,    // $9.99
      PRODUCTS.BOLT_TSHIRT    // $15.99
    ];

    // Act
    // 1. Add multiple products
    await productsPage.addMultipleProducts(productsToAdd);

    // 2. Verify cart badge
    const badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(3);

    // 3. Navigate to cart
    await productsPage.goToCart();

    // Assert
    // 1. Verify cart has 3 items
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);

    // 2. Verify semua products ada di cart
    const cartItems = await cartPage.getCartItems();
    for (const product of productsToAdd) {
      expect(cartItems).toContain(product);
    }

    // 3. Verify total price
    const totalPrice = await cartPage.getTotalPrice();
    const expectedTotal = 29.99 + 9.99 + 15.99; // = 55.97
    expect(totalPrice).toBe(expectedTotal);

});

  /**
   * Test Case 3: Remove Item from Cart
   *
   * Steps:
   * 1. Add product to cart
   * 2. Navigate ke cart page
   * 3. Click "Remove" button
   * 4. Verify product hilang dari cart
   *
   * Expected Result:
   * - Product berhasil di-remove
   * - Cart badge update (berkurang)
   * - Cart empty jika semua items di-remove
   */
  test('should remove item from cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const productToAdd = PRODUCTS.BACKPACK;

    // Act
    // 1. Add product
    await productsPage.addProductToCart(productToAdd);

    // 2. Navigate to cart
    await productsPage.goToCart();

    // 3. Verify product ada di cart
    let hasItem = await cartPage.hasItem(productToAdd);
    expect(hasItem).toBe(true);

    // 4. Remove product
    await cartPage.removeItem(productToAdd);

    // Assert
    // 1. Verify product hilang dari cart
    hasItem = await cartPage.hasItem(productToAdd);
    expect(hasItem).toBe(false);

    // 2. Verify cart empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);

    // 3. Verify cart badge tidak visible (karena empty)
    const isBadgeVisible = await cartPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(false);

});

  /**
   * Test Case 4: Cart Badge Shows Correct Count
   *
   * Test untuk verify cart badge selalu menunjukkan jumlah yang benar
   * ketika add/remove items
   */
  test('should display correct cart badge count', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);

    // Act & Assert

    // 1. Initially, badge tidak visible (cart empty)
    let isBadgeVisible = await productsPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(false);

    // 2. Add 1 product -> badge shows 1
    await productsPage.addProductToCart(PRODUCTS.BACKPACK);
    let badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(1);

    // 3. Add 2nd product -> badge shows 2
    await productsPage.addProductToCart(PRODUCTS.BIKE_LIGHT);
    badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(2);

    // 4. Add 3rd product -> badge shows 3
    await productsPage.addProductToCart(PRODUCTS.BOLT_TSHIRT);
    badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(3);

    // 5. Remove 1 product -> badge shows 2
    await productsPage.removeProductFromCart(PRODUCTS.BIKE_LIGHT);
    badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(2);

});

  /**
   * Test Case 5: Continue Shopping Button
   *
   * Steps:
   * 1. Add product to cart
   * 2. Navigate ke cart page
   * 3. Click "Continue Shopping"
   * 4. Verify kembali ke products page
   *
   * Expected Result:
   * - Redirect ke products page
   * - Items tetap ada di cart (tidak hilang)
   */
  test('should navigate back to products page when clicking continue shopping', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Act
    // 1. Add product
    await productsPage.addProductToCart(PRODUCTS.BACKPACK);

    // 2. Go to cart
    await productsPage.goToCart();

    // 3. Click continue shopping
    await cartPage.clickContinueShopping();

    // Assert
    // 1. Verify kembali ke products page
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('inventory.html');

    // 2. Verify item masih di cart (badge still shows 1)
    const badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(1);

    // 3. Verify products page loaded
    const isLoaded = await productsPage.isPageLoaded();
    expect(isLoaded).toBe(true);
  });

  /**
   * Test Case 6: Remove Multiple Items from Cart
   *
   * Test untuk remove beberapa items sekaligus
   */
  test('should remove multiple items from cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const productsToAdd = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT
    ];

    // Act
    // 1. Add multiple products
    await productsPage.addMultipleProducts(productsToAdd);

    // 2. Go to cart
    await productsPage.goToCart();

    // 3. Verify ada 3 items
    let itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(3);

    // 4. Remove 2 items
    await cartPage.removeItem(PRODUCTS.BACKPACK);
    await cartPage.removeItem(PRODUCTS.BIKE_LIGHT);

    // Assert
    // 1. Verify tinggal 1 item
    itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(1);

    // 2. Verify hanya Bolt T-Shirt yang tersisa
    const cartItems = await cartPage.getCartItems();
    expect(cartItems).toContain(PRODUCTS.BOLT_TSHIRT);
    expect(cartItems).not.toContain(PRODUCTS.BACKPACK);
    expect(cartItems).not.toContain(PRODUCTS.BIKE_LIGHT);

});

  /**
   * Test Case 7: Verify Item Details in Cart
   *
   * Test untuk verify bahwa item details (name, price, quantity, description)
   * ditampilkan dengan benar di cart
   */
  test('should display correct item details in cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const productToAdd = PRODUCTS.BACKPACK;

    // Act
    // 1. Add product
    await productsPage.addProductToCart(productToAdd);

    // 2. Go to cart
    await productsPage.goToCart();

    // Assert
    // 1. Verify item name
    const hasItem = await cartPage.hasItem(productToAdd);
    expect(hasItem).toBe(true);

    // 2. Verify item price
    const itemPrice = await cartPage.getItemPrice(productToAdd);
    expect(itemPrice).toBe(29.99);

    // 3. Verify item quantity (default = 1)
    const itemQty = await cartPage.getItemQuantity(productToAdd);
    expect(itemQty).toBe(1);

    // 4. Verify item description ada
    const itemDesc = await cartPage.getItemDescription(productToAdd);
    expect(itemDesc).toBeTruthy();
    expect(itemDesc.length).toBeGreaterThan(0);

});

  /**
   * Test Case 8: Add and Remove Same Product
   *
   * Test untuk verify add dan remove product yang sama
   * Button harus berubah dari "Add to cart" -> "Remove" -> "Add to cart"
   */
  test('should toggle add/remove button correctly', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const productToTest = PRODUCTS.BACKPACK;

    // Act & Assert

    // 1. Initially, product tidak ada di cart
    let isInCart = await productsPage.isProductInCart(productToTest);
    expect(isInCart).toBe(false);

    // 2. Add product -> button berubah jadi "Remove"
    await productsPage.addProductToCart(productToTest);
    isInCart = await productsPage.isProductInCart(productToTest);
    expect(isInCart).toBe(true);

    // 3. Badge shows 1
    let badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(1);

    // 4. Remove product -> button kembali jadi "Add to cart"
    await productsPage.removeProductFromCart(productToTest);
    isInCart = await productsPage.isProductInCart(productToTest);
    expect(isInCart).toBe(false);

    // 5. Badge hilang (cart empty)
    badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(0);
  });

  /**
   * Test Case 9: Verify Empty Cart State
   *
   * Test untuk verify tampilan cart ketika kosong
   */
  test('should display empty cart correctly', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    // Act - Navigate to cart without adding any items
    await productsPage.goToCart();

    // Assert
    // 1. Verify di cart page
    const isLoaded = await cartPage.isPageLoaded();
    expect(isLoaded).toBe(true);

    // 2. Verify cart empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBe(true);

    // 3. Verify item count = 0
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(0);

    // 4. Verify badge tidak visible
    const isBadgeVisible = await cartPage.isCartBadgeVisible();
    expect(isBadgeVisible).toBe(false);

    // 5. Verify checkout button still visible (enabled even when empty in SauceDemo)
    await expect(cartPage.checkoutButton).toBeVisible();

});

  /**
   * Test Case 10: Add All Products to Cart
   *
   * Test untuk add semua 6 products ke cart dan verify
   */
  test('should add all products to cart', async ({ page }) => {
    // Arrange
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    const allProducts = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
      PRODUCTS.ONESIE,
      PRODUCTS.TSHIRT_RED
    ];

    // Act
    // Add all products
    await productsPage.addMultipleProducts(allProducts);

    // Assert
    // 1. Verify badge shows 6
    const badgeCount = await productsPage.getCartItemCount();
    expect(badgeCount).toBe(6);

    // 2. Navigate to cart
    await productsPage.goToCart();

    // 3. Verify cart has 6 items
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(6);

    // 4. Verify semua products ada di cart
    const cartItems = await cartPage.getCartItems();
    for (const product of allProducts) {
      expect(cartItems).toContain(product);
    }

    // 5. Verify total price
    const totalPrice = await cartPage.getTotalPrice();
    // Total: 29.99 + 9.99 + 15.99 + 49.99 + 7.99 + 15.99 = 129.94
    expect(totalPrice).toBeCloseTo(129.94, 2);

});
});
