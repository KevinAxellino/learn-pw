// @ts-check

/**
 * ProductsPage - Page Object Model untuk halaman inventory/products SauceDemo
 *
 * Class ini merepresentasikan halaman products (inventory) dan menyediakan
 * methods untuk browsing products, sorting, add to cart, dll.
 *
 * Halaman ini adalah halaman utama setelah login sukses.
 */
export class ProductsPage {
  /**
   * Constructor - Menerima page object dari Playwright
   * @param {import('@playwright/test').Page} page - Playwright page object
   */
  constructor(page) {
    this.page = page;

    // ==================== LOCATORS ====================

    /**
     * Title halaman "Products"
     * Untuk verify bahwa kita berada di halaman products
     */
    this.pageTitle = page.locator('.title');

    /**
     * Container untuk semua product items
     */
    this.inventoryContainer = page.locator('.inventory_list');

    /**
     * Semua product items di halaman
     * Menggunakan .inventory_item class
     */
    this.productItems = page.locator('.inventory_item');

    /**
     * Dropdown untuk sorting products
     * Options: Name (A-Z), Name (Z-A), Price (low-high), Price (high-low)
     */
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');

    /**
     * Semua product names (link yang bisa di-click)
     */
    this.productNames = page.locator('.inventory_item_name');

    /**
     * Semua product descriptions
     */
    this.productDescriptions = page.locator('.inventory_item_desc');

    /**
     * Semua product prices
     */
    this.productPrices = page.locator('.inventory_item_price');

    /**
     * Semua button "Add to cart"
     */
    this.addToCartButtons = page.locator('button[id^="add-to-cart"]');

    /**
     * Semua button "Remove" (muncul setelah add to cart)
     */
    this.removeButtons = page.locator('button[id^="remove"]');

    /**
     * Shopping cart badge (menampilkan jumlah item di cart)
     */
    this.cartBadge = page.locator('.shopping_cart_badge');

    /**
     * Shopping cart icon (untuk navigate ke cart page)
     */
    this.cartIcon = page.locator('.shopping_cart_link');

    /**
     * Product images
     */
    this.productImages = page.locator('.inventory_item_img');

    /**
     * Hamburger menu icon
     */
    this.menuButton = page.locator('#react-burger-menu-btn');

    /**
     * Logout link di sidebar menu
     */
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  // ==================== NAVIGATION METHODS ====================

  /**
   * Navigate ke halaman products/inventory
   * Biasanya tidak perlu dipanggil karena sudah auto redirect setelah login
   */
  async goto() {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  /**
   * Navigate ke cart page dengan click cart icon
   */
  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
  }

  // ==================== VERIFICATION METHODS ====================

  /**
   * Mengecek apakah halaman products sudah loaded dengan benar
   * Verify dengan check page title dan inventory container
   *
   * @returns {Promise<boolean>} True jika halaman loaded
   */
  async isPageLoaded() {
    try {
      await this.pageTitle.waitFor({ state: 'visible', timeout: 5000 });
      await this.inventoryContainer.waitFor({ state: 'visible', timeout: 5000 });

      const titleText = await this.pageTitle.textContent();
      return titleText === 'Products';
    } catch {
      return false;
    }
  }

  /**
   * Get jumlah products yang ditampilkan
   *
   * @returns {Promise<number>} Jumlah products
   */
  async getProductCount() {
    return await this.productItems.count();
  }

  /**
   * Get list semua product names yang ditampilkan
   *
   * @returns {Promise<string[]>} Array of product names
   *
   * @example
   * const names = await productsPage.getProductNames();
   * // ['Sauce Labs Backpack', 'Sauce Labs Bike Light', ...]
   */
  async getProductNames() {
    const count = await this.productNames.count();
    const names = [];

    for (let i = 0; i < count; i++) {
      const name = await this.productNames.nth(i).textContent();
      names.push(name);
    }

    return names;
  }

  /**
   * Get list semua product prices dalam format number
   *
   * @returns {Promise<number[]>} Array of prices
   *
   * @example
   * const prices = await productsPage.getProductPrices();
   * // [29.99, 9.99, 15.99, ...]
   */
  async getProductPrices() {
    const count = await this.productPrices.count();
    const prices = [];

    for (let i = 0; i < count; i++) {
      const priceText = await this.productPrices.nth(i).textContent();
      // Remove '$' dan convert ke number
      const price = parseFloat(priceText.replace('$', ''));
      prices.push(price);
    }

    return prices;
  }

  // ==================== SORTING METHODS ====================

  /**
   * Sort products by option
   *
   * @param {string} sortValue - Value dari option (az, za, lohi, hilo)
   *
   * @example
   * // Sort A to Z
   * await productsPage.sortProducts('az');
   *
   * // Sort Price low to high
   * await productsPage.sortProducts('lohi');
   */
  async sortProducts(sortValue) {
    await this.sortDropdown.selectOption(sortValue);

    // Wait sebentar untuk sorting selesai
    await this.page.waitForTimeout(500);
  }

  /**
   * Get current sort option yang dipilih
   *
   * @returns {Promise<string>} Current sort value
   */
  async getCurrentSortOption() {
    return await this.sortDropdown.inputValue();
  }

  // ==================== PRODUCT INTERACTION METHODS ====================

  /**
   * Click product name untuk view detail
   *
   * @param {string} productName - Nama product yang ingin di-click
   *
   * @example
   * await productsPage.clickProductName('Sauce Labs Backpack');
   */
  async clickProductName(productName) {
    await this.page.locator(`.inventory_item_name`, { hasText: productName }).click();
  }

  /**
   * Add product ke cart by product name
   *
   * @param {string} productName - Nama product yang ingin ditambahkan
   *
   * @example
   * await productsPage.addProductToCart('Sauce Labs Backpack');
   */
  async addProductToCart(productName) {
    // Strategy: Find product item by name, then click Add to Cart button within it
    // This is more reliable than generating button IDs

    // Find the product item container yang contains product name
    const productItem = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });

    // Find dan click "Add to cart" button di dalam product item tersebut
    const addButton = productItem.locator('button', { hasText: 'Add to cart' });
    await addButton.click();

    // Wait sebentar untuk animation
    await this.page.waitForTimeout(300);
  }

  /**
   * Remove product dari cart by product name
   *
   * @param {string} productName - Nama product yang ingin di-remove
   */
  async removeProductFromCart(productName) {
    // Strategy: Find product item by name, then click Remove button within it
    // This is more reliable than generating button IDs

    // Find the product item container yang contains product name
    const productItem = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });

    // Find dan click "Remove" button di dalam product item tersebut
    const removeButton = productItem.locator('button', { hasText: 'Remove' });
    await removeButton.click();

    await this.page.waitForTimeout(300);
  }

  /**
   * Add multiple products ke cart
   *
   * @param {string[]} productNames - Array of product names
   *
   * @example
   * await productsPage.addMultipleProducts([
   *   'Sauce Labs Backpack',
   *   'Sauce Labs Bike Light'
   * ]);
   */
  async addMultipleProducts(productNames) {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  /**
   * Check apakah product sudah ada di cart (button berubah jadi "Remove")
   *
   * @param {string} productName - Nama product
   * @returns {Promise<boolean>} True jika sudah di cart
   */
  async isProductInCart(productName) {
    // Strategy: Find product item by name, then check if Remove button exists
    // This is more reliable than generating button IDs

    // Find the product item container yang contains product name
    const productItem = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });

    // Check if "Remove" button exists dan visible
    const removeButton = productItem.locator('button', { hasText: 'Remove' });

    try {
      await removeButton.waitFor({ state: 'visible', timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  // ==================== CART BADGE METHODS ====================

  /**
   * Get jumlah item di cart dari badge
   *
   * @returns {Promise<number>} Jumlah items (0 jika badge tidak visible)
   *
   * @example
   * const count = await productsPage.getCartItemCount();
   * expect(count).toBe(2);
   */
  async getCartItemCount() {
    try {
      await this.cartBadge.waitFor({ state: 'visible', timeout: 2000 });
      const badgeText = await this.cartBadge.textContent();
      return parseInt(badgeText);
    } catch {
      // Jika badge tidak visible, berarti cart kosong
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

  // ==================== LOGOUT METHOD ====================

  /**
   * Logout dari aplikasi
   */
  async logout() {
    // Click hamburger menu
    await this.menuButton.click();

    // Wait sidebar menu muncul
    await this.page.waitForTimeout(500);

    // Click logout
    await this.logoutLink.click();

    // Wait redirect ke login page
    await this.page.waitForURL('**/');
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get product price by name
   *
   * @param {string} productName - Nama product
   * @returns {Promise<number>} Price dalam number
   */
  async getProductPrice(productName) {
    // Find product item yang mengandung product name
    const productItem = this.page.locator('.inventory_item', {
      has: this.page.locator('.inventory_item_name', { hasText: productName })
    });

    // Get price dari product item tersebut
    const priceText = await productItem.locator('.inventory_item_price').textContent();

    // Remove '$' dan convert ke number
    return parseFloat(priceText.replace('$', ''));
  }
}
