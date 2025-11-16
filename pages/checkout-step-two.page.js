export class CheckoutStepTwoPage {
  constructor(page) {
    this.page = page;

    this.orderInf = page.locator('[data-test="cart-list"]');
    this.paymentInf = page.locator('[data-test="payment-info-value"]');
    this.shippingInf = page.locator('[data-test="shipping-info-value"]');
    this.totalPrice = page.locator('[data-test="total-label"]');
    this.finishBtn = page.locator('[data-test="finish"]');

    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartItems = page.locator(".cart_item");
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/checkout-step-two.html");
  }

  async finishCheckout() {
    await this.finishBtn.click();
  }

  async getItemNames() {
    return await this.itemNames.allTextContents();
  }

  async getTotalPrice() {
    return await this.totalPrice.textContent();
  }

  async getPaymentInfo() {
    return await this.paymentInf.textContent();
  }

  async getItemsCount() {
    return await this.page.locator(".cart_item").count();
  }
}
