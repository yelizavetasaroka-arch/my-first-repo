export class CartPage {
  constructor(page) {
    this.page = page;

    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartList = page.locator('[data-test="cart-list"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/cart.html");
  }

  async getItemNames() {
    return await this.itemNames.allTextContents();
  }

  async getItemsCount() {
    return await this.cartItems.count();
  }

  // Получить цену товара по его названию
  async getItemPriceByName(itemName) {
    // Находим индекс товара по названию
    const allItemNames = await this.getItemNames();
    const itemIndex = allItemNames.indexOf(itemName);

    if (itemIndex !== -1) {
      return await this.itemPrices.nth(itemIndex).textContent();
    }
    throw new Error(`Товар с названием "${itemName}" не найден в корзине`);
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }

  async removeItemFromCart(itemName) {
    const itemContainer = this.page.locator('[data-test="inventory-item"]', {
      hasText: itemName,
    });
    const removeButton = itemContainer.locator('[data-test*="remove"]');
    await removeButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
