import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { PatientPage } from '../PageObjects/PatientPage';
import { ACTIVE_CONFIG } from '../config/env.config';

test('User can create a new patient successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const patientPage = new PatientPage(page);

  // Go to login and log in
  await page.goto(ACTIVE_CONFIG.baseURL);
  await loginPage.login();

  // Navigate and create a new patient
  await patientPage.openPatientList();
  await patientPage.createNewPatient('Ayodeji', 'John');
//   await patientPage.selectRandomGender();

  // Example assertion
//   await expect(page.locator('text=Patient created successfully')).toBeVisible();
});
