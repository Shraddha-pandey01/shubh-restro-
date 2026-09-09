import { test, expect } from '@playwright/test';

test.describe('Table Booking & Lookup Flow', () => {
  test('Guest is prompted to sign in when booking a table, receives reference ID, and looks up booking', async ({ page }) => {
    // 1. Visit Book a Table page as unauthenticated guest -> redirects to login
    await page.goto('/book-a-table');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });

    // 2. Sign in as patron
    await page.locator('#auth-email-input').fill('customer@gmail.com');
    await page.locator('#auth-password-input').fill('Customer123!');
    await page.locator('#auth-submit-btn').click();

    // Assert redirected back to /book-a-table
    await expect(page).toHaveURL(/\/book-a-table/, { timeout: 15000 });
    await expect(page.locator('h1')).toContainText(/Book Your Dining Experience/i);

    // 3. Fill reservation form
    await page.locator('#booking-name-input').fill('Pooja Singh');
    await page.locator('#booking-phone-input').fill('+91 9988776655');
    await page.locator('#booking-timeslot-select').selectOption('20:00');
    await page.locator('#booking-guests-select').selectOption('4');

    // 3. Submit reservation
    await page.locator('#booking-submit-btn').click();

    // 4. Assert Confirmation Modal with reference code
    const refCodeElement = page.locator('#booking-confirmed-ref');
    await expect(refCodeElement).toBeVisible({ timeout: 15000 });

    const refText = (await refCodeElement.innerText()).trim();
    expect(refText).toMatch(/^SHUBH-BKG-/);

    // 5. Switch to Lookup tab
    await page.locator('button:has-text("Find Existing Reservation")').click();
    await page.locator('#lookup-ref-input').fill(refText);
    await page.locator('#lookup-submit-btn').click();

    // 6. Verify booking located
    const resultRef = page.locator('#lookup-result-ref');
    await expect(resultRef).toBeVisible({ timeout: 10000 });
    await expect(resultRef).toContainText(refText);
    await expect(page.locator('#lookup-result-card')).toContainText('Pooja Singh');
  });
});
