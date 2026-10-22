import type { CartItemInterface } from './cart';
import type { CustomerInfoInterface } from './customerInfo';
import type { PaymentFormValuesInterface, PaymentInterface } from './payment';

export interface OrderInterface {
  id?: number;
  userId?: number;
  orderDate?: number;
  status?: string;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  // Never store the full card number or CVV in an order
  cardholderName?: string;
  cardLast4?: string;
  items: CartItemInterface[];
}

export interface OrderPayloadSourcesInterface {
  customerInfo?: PaymentInterface | null;
  checkoutInfo?: CustomerInfoInterface | null;
  paymentForm: PaymentFormValuesInterface;
  userId?: number;
  items: CartItemInterface[];
}
