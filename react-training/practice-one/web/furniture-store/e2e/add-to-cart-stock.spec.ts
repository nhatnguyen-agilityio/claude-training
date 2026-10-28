import { expect, test, type Page } from '@playwright/test';
import { E2E_API_URL } from './test-env';
import { login, seedUser } from './helpers';

// start-test-api.mjs sets product 1: variant 101 stock 2, variant 102 stock 0
const productDetail = (page: Page) =>
  page
    .locator('div')
    .filter({ has: page.getByRole('heading', { level: 2 }) })
    .filter({ has: page.getByRole('spinbutton', { name: 'Quantity' }) })
    .last();

test.describe.configure({ mode: 'serial' });

test.describe('Add to cart stock check', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/');
    await login(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should disable add to cart when the variant is out of stock', async () => {
    await page.goto('/products/1?variantId=102');

    const button = productDetail(page).getByRole('button', {
      name: 'Out of stock',
    });
    await expect(button).toBeVisible();
    await expect(button).toBeDisabled();
  });

  test('should cap the quantity at the stock when more is typed', async () => {
    await page.goto('/products/1?variantId=101');

    const quantity = productDetail(page).getByRole('spinbutton', {
      name: 'Quantity',
    });
    await quantity.fill('3');

    await expect(quantity).toHaveValue('2');
  });

  test('should add the item when the quantity fits the stock', async () => {
    await productDetail(page)
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(page.getByText('has been added to your cart')).toBeVisible();
  });

  test('should reject the item when the cart already holds all the stock', async () => {
    await productDetail(page)
      .getByRole('spinbutton', { name: 'Quantity' })
      .fill('1');
    await productDetail(page)
      .getByRole('button', { name: 'Add to cart' })
      .click();

    await expect(
      page.getByText('Sorry, only 2 item(s) available in stock'),
    ).toBeVisible();

    const response = await page.request.get(
      `${E2E_API_URL}/carts?userId=${seedUser.id}`,
    );
    const carts = await response.json();
    expect(carts).toHaveLength(1);
    expect(carts[0].item).toMatchObject({ variantId: 101, quantity: 2 });
  });
});
