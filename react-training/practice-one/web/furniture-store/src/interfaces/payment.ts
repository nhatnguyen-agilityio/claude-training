export interface PaymentInterface {
  id?: number;
  address?: string;
  city?: string;
  country?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  name?: string;
  cardNumber?: string;
  cvv?: string;
  expirationDate?: string;
  useShippingAddress?: boolean;
  userId?: number;
}
