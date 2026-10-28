import { expect, test, type Page } from '@playwright/test';
import { E2E_API_URL } from './test-env';
import { login, productDetail, seedUser } from './helpers';

// Product 8 and product 1 both have a variant with id 101; start-test-api.mjs
// gives product 8 variant 101 a known stock of 5
const PRODUCT_ID = 8;
const OTHER_PRODUCT_ID = 1;
const VARIANT_ID = 101;

const readStock = async (
  request: import('@playwright/test').APIRequestContext,
  productId: number,
  variantId: number,
) => {
  const response = await request.get(`${E2E_API_URL}/products/${productId}`);
  const product = await response.json();
  return product.variants.find(
    (variant: { id: number }) => variant.id === variantId,
  ).stock as number;
};

const goToPayment = async (page: Page) => {
  await page.getByRole('button', { name: 'Cart', exact: true }).click();
  await page.getByRole('button', { name: 'Next' }).click();

  await page.getByPlaceholder('Email').fill('buyer@example.com');
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').fill('Buyer');
  await page.getByPlaceholder('Phone Number').fill('0901234567');
  await page.getByPlaceholder('Address').fill('1 Test Street');
  await page.getByPlaceholder('City').fill('Testville');
  await page.getByPlaceholder('Country').fill('Testland');
  await page.getByRole('button', { name: 'Proceed to payment' }).click();

  await page.getByPlaceholder('Card number').fill('4242424242424242');
  await page.getByPlaceholder('Expiration date').fill('12/30');
  await page.getByPlaceholder('CVV').fill('123');
  await page.getByPlaceholder('Cardholder name').fill('Test Buyer');
};

const addToCart = async (page: Page) => {
  await page.goto('/');
  await login(page);
  await page.goto(`/products/${PRODUCT_ID}?variantId=${VARIANT_ID}`);

  const detail = productDetail(page);
  await detail.getByRole('spinbutton', { name: 'Quantity' }).fill('1');
  await detail.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByText('has been added to your cart')).toBeVisible();
};

test.describe('Checkout stock update', () => {
  test.beforeEach(async ({ request }) => {
    // Other specs share this database: start from an empty cart
    await request.delete(`${E2E_API_URL}/carts/users/${seedUser.id}`);
  });

  test('should only deduct the bought product when another product shares the variant id', async ({
    page,
    request,
  }) => {
    const productStockBefore = await readStock(request, PRODUCT_ID, VARIANT_ID);
    const otherStockBefore = await readStock(
      request,
      OTHER_PRODUCT_ID,
      VARIANT_ID,
    );

    await addToCart(page);
    await goToPayment(page);
    await page.getByRole('button', { name: 'Pay Now' }).click();

    await expect(page.getByText('Your Order is Confirmed!')).toBeVisible();

    await expect
      .poll(() => readStock(request, PRODUCT_ID, VARIANT_ID))
      .toBe(productStockBefore - 1);
    expect(await readStock(request, OTHER_PRODUCT_ID, VARIANT_ID)).toBe(
      otherStockBefore,
    );
  });

  test('should block the order and keep the cart when an item runs out before payment', async ({
    page,
    request,
  }) => {
    const productUrl = `${E2E_API_URL}/products/${PRODUCT_ID}`;
    const ordersUrl = `${E2E_API_URL}/orders?userId=${seedUser.id}`;
    const cartUrl = `${E2E_API_URL}/carts?userId=${seedUser.id}`;
    const originalProduct = await (await request.get(productUrl)).json();
    const countOf = async (url: string) =>
      (await (await request.get(url)).json()).length;

    try {
      await addToCart(page);
      const ordersBefore = await countOf(ordersUrl);

      // Someone else buys the last unit while this customer is checking out
      await request.patch(productUrl, {
        data: {
          variants: originalProduct.variants.map((variant: { id: number }) =>
            variant.id === VARIANT_ID ? { ...variant, stock: 0 } : variant,
          ),
        },
      });

      await goToPayment(page);
      // Listen before clicking, so the stock request cannot be missed
      const stockResponse = page.waitForResponse(
        (response) =>
          /\/products\/update-stock\/?$/.test(response.url()) &&
          response.request().method() === 'PATCH',
      );
      await page.getByRole('button', { name: 'Pay Now' }).click();

      expect((await stockResponse).status()).toBe(400);
      await expect(
        page.getByText('Some items are no longer in stock'),
      ).toBeVisible();
      // Let any follow-up requests finish, so a late order write would show up
      await page.waitForLoadState('networkidle');

      await expect(page.getByText('Your Order is Confirmed!')).toBeHidden();
      expect(await countOf(ordersUrl)).toBe(ordersBefore);
      expect(await countOf(cartUrl)).toBe(1);
    } finally {
      await request.patch(productUrl, {
        data: { variants: originalProduct.variants },
      });
    }
  });
});
