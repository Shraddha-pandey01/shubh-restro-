import { test, expect } from '@playwright/test';

test.describe('Real-Time Cross-Browser Socket.io Flow', () => {
  test('New order placed by customer browser context appears live in admin browser context without page refresh', async ({ browser }) => {
    // 1. Create separate Admin browser context
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    // Log in as Admin in admin context
    await adminPage.goto('/admin/login');
    await adminPage.locator('#admin-email-input').fill('admin@gmail.com');
    await adminPage.locator('#admin-password-input').fill('Admin123');
    await adminPage.locator('#admin-login-submit-btn').click();

    // Verify Admin is on the dashboard
    await expect(adminPage).toHaveURL(/\/admin$/, { timeout: 15000 });
    await expect(adminPage.locator('h1')).toContainText(/Management Overview/i);

    // 2. Create separate Customer browser context
    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();

    // Customer signs in as patron
    await customerPage.goto('/login');
    await customerPage.locator('#auth-email-input').fill('customer@gmail.com');
    await customerPage.locator('#auth-password-input').fill('Customer123!');
    await customerPage.locator('#auth-submit-btn').click();
    await expect(customerPage).toHaveURL(/\/account/, { timeout: 15000 });

    // Customer browses menu & places an order
    await customerPage.goto('/menu');
    await expect(customerPage.locator('h1')).toContainText(/The Degustation Menu/i);

    const addToCartButton = customerPage.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Go to checkout
    await customerPage.goto('/checkout');
    await customerPage.locator('#checkout-name-input').fill('Priya Verma');
    await customerPage.locator('#checkout-phone-input').fill('+91 9988776655');
    await customerPage.locator('#place-order-submit-btn').click();

    // Customer is redirected to order tracking
    await expect(customerPage).toHaveURL(/\/orders\/[a-zA-Z0-9_-]+/, { timeout: 15000 });

    // 3. ASSERTION IN ADMIN CONTEXT (WITHOUT ANY PAGE REFRESH):
    // The live incoming order alert badge must appear via Socket.io
    const liveAlert = adminPage.locator('#admin-live-alert');
    await expect(liveAlert).toBeVisible({ timeout: 15000 });
    await expect(liveAlert).toContainText(/Incoming Order/i);

    // Clean up
    await customerContext.close();
    await adminContext.close();
  });
});
