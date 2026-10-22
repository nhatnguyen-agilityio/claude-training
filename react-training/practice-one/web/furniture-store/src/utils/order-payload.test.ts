import { buildOrderPayload } from './order-payload';

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
};

const items = [{ productId: 1, variantId: 101, quantity: 1 }];

describe('buildOrderPayload', () => {
  it('should save the order with the card typed in the form when the customer enters a new card', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: {
        name: 'Alice Test',
        cardNumber: '4242424242424242',
        cvv: '123',
        expirationDate: '12/30',
        useShippingAddress: false,
        rememberMe: false,
      },
      userId: 1,
      items,
    });

    expect(payload).toMatchObject({
      name: 'Alice Test',
      cardNumber: '4242424242424242',
      cvv: '123',
      expirationDate: '12/30',
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
      paymentForm: {
        name: 'Alice Nguyen',
        cardNumber: '4111111111111111',
        cvv: '111',
        expirationDate: '08/26',
        useShippingAddress: false,
        rememberMe: false,
      },
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
      paymentForm: {
        name: 'Alice Nguyen',
        cardNumber: '4111111111111111',
        cvv: '111',
        expirationDate: '08/26',
        useShippingAddress: false,
        rememberMe: false,
      },
      userId: 1,
      items,
    });

    expect(payload).toMatchObject({
      phoneNumber: '84987654321',
      address: '1 Old Street',
      email: 'alice@example.com',
    });
  });

  it('should keep the order user and items and drop form-only fields when building the payload', () => {
    const payload = buildOrderPayload({
      customerInfo: savedCustomerInfo,
      checkoutInfo: null,
      paymentForm: {
        name: 'Alice Test',
        cardNumber: '4242424242424242',
        cvv: '123',
        expirationDate: '12/30',
        useShippingAddress: true,
        rememberMe: true,
      },
      userId: 1,
      items,
    });

    expect(payload.userId).toBe(1);
    expect(payload.items).toEqual(items);
    expect(payload).not.toHaveProperty('id');
    expect(payload).not.toHaveProperty('rememberMe');
    expect(payload).not.toHaveProperty('useShippingAddress');
  });
});
