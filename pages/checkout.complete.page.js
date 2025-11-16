export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;

    this.completeHeader = page.locator(".complete-header");
    this.completeText = page.locator(".complete-text");
    this.ponyImage = page.locator(".pony_express");
    this.backToProductsBtn = page.locator('[data-test="back-to-products"]');
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/checkout-complete.html");
  }

  async getCompletionMessage() {
    return await this.completeHeader.textContent();
  }

  getCompletionImage() {
    return this.ponyImage;
  }

  async backToProducts() {
    await this.backToProductsBtn.click();
  }
}
