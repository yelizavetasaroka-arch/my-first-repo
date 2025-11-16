export class InventoryPage {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.basketIcon = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');

    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.addToCartButtons = page.locator('[data-test*="add-to-cart"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]'); // Добавьте этот локатор
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]'); // Добавьте этот локатор
    this.inventoryItems = page.locator('[data-test="inventory-item"]'); // Добавьте этот локатор
  }

  async open() {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }

  async addItemToCart(itemName) {
    const itemContainer = this.page.locator('[data-test="inventory-item"]', {
      hasText: itemName,
    });
    const addToCartBtn = itemContainer.locator('[data-test*="add-to-cart"]');

    await addToCartBtn.click();
  }

  async openCart() {
    await this.basketIcon.click();
  }

  async getPageTitle() {
    return await this.pageTitle.textContent();
  }

  async sortByPriceHighToLow() {
    await this.sortDropdown.selectOption("hilo");
  }

  async getItemNameByIndex(index) {
    return await this.itemNames.nth(index).textContent();
  }

  async addItemToCartByIndex(index) {
    await this.addToCartButtons.nth(index).click();
  }

  async goToCart() {
    await this.basketIcon.click();
  }

  async getItemsCount() {
    return await this.inventoryItems.count();
  }

  // Получить цену товара по индексу
  async getItemPriceByIndex(index) {
    return await this.itemPrices.nth(index).textContent();
  }

  getCartBadge() {
    return this.cartBadge;
  }
}
