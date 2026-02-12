// @ts-check

/**
 * CartPage - Page Object Model untuk halaman shopping cart SauceDemo
 *
 * Class ini merepresentasikan halaman cart dan menyediakan methods
 * untuk manage items di cart (view, remove, checkout, dll).
 *
 * User sampai di halaman ini setelah click cart icon dari products page.
 */
export class CartPage {
  /**
   * Constructor - Menerima page object dari Playwright
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;

    // ==================== LOCATORS ====================

    /**
     * Title halaman "Your Cart"
     * Untuk verify bahwa kita berada di halaman cart
     */
    this.pageTitle = page.locator('.title');

    /**
     * Container untuk cart items
     */
    this.cartList = page.locator('.cart_list');

    /**
     * Semua cart items (products yang ada di cart)
     */
    this.cartItems = page.locator('.cart_item');

    /**
     * Semua product names di cart
     */
    this.itemNames = page.locator('.inventory_item_name');

    /**
     * Semua product prices di cart
     */
    this.itemPrices = page.locator('.inventory_item_price');

    /**
     * Semua product quantities di cart
     */
    this.itemQuantities = page.locator('.cart_quantity');

    /**
     * Semua button "Remove" untuk remove item dari cart
     */
    this.removeButtons = page.locator('button[id^="remove"]');

    /**
     * Button "Continue Shopping" untuk kembali ke products page
     */
    this.continueShoppingButton = page.locator('#continue-shopping');

    /**
     * Button "Checkout" untuk lanjut ke checkout process
     */
    this.checkoutButton = page.locator('#checkout');

    /**
     * Shopping cart badge (menampilkan jumlah items)
     */
    this.cartBadge = page.locator('.shopping_cart_badge');

    /**
     * Shopping cart icon
     */
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate ke cart page
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  /**
   * Click "Continue Shopping" untuk kembali ke products page
   */
  async clickContinueShopping() {
    await this.continueShoppingButton.click();
    await this.page.waitForURL('**/inventory.html');
  }

  /**
   * Click "Checkout" untuk lanjut ke checkout page
   */
  async clickCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  // ==================== VERIFICATION METHODS ====================

  /**
   * Mengecek apakah halaman cart sudah loaded dengan benar
   *
   * @returns {Promise<boolean>} True jika halaman loaded
   */
  async isPageLoaded() {
    try {
      await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });

      const titleText = await this.pageTitle.textContent();
      return titleText === 'Your Cart';
    } catch {
      return false;
    }
  }

  /**
   * Check apakah cart kosong (tidak ada items)
   *
   * @returns {Promise<boolean>} True jika cart kosong
   */
  async isCartEmpty() {
    const itemCount = await this.cartItems.count();
    return itemCount === 0;
  }

  /**
   * Get jumlah items di cart
   *
   * @returns {Promise<number>} Jumlah items
   *
   * @example
   * const count = await cartPage.getCartItemCount();
   * expect(count).toBe(3);
   */
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Get jumlah dari cart badge
   * Badge ini muncul di cart icon kalau ada items
   *
   * @returns {Promise<number>} Jumlah items (0 jika badge tidak visible)
   */
  async getCartBadgeCount() {
    try {
      await this.cartBadge.waitFor({ state: 'visible', timeout: 2000 });
      const badgeText = await this.cartBadge.textContent();
      return parseInt(badgeText);
    } catch {
      return 0;
    }
  }

  /**
   * Check apakah cart badge visible
   *
   * @returns {Promise<boolean>} True jika badge visible
   */
  async isCartBadgeVisible() {
    try {
      await this.cartBadge.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== CART ITEMS METHODS ====================

  /**
   * Get list semua item names di cart
   *
   * @returns {Promise<string[]>} Array of item names
   *
   * @example
   * const items = await cartPage.getCartItems();
   * // ['Sauce Labs Backpack', 'Sauce Labs Bike Light']
   */
  async getCartItems() {
    const count = await this.itemNames.count();
    const items = [];

    for (let i = 0; i < count; i++) {
      const name = await this.itemNames.nth(i).textContent();
      items.push(name);
    }

    return items;
  }

  /**
   * Get list semua item prices di cart
   *
   * @returns {Promise<number[]>} Array of prices
   */
  async getCartItemPrices() {
    const count = await this.itemPrices.count();
    const prices = [];

    for (let i = 0; i < count; i++) {
      const priceText = await this.itemPrices.nth(i).textContent();
      // Remove '$' dan convert ke number
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }

    return prices;
  }

  /**
   * Get total price dari semua items di cart
   *
   * @returns {Promise<number>} Total price
   *
   * @example
   * const total = await cartPage.getTotalPrice();
   * expect(total).toBe(39.98);
   */
  async getTotalPrice() {
    const prices = await this.getCartItemPrices();
    return prices.reduce((sum, price) => sum + price, 0);
  }

  /**
   * Check apakah specific item ada di cart
   *
   * @param {string} itemName - Nama item yang dicari
   * @returns {Promise<boolean>} True jika item ada di cart
   *
   * @example
   * const hasBackpack = await cartPage.hasItem('Sauce Labs Backpack');
   * expect(hasBackpack).toBe(true);
   */
  async hasItem(itemName) {
    const items = await this.getCartItems();
    return items.includes(itemName);
  }

  // ==================== REMOVE ITEMS METHODS ====================

  /**
   * Remove item dari cart by item name
   *
   * @param {string} itemName - Nama item yang ingin di-remove
   *
   * @example
   * await cartPage.removeItem('Sauce Labs Backpack');
   */
  async removeItem(itemName) {
    // Strategy: Find cart item by name, then click Remove button within it
    // This is more reliable than generating button IDs

    // Find the cart item container yang contains item name
    const cartItem = this.page.locator('.cart_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    });

    // Find dan click "Remove" button di dalam cart item tersebut
    const removeButton = cartItem.locator('button', { hasText: 'Remove' });
    await removeButton.click();

    // Wait sebentar untuk item hilang
    await this.page.waitForTimeout(300);
  }

  /**
   * Remove multiple items dari cart
   *
   * @param {string[]} itemNames - Array of item names
   *
   * @example
   * await cartPage.removeMultipleItems([
   *   'Sauce Labs Backpack',
   *   'Sauce Labs Bike Light'
   * ]);
   */
  async removeMultipleItems(itemNames) {
    for (const itemName of itemNames) {
      await this.removeItem(itemName);
    }
  }

  /**
   * Remove semua items dari cart
   */
  async removeAllItems() {
    const items = await this.getCartItems();

    for (const item of items) {
      await this.removeItem(item);
    }
  }

  /**
   * Remove item by index (posisi di cart)
   *
   * @param {number} index - Index item (0-based)
   *
   * @example
   * // Remove item pertama
   * await cartPage.removeItemByIndex(0);
   */
  async removeItemByIndex(index) {
    const removeButton = this.removeButtons.nth(index);
    await removeButton.click();
    await this.page.waitForTimeout(300);
  }

  // ==================== ITEM DETAILS METHODS ====================

  /**
   * Get price dari specific item by name
   *
   * @param {string} itemName - Nama item
   * @returns {Promise<number>} Price dalam number
   */
  async getItemPrice(itemName) {
    // Find cart item yang mengandung item name
    const cartItem = this.page.locator('.cart_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    });

    // Get price dari cart item tersebut
    const priceText = await cartItem.locator('.inventory_item_price').textContent();

    // Remove '$' dan convert ke number
    return parseFloat(priceText.replace('$', ''));
  }

  /**
   * Get quantity dari specific item by name
   * Di SauceDemo, quantity selalu 1 (tidak bisa ubah quantity)
   *
   * @param {string} itemName - Nama item
   * @returns {Promise<number>} Quantity
   */
  async getItemQuantity(itemName) {
    // Find cart item yang mengandung item name
    const cartItem = this.page.locator('.cart_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    });

    // Get quantity dari cart item tersebut
    const quantityText = await cartItem.locator('.cart_quantity').textContent();

    return parseInt(quantityText);
  }

  /**
   * Get description dari specific item by name
   *
   * @param {string} itemName - Nama item
   * @returns {Promise<string>} Description text
   */
  async getItemDescription(itemName) {
    const cartItem = this.page.locator('.cart_item', {
      has: this.page.locator('.inventory_item_name', { hasText: itemName })
    });

    return await cartItem.locator('.inventory_item_desc').textContent();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Wait for cart to update
   * Berguna setelah add/remove item
   */
  async waitForCartUpdate() {
    await this.page.waitForTimeout(500);
  }
}
