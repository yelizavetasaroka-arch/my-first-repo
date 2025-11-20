import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page.js";
import { InventoryPage } from "../pages/inventory.page.js";
import { CartPage } from "../pages/cart.page.js";
import { CheckoutStepOnePage } from "../pages/checkout-step-one.page.js";
import { CheckoutStepTwoPage } from "../pages/checkout-step-two.page.js";
import { CheckoutCompletePage } from "../pages/checkout.complete.page.js";

test("@ui Полный процесс от логина до завершения заказа", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutStepOnePage = new CheckoutStepOnePage(page);
  const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
  const checkoutCompletePage = new CheckoutCompletePage(page);

  await loginPage.open();
  await loginPage.login("standard_user", "secret_sauce");

  const pageTitle = await inventoryPage.getPageTitle();
  expect(pageTitle).toBe("Products");
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

  // 4. Добавление самого дорогого товара
  await inventoryPage.sortByPriceHighToLow();
  const mostExpensiveItemName = await inventoryPage.getItemNameByIndex(0);
  const mostExpensiveItemPrice = await inventoryPage.getItemPriceByIndex(0);

  await inventoryPage.addItemToCartByIndex(0);

  await expect(inventoryPage.getCartBadge()).toHaveText("1");

  // 5. Переход в корзину
  await inventoryPage.goToCart();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");

  // 6. Проверки в корзине
  const cartItems = await cartPage.getItemNames();
  expect(cartItems).toContain(mostExpensiveItemName);

  const cartItemPrice = await cartPage.getItemPriceByName(
    mostExpensiveItemName
  );
  expect(cartItemPrice).toBe(mostExpensiveItemPrice);

  expect(await cartPage.getItemsCount()).toBe(1);

  // 7. Начало оформления заказа
  await cartPage.goToCheckout();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-one.html"
  );

  // 8. Заполнение информации
  await checkoutStepOnePage.fillUserInfo("Test", "User", "12345");
  await checkoutStepOnePage.continueToOverview();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-step-two.html"
  );

  // 9. Проверки на странице overview
  const overviewItems = await checkoutStepTwoPage.getItemNames();
  expect(overviewItems).toContain(mostExpensiveItemName);
  const totalPrice = await checkoutStepTwoPage.getTotalPrice();
  expect(parseFloat(totalPrice.replace(/[^\d.]/g, ""))).toBeGreaterThanOrEqual(
    parseFloat(mostExpensiveItemPrice.replace("$", ""))
  );

  const paymentInfo = await checkoutStepTwoPage.getPaymentInfo();
  expect(paymentInfo).toContain("SauceCard");

  // 10. Завершение покупки
  await checkoutStepTwoPage.finishCheckout();
  await expect(page).toHaveURL(
    "https://www.saucedemo.com/checkout-complete.html"
  );

  // 11. Финальные проверки
  const successMessage = await checkoutCompletePage.getCompletionMessage();
  expect(successMessage).toBe("Thank you for your order!");

  const completionImage = checkoutCompletePage.getCompletionImage();
  await expect(completionImage).toBeVisible();

  await checkoutCompletePage.backToProducts();
  await expect(inventoryPage.getCartBadge()).not.toBeAttached();
});
