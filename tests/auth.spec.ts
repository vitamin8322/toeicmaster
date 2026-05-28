import { test, expect } from "@playwright/test";

test.describe("Authentication session middleware E2E routing tests", () => {
  test("should block unauthenticated access to the dashboard and redirect to the login page", async ({ page }) => {
    // Attempt to directly access the protected student dashboard path
    await page.goto("/dashboard");

    // Assert that the request is successfully intercepted and redirected to the login gate
    await expect(page).toHaveURL(/\/login/);
    
    // Verify that the login form card renders correctly
    const loginHeader = page.locator("h2:has-text('Chào Mừng Trở Lại!')");
    await expect(loginHeader).toBeVisible();
  });
});
