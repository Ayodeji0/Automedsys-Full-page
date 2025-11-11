import { Page, Locator } from '@playwright/test';
import { ACTIVE_CONFIG } from '../config/env.config';

export class LoginPage {
  private page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly practiceId: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#Username');
    this.passwordInput = page.locator('#Password');
    this.practiceId = page.locator('#PracticeRefNumber');
    this.loginButton = page.locator("button[type='submit']");
  }

  async login() {
    const { username, password, practiceId } = ACTIVE_CONFIG;

    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.practiceId.fill(practiceId);
    await this.loginButton.click();
    await this.page.waitForLoadState('networkidle')
  }
}

