import { test, expect } from '@playwright/test';

test.describe('Ordering Flow & Authentication Guard', () => {
  test('Unauthenticated guest is prompted to sign in when adding items or checking out, then completes order', async ({ page }) => {
    // 1. Visit Menu page as unauthenticated guest
    await page.goto('/menu');
    await expect(page.locator('h1')).toContainText(/The Degustation Menu/i);

    // 2. Click "Add to Cart" while unauthenticated -> should redirect to /login
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Assert redirected to Login page with notification message
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(page.locator('text=Please sign in or create an account to curate your luxury dining order')).toBeVisible();

    // 3. Sign in as registered patron
    await page.locator('#auth-email-input').fill('customer@gmail.com');
    await page.locator('#auth-password-input').fill('Customer123!');
    await page.locator('#auth-submit-btn').click();

    // Assert redirected back to /menu
    await expect(page).toHaveURL(/\/menu/, { timeout: 15000 });

    // 4. Now as authenticated patron, add item to cart
    await addToCartButton.click();

    // Verify cart count badge updates
    const navCartBtn = page.locator('#nav-cart-btn');
    await expect(navCartBtn).toContainText('1');

    // 5. Navigate to Cart
    await navCartBtn.click();
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator('h1')).toContainText(/Shopping Cart/i);
    await expect(page.locator('#checkout-proceed-btn')).toBeVisible();

    // 6. Proceed to Checkout
    await page.locator('#checkout-proceed-btn').click();
    await expect(page).toHaveURL(/\/checkout/);

    // 5. Fill out Guest Contact details
    await page.locator('#checkout-name-input').fill('Amit Singh');
    await page.locator('#checkout-phone-input').fill('+91 9123456789');
    await page.locator('#checkout-email-input').fill('amit.singh@gmail.com');

    // 6. Submit Order
    const placeOrderBtn = page.locator('#place-order-submit-btn');
    await expect(placeOrderBtn).toBeVisible();
    await placeOrderBtn.click();

    // 7. Assert redirection to Order Tracking page
    await expect(page).toHaveURL(/\/orders\/[a-zA-Z0-9_-]+/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Order Tracking/i);
    await expect(page.locator('text=Order Received')).toBeVisible();
    await expect(page.locator('text=Amit Singh')).toBeVisible();
  });
});
