import { createContext } from 'react';
import type { UserStoreInterface } from '../interfaces/user';
import type { PaymentInterface } from '../interfaces/payment';

export type AuthContextType = {
  user: UserStoreInterface | null;
  setUser: (user: UserStoreInterface | null) => void;
  logout: () => void;
  setCustomerInfo: (customerInfo: PaymentInterface) => void;
  removeCustomerInfo: () => void;
  customerInfo: PaymentInterface | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);
