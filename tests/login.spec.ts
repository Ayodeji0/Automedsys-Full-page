import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';

test('User can log in successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('/login'); 
  await loginPage.login();

  // Assertion
  await expect(page).toHaveURL(/dashboard/);
});

