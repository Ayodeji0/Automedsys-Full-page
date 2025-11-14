import { test, expect } from '@playwright/test';
import { LoginPage } from '../PageObjects/LoginPage';
import { PatientPage } from '../PageObjects/PatientPage';
import { ACTIVE_CONFIG } from '../config/env.config';

let patientPage: PatientPage;
test.describe('Patient Management Tests',() =>{
test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(ACTIVE_CONFIG.baseURL);
  await loginPage.login();

  patientPage = new PatientPage(page);
  await patientPage.openPatientList();
});

// ---------------------- Positive Test ----------------------
test('User can create a new patient successfully', async () => {
  await patientPage.createNewPatient('Jackie','Harry');
  await patientPage.waitForSuccessToast();

  // Assertions
  await expect(patientPage.successToast).toBeVisible();
  await expect(patientPage.successToast).toHaveText('Created Patient');
});

// ---------------------- Negative Test 1: Mandatory fields ----------------------
test('Should not create patient when first name and last name are empty', async () => {
  await patientPage.createPatientWithoutNames();

  expect(await patientPage.isFirstNameInvalid()).toBe('true');
  expect(await patientPage.isLastNameInvalid()).toBe('true');

  await expect(patientPage.successToast).not.toBeVisible();
});


// ---------------------- Negative Test 2: Invalid address ----------------------

test('Should not create patient with invalid address', async () => {
  await patientPage.clickAddPatient();
  await patientPage.fillPatientNames('Emmanual', 'joshua');
  await patientPage.selectRandomGender();
  await patientPage.selectRandomMaritalStatus();
  await patientPage.selectRandomDOB();

  const result = await patientPage.selectAddress('NonExistentAddress123');

  expect(result).toBe(true);

  await expect(patientPage.successToast).not.toBeVisible();
});


// ---------------------- Negative Test 3: Future DOB ----------------------
test('Should not create patient with future date of birth', async () => {
  await patientPage.clickAddPatient();
  await patientPage.fillPatientNames('Future', 'User'); 
  await patientPage.selectRandomGender();
  await patientPage.selectRandomMaritalStatus();

  const today = new Date();
  const futureYear = today.getFullYear() + 1;

  // Pick future DOB
  await (patientPage as any).datePickerButton.click();
  await (patientPage as any).calendarSwitchButton.click();
  await (patientPage as any).getYearButton(futureYear).click();
  await (patientPage as any).getDayCell(today.getDate()).click();
  await patientPage.selectAddress('123 Main Street, USA');
  await patientPage.clickCreatePatientButton();
  await expect(patientPage.successToast).not.toBeVisible();
})
});
