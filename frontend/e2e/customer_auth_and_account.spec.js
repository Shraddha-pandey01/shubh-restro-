import { test, expect } from '@playwright/test';

test.describe('Customer Auth and Account Dashboard', () => {
  test('Customer can register, sign in, and view personal account history', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `patron.${timestamp}@gmail.com`;

    // 1. Visit Login/Register page
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText(/Welcome Back/i);

    // 2. Switch to Register mode
    await page.locator('button:has-text("Don\'t have an account? Register here")').click();
    await expect(page.locator('h1')).toContainText(/Create an Account/i);

    // 3. Fill registration details
    await page.locator('#reg-name-input').fill('Arjun Pandey');
    await page.locator('#auth-email-input').fill(testEmail);
    await page.locator('#auth-password-input').fill('LuxuryPass2024!');
    await page.locator('#reg-phone-input').fill('+91 9123456789');

    // 4. Submit registration
    await page.locator('#auth-submit-btn').click();

    // 5. Assert redirection to Account Dashboard
    await expect(page).toHaveURL(/\/account/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText('Arjun Pandey');
    await expect(page.getByRole('heading', { name: 'Order Timeline' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Reservations' })).toBeVisible();
  });
});
