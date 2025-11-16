export class LoginPage {
  constructor(page) {
    //page-жкземпляр страницы,получаемый из теста
    this.page = page;

    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[id="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  //метод для открытия страницы
  async open() {
    await this.page.goto("https://www.saucedemo.com/");
  }

  //метод,который инкапсулирует логику входа в систему
  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
