const { test, expect } = require('@playwright/test');

test.use({ storageState: 'state.json' });

test.describe('OrangeHRM Dashboard page', () => {

    test('akses dashboard setelah login', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
    await expect(page.getByRole('heading')).toMatchAriaSnapshot(`- heading "Dashboard" [level=6]`);
    });

    test('Navigate to Admin > User Management > Users', async ({ page }) => {
    // Klik menu Admin di sidebar
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/admin\/viewSystemUsers/);
    await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();
  });

  test('Search user with username "Admin"', async ({ page }) => {
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/admin\/viewSystemUsers/);

    await page.getByLabel('Username').fill('Admin');
    await page.getByRole('button', { name: 'Search' }).click();

    const resultRow = page.locator('div.oxd-table-cell', { hasText: 'Admin' });
    await expect(resultRow).toBeVisible();
  });

  test('Reset search form in Admin > Users', async ({ page }) => {
    await page.getByRole('link', { name: 'Admin' }).click();
    await page.getByLabel('Username').fill('RandomUser');
    await page.getByRole('button', { name: 'Reset' }).click();

    // Pastikan field kosong setelah reset
    await expect(page.getByLabel('Username')).toHaveValue('');
  });
});