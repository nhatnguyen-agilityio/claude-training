import type { CartItemInterface } from './cart';

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
  items: CartItemInterface[];
}
