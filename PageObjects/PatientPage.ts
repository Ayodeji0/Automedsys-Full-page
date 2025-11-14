
import { Page, Locator } from '@playwright/test';

export class PatientPage {
  private page: Page;

  // Locators
  private patientsButton: Locator;
  private patientListButton: Locator;
  private addPatientButton: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private genderDropdown: Locator;
  private maritalStatusInput: Locator;
  private datePickerButton: Locator;
  private calendarSwitchButton: Locator;
  private addressLine1Input: Locator;
  private createPatientButton: Locator;
  private acceptButton: Locator;
  private presentationBTN: Locator;
  private dialog: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    // Buttons
    this.patientsButton = page.getByRole('button', { name: 'patient Patients' });
    this.patientListButton = page.getByRole('button', { name: 'Patient List' });
    this.addPatientButton = page.locator('.MuiButtonBase-root.MuiIconButton-root.jss225');
    this.createPatientButton = page.getByRole('button', { name: 'Create Patient' })
    this.dialog = page.locator('.MuiDialog-paper');
    this.acceptButton = this.dialog.getByRole('button', { name: 'Accept' });
    this.presentationBTN = page.getByText('Created Patient');

    // Inputs
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.genderDropdown = page.getByRole('button', { name: 'Open' }).nth(3);
    this.maritalStatusInput = page.getByRole('textbox', { name: 'Marital Status' });
    this.datePickerButton = page.getByRole('button', { name: 'Choose date' });
    this.calendarSwitchButton = page.getByRole('button', { name: 'calendar view is open, switch' });
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address - Line 1' });

    // Assertion Text
    this.successToast = this.page.locator('div').filter({ hasText: 'Created Patient' }).nth(4);

  }

  // ------------------ Helper methods for negative tests ------------------
  async clickAddPatient() {
    await this.addPatientButton.click();
  }

  async createPatientWithoutNames() {
    await this.addPatientButton.click();
    await this.clickCreatePatientButton();
  }

  async isFirstNameInvalid(): Promise<string | null> {
    return await this.firstNameInput.getAttribute('aria-invalid');
  }

  async isLastNameInvalid(): Promise<string | null> {
    return await this.lastNameInput.getAttribute('aria-invalid');
  }

  // New helper to fill patient names safely
  async fillPatientNames(firstName: string, lastName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  // ------------------ Existing Methods ------------------
  async waitForSuccessToast() {
    await this.successToast.waitFor({ state: 'visible', timeout: 5000 });
    return this.successToast;
  }

  getYearButton(year: number) {
    return this.page.locator(`button:has-text("${year}")`);
  }

  getDayCell(day: number) {
    return this.page.locator(`.MuiPickersDay-root:has-text("${day}"):not(.MuiPickersDay-dayOutsideMonth)`);
  }

  async openPatientList() {
    await this.patientsButton.click();
    await this.patientListButton.click();
  }

  async selectRandomGender() {
    const genders = ['Male', 'Female', 'Unknown'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    await this.genderDropdown.click();
    await this.page.getByRole('option', { name: randomGender, exact: true }).click();
  }

  async selectRandomMaritalStatus() {
    const statuses = ['Married', 'Single', 'Divorced', 'Widow/Widower', 'Separated', 'Unknown'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    await this.maritalStatusInput.click();
    await this.page.getByRole('option', { name: randomStatus, exact: true }).click();
  }

  async selectRandomDOB() {
    const today = new Date();
    const maxYears = 100;
    const age = Math.floor(Math.random() * (maxYears + 1));
    const monthIndex = Math.floor(Math.random() * 12);
    const day = Math.floor(Math.random() * 28) + 1;
    const birthYear = today.getFullYear() - age;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthName = monthNames[monthIndex];

    await this.datePickerButton.click();
    await this.page.waitForTimeout(200);
    await this.calendarSwitchButton.click();
    await this.page.waitForTimeout(200);

    const yearLocator = this.getYearButton(birthYear);
    await yearLocator.waitFor({ state: 'visible', timeout: 5000 });
    await yearLocator.click();
    await this.page.waitForTimeout(200);

    let currentMonth = await this.page.locator('.MuiPickersCalendarHeader-label').textContent();
    let attempts = 0;
    while (!currentMonth?.includes(monthName) && attempts < 12) {
      await this.page.locator('button[aria-label="Next month"]').click();
      await this.page.waitForTimeout(100);
      currentMonth = await this.page.locator('.MuiPickersCalendarHeader-label').textContent();
      attempts++;
    }

    const dayLocator = this.getDayCell(day);
    await dayLocator.first().waitFor({ state: 'visible', timeout: 5000 }); 
    await dayLocator.first().click();

    console.log(`Selected DOB: ${birthYear}-${monthIndex + 1}-${day}`);
  }


async selectAddress(inputAddress: string) {
  await this.addressLine1Input.fill(inputAddress);

  const suggestions = this.page.locator('.MuiAutocomplete-option');

  // Wait up to 3s for suggestions, but DO NOT throw if none appear
  await this.page.waitForTimeout(3000);

  const count = await suggestions.count();

  // If no suggestions, return false instead of throwing
  if (count === 0) {
    return false;
  }

  const allTexts = await suggestions.allTextContents();
  const firstUSAOption = allTexts.find(s => s.includes('USA'));

  if (!firstUSAOption) {
    return false;
  }

  await this.page.getByRole('option', { name: firstUSAOption, exact: true }).click();
  await this.page.waitForTimeout(2000);
  return true;
  
}


  async clickCreatePatientButton() {
    await this.createPatientButton.waitFor({ state: 'visible', timeout: 3000});
    await this.createPatientButton.scrollIntoViewIfNeeded();
    await this.createPatientButton.click();
    // await this.page.waitForTimeout(3000);
  }

  async clickAcceptButton() {
    await this.dialog.waitFor({ state: 'visible'});
    await this.acceptButton.waitFor({ state: 'visible'});
    await this.acceptButton.click();
  }

  async clickPresentationBTN() {
    await this.presentationBTN.click();
  }

  async createNewPatient(firstName: string, lastName: string) {
    await this.addPatientButton.click();
    await this.fillPatientNames(firstName, lastName); // use helper
    await this.selectRandomGender();
    await this.selectRandomMaritalStatus();
    await this.selectRandomDOB();
    await this.selectAddress('123');
    await this.clickCreatePatientButton();
    await this.clickAcceptButton();
  }
}




