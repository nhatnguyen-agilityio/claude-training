import { buildOrderPayload, parseCheckoutInfo } from './order-payload';

// A saved payment record as the API returns it, including fields an order must not copy
const savedCustomerInfo = {
  id: 7,
  name: 'Alice Nguyen',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Nguyen',
  phoneNumber: '84987654321',
  address: '1 Old Street',
  city: 'Hanoi',
  country: 'Vietnam',
  cardNumber: '4111111111111111',
  cvv: '111',
  expirationDate: '08/26',
  useShippingAddress: true,
  expiredDate: '2026-08',
  createdAt: '2025-08-10T10:00:00Z',
};

const savedCard = {
  name: 'Alice Nguyen',
  cardNumber: '4111111111111111',
  cvv: '111',
  expirationDate: '08/26',
  useShippingAddress: false,
  rememberMe: false,
};

const items = [{ productId: 1, variantId: 101, quantity: 1 }];

describe('buildOrderPayload', () => {
  it('should save the order with the card typed in the form when the customer enters a new card', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: {
        name: 'Alice Test',
        cardNumber: '4242 4242 4242 4242',
        cvv: '123',
        expirationDate: '12/30',
        useShippingAddress: false,
        rememberMe: false,
      },
      userId: 1,
      items,
    });

    expect(payload).toMatchObject({
      cardholderName: 'Alice Test',
      cardLast4: '4242',
    });
  });

  it('should save the order with the phone from the checkout step when the customer changes it', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: {
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Nguyen',
        phoneNumber: '84900000111',
        address: '2 New Street',
        city: 'Hanoi',
        country: 'Vietnam',
      },
      paymentForm: savedCard,
      userId: 1,
      items,
    });

    expect(payload.phoneNumber).toBe('84900000111');
    expect(payload.address).toBe('2 New Street');
  });

  it('should fall back to the saved details when the checkout step was skipped', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: savedCard,
      userId: 1,
      items,
    });

    expect(payload).toMatchObject({
      phoneNumber: '84987654321',
      address: '1 Old Street',
      email: 'alice@example.com',
    });
  });

  it('should never store the full card number or CVV when building the order', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: { ...savedCard, cardNumber: '4242424242424242', cvv: '123' },
      userId: 1,
      items,
    });

    const stored = JSON.stringify(payload);
    expect(payload).not.toHaveProperty('cardNumber');
    expect(payload).not.toHaveProperty('cvv');
    expect(stored).not.toContain('4242424242424242');
    expect(stored).not.toContain('4111111111111111');
  });

  it('should keep only the order fields when the saved record has extra ones', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: { ...savedCard, useShippingAddress: true, rememberMe: true },
      userId: 1,
      items,
    });

    expect(Object.keys(payload).sort()).toEqual(
      [
        'address',
        'cardLast4',
        'cardholderName',
        'city',
        'country',
        'email',
        'firstName',
        'items',
        'lastName',
        'phoneNumber',
        'userId',
      ].sort(),
    );
    expect(payload.userId).toBe(1);
    expect(payload.items).toEqual(items);
  });
});

describe('parseCheckoutInfo', () => {
  it('should return the checkout details when the stored value is valid JSON', () => {
    expect(parseCheckoutInfo('{"phoneNumber":"84900000111"}')).toEqual({
      phoneNumber: '84900000111',
    });
  });

  it('should return null when nothing is stored', () => {
    expect(parseCheckoutInfo(null)).toBeNull();
  });

  it('should return null when the stored value is not valid JSON', () => {
    expect(parseCheckoutInfo('{"phoneNumber": "8490')).toBeNull();
  });
});
