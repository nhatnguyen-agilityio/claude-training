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
      setUser(JSON.parse(savedUser));
    }

    const savedCustomerInfo = localStorage.getItem('customerInfo');
    if (payment) {
      setCustomerInfo(payment[0]);
    } else if (savedCustomerInfo) {
      setCustomerInfo(JSON.parse(savedCustomerInfo));
    }
  }, [payment]);

  const setUser = (user: UserStoreInterface | null) => {
    if (user) {
      sessionStorage.setItem('authUser', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('authUser');
    }
    setUserData(user);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
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
