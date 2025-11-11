import { Page, Locator } from '@playwright/test';


// import { Page, Locator } from '@playwright/test';

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
  
  constructor(page: Page) {
    this.page = page;

    // Buttons
    this.patientsButton = page.getByRole('button', { name: 'patient Patients' });
    this.patientListButton = page.getByRole('button', { name: 'Patient List' });
    this.addPatientButton = page.locator('.MuiButtonBase-root.MuiIconButton-root.jss225');
    this.createPatientButton = page.locator("button:has(span:has-text('Create Patient'))");
    this.acceptButton = this.page.getByRole('button', { name: 'Accept' });
    this.presentationBTN =page.getByRole('button', { name: 'Preparing'});

    // Inputs
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.genderDropdown = page.getByRole('button', { name: 'Open' }).nth(3);
    this.maritalStatusInput = page.getByRole('textbox', { name: 'Marital Status' });
    this.datePickerButton = page.getByRole('button', { name: 'Choose date' });
    this.calendarSwitchButton = page.getByRole('button', { name: 'calendar view is open, switch' });
    this.addressLine1Input = page.getByRole('textbox', { name: 'Address - Line 1' });
  }

  // Dynamic year button
  getYearButton(year: number) {
    return this.page.locator(`button:has-text("${year}")`);
  }

  // Dynamic day cell
// Only pick days that are visible (not from previous/next month)
getDayCell(day: number) {
  return this.page.locator(`.MuiPickersDay-root:has-text("${day}"):not(.MuiPickersDay-dayOutsideMonth)`);
}


  // Open Patient List
  async openPatientList() {
    await this.patientsButton.click();
    await this.patientListButton.click();
  }

  // Select random gender
  async selectRandomGender() {
    const genders = ['Male', 'Female', 'Unknown'];
    const randomGender = genders[Math.floor(Math.random() * genders.length)];
    await this.genderDropdown.click();
    await this.page.getByRole('option', { name: randomGender, exact: true }).click();
  }

  // Select random marital status
  async selectRandomMaritalStatus() {
    const statuses = ['Married', 'Single', 'Divorced', 'Widow/Widower', 'Separated', 'Unknown'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    await this.maritalStatusInput.click();
    await this.page.getByRole('option', { name: randomStatus, exact: true }).click();
  }

  // Randomly select DOB (0-100 years old)
  async selectRandomDOB() {
  const today = new Date();
  const maxYears = 100;
  const age = Math.floor(Math.random() * (maxYears + 1));
  const monthIndex = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  const birthYear = today.getFullYear() - age;
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthName = monthNames[monthIndex];

  // Open date picker
  await this.datePickerButton.click();
  await this.page.waitForTimeout(200);

  // Switch to year view
  await this.calendarSwitchButton.click();
  await this.page.waitForTimeout(200);

  // Select year
  const yearLocator = this.getYearButton(birthYear);
  await yearLocator.waitFor({ state: 'visible', timeout: 5000 });
  await yearLocator.click();
  await this.page.waitForTimeout(200);

  // Navigate months until desired month is displayed
  let currentMonth = await this.page.locator('.MuiPickersCalendarHeader-label').textContent();
  let attempts = 0;
  while (!currentMonth?.includes(monthName) && attempts < 12) {
    await this.page.locator('button[aria-label="Next month"]').click();
    await this.page.waitForTimeout(100);
    currentMonth = await this.page.locator('.MuiPickersCalendarHeader-label').textContent();
    attempts++;
  }

  // Select day
  const dayLocator = this.getDayCell(day);
  await dayLocator.first().waitFor({ state: 'visible', timeout: 5000 }); // pick the first visible element
  await dayLocator.first().click();

  console.log(`Selected DOB: ${birthYear}-${monthIndex + 1}-${day}`);
}


  // Select first USA address from suggestions
  async selectAddress(inputAddress: string) {
    await this.addressLine1Input.fill(inputAddress);
    await this.page.waitForSelector('.MuiAutocomplete-option', { timeout: 5000 });

    const suggestions = await this.page.locator('.MuiAutocomplete-option').allTextContents();
    const firstUSAOption = suggestions.find(option => option.includes('USA'));
    if (!firstUSAOption) throw new Error('No USA address found in suggestions');

    await this.page.getByRole('option', { name: firstUSAOption, exact: true }).click();
  }
async clickCreatePatientButton() {
  await this.createPatientButton.waitFor({ state: 'visible' });
  await this.createPatientButton.scrollIntoViewIfNeeded();
  await this.createPatientButton.click();

}
async clickAcceptButton() {
  await this.acceptButton.waitFor({ state: 'visible', timeout: 5000 });
  await this.acceptButton.scrollIntoViewIfNeeded();
  await this.acceptButton.click();
}




  // Create a new patient
  async createNewPatient(firstName: string, lastName: string) {
    await this.addPatientButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.selectRandomGender();
    await this.selectRandomMaritalStatus();
    await this.selectRandomDOB();
    await this.selectAddress('123');
    await this.clickCreatePatientButton();
    await this.clickAcceptButton();
  }
}



