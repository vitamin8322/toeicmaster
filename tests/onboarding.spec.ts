import { test, expect } from "@playwright/test";

test.describe("Onboarding target TOEIC score E2E flow tests", () => {
  test("should enforce onboarding redirect, allow choosing score, persist to dashboard, and block re-entry", async ({ page }) => {
    // 1. Unauthenticated user attempts to load the dashboard and is redirected to login
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);

    // 2. Log in with the non-onboarded learner profile
    await page.locator("input[type='email']").fill("newbie@toeicmaster.vn");
    await page.locator("input[type='password']").fill("password123");
    await page.click("button[type='submit']");

    // 3. User should be redirected to the onboarding portal since onboardingCompleted is false
    await page.waitForURL(/\/onboarding/);
    await expect(page).toHaveURL(/\/onboarding/);

    // Verify onboarding screen components render correctly
    const onboardingHeader = page.locator("h2:has-text('Đặt Mục Tiêu Điểm Số')");
    await expect(onboardingHeader).toBeVisible();

    // 4. Select the "Target 750+" card
    const targetCard = page.locator("div:has-text('Target 750+')").last();
    await targetCard.click();

    // 5. Submit the onboarding configuration
    await page.click("button:has-text('Xác Nhận & Bắt Đầu Học')");

    // 6. User should land on the dashboard successfully
    await page.waitForURL(/\/dashboard/);
    await expect(page).toHaveURL(/\/dashboard/);

    // 7. Verify the dynamic target score tag in the App Shell displays "Target 750+"
    const targetScoreTag = page.locator("span:has-text('Target 750+')");
    await expect(targetScoreTag).toBeVisible();

    // 8. Attempting to re-access /onboarding should intercept and redirect back to the dashboard
    await page.goto("/onboarding");
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
