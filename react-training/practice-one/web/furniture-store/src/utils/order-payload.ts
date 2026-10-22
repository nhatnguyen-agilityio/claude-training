import type { CartItemInterface } from '../interfaces/cart';
import type { CustomerInfoInterface } from '../interfaces/customerInfo';
import type { PaymentInterface } from '../interfaces/payment';

interface PaymentFormValues {
  name: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  useShippingAddress: boolean;
  rememberMe: boolean;
}

interface BuildOrderPayloadArgs {
  customerInfo?: PaymentInterface | null;
  checkoutInfo?: CustomerInfoInterface | null;
  paymentForm: PaymentFormValues;
  userId?: number;
  items: CartItemInterface[];
}

/**
 * Builds the order from what the customer entered during this checkout.
 * Later sources win: saved details < checkout step < payment form.
 */
export const buildOrderPayload = ({
  customerInfo,
  checkoutInfo,
  paymentForm,
  userId,
  items,
}: BuildOrderPayloadArgs) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...savedDetails } = customerInfo ?? {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { rememberMe, useShippingAddress, ...cardDetails } = paymentForm;

  return {
    ...savedDetails,
    ...(checkoutInfo ?? {}),
    ...cardDetails,
    userId,
    items,
  };
};
