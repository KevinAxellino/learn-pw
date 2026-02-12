// @ts-check

/**
 * Test Data Constants untuk SauceDemo Testing
 *
 * File ini berisi semua data yang digunakan untuk testing,
 * seperti username, password, nama produk, dll.
 *
 * Menggunakan constants memudahkan maintenance dan menghindari typo.
 */

// ==================== USER CREDENTIALS ====================

/**
 * User yang valid dan bisa login dengan sukses
 * Username: standard_user
 * Password: secret_sauce
 */
export const VALID_USER = {
  username: 'standard_user',
  password: 'secret_sauce'
};

/**
 * User yang sama dengan VALID_USER (untuk konsistensi penamaan)
 */
export const STANDARD_USER = VALID_USER;

/**
 * User yang ter-locked dan tidak bisa login
 * Akan menampilkan error message ketika mencoba login
 */
export const LOCKED_USER = {
  username: 'locked_out_user',
  password: 'secret_sauce'
};

/**
 * User yang tidak terdaftar di sistem (untuk testing invalid login)
 */
export const INVALID_USER = {
  username: 'invalid_user',
  password: 'wrong_password'
};

/**
 * Password yang valid untuk semua user
 */
export const VALID_PASSWORD = 'secret_sauce';

/**
 * Password yang salah (untuk testing invalid login)
 */
export const INVALID_PASSWORD = 'wrong_password';

// ==================== PRODUCT DATA ====================

/**
 * Daftar nama produk yang tersedia di SauceDemo
 * Digunakan untuk testing add to cart, search, dll
 */
export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TSHIRT_RED: 'Test.allTheThings() T-Shirt (Red)'
};

/**
 * Harga produk dalam format number (untuk testing sort by price)
 */
export const PRODUCT_PRICES = {
  [PRODUCTS.ONESIE]: 7.99,
  [PRODUCTS.BIKE_LIGHT]: 9.99,
  [PRODUCTS.BOLT_TSHIRT]: 15.99,
  [PRODUCTS.TSHIRT_RED]: 15.99,
  [PRODUCTS.BACKPACK]: 29.99,
  [PRODUCTS.FLEECE_JACKET]: 49.99
};

// ==================== SORT OPTIONS ====================

/**
 * Options untuk sorting products
 * Nilai ini sesuai dengan value di dropdown sort SauceDemo
 */
export const SORT_OPTIONS = {
  NAME_ASC: 'az',        // A to Z
  NAME_DESC: 'za',       // Z to A
  PRICE_ASC: 'lohi',     // Price (low to high)
  PRICE_DESC: 'hilo'     // Price (high to low)
};

/**
 * Label yang ditampilkan di dropdown sort (untuk verifikasi)
 */
export const SORT_LABELS = {
  NAME_ASC: 'Name (A to Z)',
  NAME_DESC: 'Name (Z to A)',
  PRICE_ASC: 'Price (low to high)',
  PRICE_DESC: 'Price (high to low)'
};

// ==================== ERROR MESSAGES ====================

/**
 * Error messages yang muncul di SauceDemo
 * Digunakan untuk assertion di test
 */
export const ERROR_MESSAGES = {
  LOCKED_USER: 'Epic sadface: Sorry, this user has been locked out.',
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  MISSING_USERNAME: 'Epic sadface: Username is required',
  MISSING_PASSWORD: 'Epic sadface: Password is required'
};

// ==================== URLS ====================

/**
 * URLs yang digunakan di SauceDemo
 * Menggunakan constants untuk mudah di-update jika URL berubah
 */
export const URLS = {
  BASE: 'https://www.saucedemo.com',
  LOGIN: 'https://www.saucedemo.com/',
  INVENTORY: 'https://www.saucedemo.com/inventory.html',
  CART: 'https://www.saucedemo.com/cart.html'
};
