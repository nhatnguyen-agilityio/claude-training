import { calculateCartSummary, formatPrice } from './cart-summary';
import type { CartInterface } from '../interfaces/cart';
import type { ProductInterface } from '../interfaces/products';

const createCartItem = (
  productId: number,
  quantity: number,
): CartInterface => ({
  id: productId,
  userId: 1,
  item: { productId, variantId: 1, quantity },
});

const createProduct = (id: number, price: number): ProductInterface => ({
  id,
  name: `Product ${id}`,
  price,
  variants: [],
});

describe('calculateCartSummary', () => {
  it('should add up price times quantity when the cart has several items', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 2), createCartItem(2, 1)],
      [createProduct(1, 50), createProduct(2, 30)],
    );

    expect(summary.subtotal).toBe(130);
  });

  it('should charge the shipping fee when the subtotal is below the threshold', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 2)],
      [createProduct(1, 100)],
    );

    expect(summary.shipping).toBe(25);
    expect(summary.total).toBe(225);
  });

  it('should make shipping free when the subtotal is above the threshold', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 3)],
      [createProduct(1, 200)],
    );

    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(600);
  });

  it('should make shipping free when the subtotal is exactly the threshold', () => {
    const summary = calculateCartSummary(
      [createCartItem(1, 2)],
      [createProduct(1, 250)],
    );

    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(500);
  });

  it('should make shipping free when cent prices add up to exactly the threshold', () => {
    // 17.58 + 130.14 + 352.28 is 499.99999999999994 in plain floating point
    const summary = calculateCartSummary(
      [createCartItem(1, 1), createCartItem(2, 1), createCartItem(3, 1)],
      [
        createProduct(1, 17.58),
        createProduct(2, 130.14),
        createProduct(3, 352.28),
      ],
    );

    expect(summary.subtotal).toBe(500);
    expect(summary.shipping).toBe(0);
  });
});

describe('formatPrice', () => {
  it('should show two decimals when the price has cents', () => {
    expect(formatPrice(12.34)).toBe('$12.34');
  });

  it('should keep the trailing zero when the price has one decimal', () => {
    expect(formatPrice(24.5)).toBe('$24.50');
  });

  it('should show two decimals when the price is a whole number', () => {
    expect(formatPrice(25)).toBe('$25.00');
  });
});
