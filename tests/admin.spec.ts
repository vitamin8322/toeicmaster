import { test, expect } from "@playwright/test";

test.describe("Administrative Portal Security Access E2E Routing Tests", () => {
  
  test("should block anonymous unauthenticated user trying to access admin routes and redirect to login", async ({ page }) => {
    // Attempt to access admin dashboard directly
    await page.goto("/admin/dashboard");
    
    // Expect redirect to login page
    await expect(page).toHaveURL(/\/login/);
    
    const loginHeader = page.locator("h2:has-text('Chào Mừng Trở Lại!')");
    await expect(loginHeader).toBeVisible();
  });

  test("should block authenticated standard Learner from accessing admin routes and return a 403 Forbidden", async ({ page }) => {
    // 1. Visit login
    await page.goto("/login");
    
    // 2. Log in using a Learner profile
    await page.locator("input[type='email']").fill("learner@toeicmaster.vn");
    await page.locator("input[type='password']").fill("password123");
    await page.click("button[type='submit']");
    
    // User lands on dashboard
    await page.waitForURL(/\/dashboard/);
    
    // 3. Attempt to bypass and browse directly to administrative route
    await page.goto("/admin/dashboard");
    
    // Middleware returns 403 JSON payload as per src/middleware.ts definition
    const pageText = await page.locator("body").innerText();
    expect(pageText).toContain("403 Forbidden");
    expect(pageText).toContain("Bạn không có quyền truy cập quản trị");
  });

  test("should grant full access to authenticated users with ADMIN role", async ({ page }) => {
    // 1. Visit login
    await page.goto("/login");
    
    // 2. Log in using the system Administrator account
    await page.locator("input[type='email']").fill("admin@toeicmaster.vn");
    await page.locator("input[type='password']").fill("password123");
    await page.click("button[type='submit']");
    
    // Wait for the login redirect to complete (lands on /dashboard)
    await page.waitForURL(/\/dashboard/);
    
    // 3. Navigate to protected administrative dashboard
    await page.goto("/admin/dashboard");
    await page.waitForURL(/\/admin\/dashboard/);
    
    // 3. Verify Admin dashboard visuals are successfully mounted
    const dashboardHeader = page.locator("h1:has-text('Bảng Quản Trị Hệ Thống')");
    await expect(dashboardHeader).toBeVisible();
    
    const statsCardTotal = page.locator("p:has-text('Tổng Số Câu Hỏi')");
    await expect(statsCardTotal).toBeVisible();
  });
});
