import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { PatientPage } from './PatientPage';

export class POManager {
  private _loginPage?: LoginPage;
  private _patientPage?: PatientPage;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Lazy initialization of LoginPage
  public getLoginPage(): LoginPage {
    if (!this._loginPage) {
      this._loginPage = new LoginPage(this.page);
    }
    return this._loginPage;
  }

  // Lazy initialization of PatientPage
  public getPatientPage(): PatientPage {
    if (!this._patientPage) {
      this._patientPage = new PatientPage(this.page);
    }
    return this._patientPage;
  }
}

