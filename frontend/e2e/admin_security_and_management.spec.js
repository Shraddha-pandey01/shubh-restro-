import { test, expect } from '@playwright/test';

test.describe('Admin Back Office Security & Route Guard', () => {
  test('Unauthenticated user is blocked and redirected from every admin route', async ({ page }) => {
    const protectedAdminRoutes = [
      '/admin',
      '/admin/orders',
      '/admin/reservations',
      '/admin/menu',
      '/admin/gallery',
      '/admin/reviews',
      '/admin/customers',
    ];

    for (const route of protectedAdminRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/\/admin\/login/, { timeout: 10000 });
      await expect(page.locator('h1')).toContainText(/ShubhRestro Back Office/i);
    }
  });

  test('Admin can authenticate and access dashboard overview', async ({ page }) => {
    await page.goto('/admin/login');

    await page.locator('#admin-email-input').fill('admin@gmail.com');
    await page.locator('#admin-password-input').fill('Admin123');
    await page.locator('#admin-login-submit-btn').click();

    // Assert redirection to /admin dashboard
    await expect(page).toHaveURL(/\/admin$/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Management Overview/i);
    await expect(page.locator('text=Active Kitchen Tickets')).toBeVisible();
    await expect(page.locator('text=Today\'s Revenue')).toBeVisible();
  });
});
