const { test, expect } = require('@playwright/test');

test('Login to Saucedemo and verify title', async ({ page }) => {
  // Buka halaman saucedemo
  await page.goto('https://www.saucedemo.com/');

  // Input username
  await page.fill('#user-name', 'standard_user');

  // Input password
  await page.fill('#password', 'secret_sauce');

  // Klik tombol login
  await page.click('#login-button');

  // Verify judul/title setelah login
  await expect(page.locator('.title')).toBeVisible();
  await expect(page.locator('.title')).toHaveText('Products');

  // Ambil screenshot
  await page.screenshot({ path: 'saucedemo-login-success.png', fullPage: true });

  console.log('Login berhasil dan screenshot telah diambil!');
});
