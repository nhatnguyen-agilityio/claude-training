import { useEffect, useState, type ReactNode } from 'react';
import type { UserStoreInterface } from '../interfaces/user';
import { AuthContext } from './AuthContext';
import { useGetPayment } from '../apis/get-payment';
import type { PaymentInterface } from '../interfaces/payment';
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserData] = useState<UserStoreInterface | null>(null);
  const [customerInfo, setCustomerInfoData] = useState<PaymentInterface | null>(
    null,
  );

  const { data: payment } = useGetPayment(Number(user?.id), !!user?.id);

  useEffect(() => {
    const savedUser =
      localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
    if (savedUser) {
      // Keep a remembered user in localStorage so they survive the next restart
      setUser(JSON.parse(savedUser), !!localStorage.getItem('authUser'));
    }

    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (payment) {
      setCustomerInfo(payment[0]);
    } else if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    }
  }, [payment]);

  const setUser = (user: UserStoreInterface | null, remember = false) => {
    if (user) {
      const storage = remember ? localStorage : sessionStorage;
      const otherStorage = remember ? sessionStorage : localStorage;
      storage.setItem('authUser', JSON.stringify(user));
      otherStorage.removeItem('authUser');
    } else {
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authUser');
    }
    setUserData(user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('customerInfo');
  };

  const setCustomerInfo = (customerInfo: PaymentInterface) => {
    if (customerInfo) {
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
      setCustomerInfoData(customerInfo);
    }
  };

  const removeCustomerInfo = () => {
    localStorage.removeItem('checkout');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        setCustomerInfo,
        removeCustomerInfo,
        customerInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
