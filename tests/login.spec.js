const { test, expect } = require('@playwright/test');

test.describe('OrangeHRM Login Tests', () => {
  const baseURL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';

  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto(baseURL);
  });

  test('Should load login page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/OrangeHRM/);

    // Verify login form elements
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Login');
  });

  test('Should login successfully with valid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for dashboard page
    await page.waitForURL(/.*dashboard.*/);

    // Check dashboard header
    await expect(page.locator('.oxd-topbar-header-breadcrumb')).toBeVisible();
    await expect(page.locator('h6')).toHaveText(/Dashboard/);

    // Check if user dropdown visible
    await expect(page.locator('.oxd-userdropdown-name')).toBeVisible();
  });

  test('Should show error message with invalid credentials', async ({ page }) => {
    await page.fill('input[name="username"]', 'invaliduser');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    const errorMsg = page.locator('.oxd-alert-content');
    await expect(errorMsg).toBeVisible();
    await expect(errorMsg).toContainText('Invalid credentials');
  });

  test('Should show required field validation', async ({ page }) => {
    await page.click('button[type="submit"]');

    const errorMessages = page.locator('.oxd-input-field-error-message');
    await expect(errorMessages).toHaveCount(2);
    await expect(errorMessages.nth(0)).toContainText(/Required/i);
    await expect(errorMessages.nth(1)).toContainText(/Required/i);
  });

  test('Should navigate to forgot password page', async ({ page }) => {
   await page.getByText('Forgot your password?').click();

    await expect(page.locator('h6')).toHaveText('Reset Password');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Reset Password');
  });

  test('Should logout successfully after login', async ({ page }) => {
    await page.fill('input[name="username"]', 'Admin');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL(/.*dashboard.*/);

    // Open user dropdown safely
    await page.locator('.oxd-userdropdown').click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();

    // Verify redirect to login
    await page.waitForURL('**/auth/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
  });

  test('Should display proper page elements and styling', async ({ page }) => {
    await expect(page.locator('.orangehrm-login-logo img')).toBeVisible();
    await expect(page.locator('.orangehrm-login-form')).toBeVisible();
  });
});
