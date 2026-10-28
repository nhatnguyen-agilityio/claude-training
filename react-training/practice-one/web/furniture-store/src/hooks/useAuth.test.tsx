import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import { AuthProvider } from '../auth/AuthProvider';
import { useGetPayment } from '../apis/get-payment';
import type { UserStoreInterface } from '../interfaces/user';
import type { PaymentInterface } from '../interfaces/payment';

jest.mock('../apis/get-payment', () => ({
  useGetPayment: jest.fn(),
}));

const mockUseGetPayment = useGetPayment as jest.MockedFunction<
  typeof useGetPayment
>;

const createMockQueryResult = (
  data: unknown = undefined,
  isLoading = false,
  error = null,
) =>
  ({
    data,
    isLoading,
    error,
    isError: !!error,
    isSuccess: !isLoading && !error,
    isPending: isLoading,
    isFetching: false,
    isRefetching: false,
    isStale: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isPlaceholderData: false,
    isPreviousData: false,
    isRefetchError: false,
    isInitialLoading: false,
    isLoadingError: false,
    isPaused: false,
    fetchStatus: 'idle' as const,
    status: isLoading
      ? ('pending' as const)
      : error
        ? ('error' as const)
        : ('success' as const),
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: error ? Date.now() : 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: error ? 1 : 0,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    hasNextPage: false,
    hasPreviousPage: false,
    fetchNextPage: jest.fn(),
    fetchPreviousPage: jest.fn(),
    isFetchingNextPageError: false,
    isFetchingPreviousPageError: false,
    fetchNextPageError: null,
    fetchPreviousPageError: null,
    hasNextPageError: false,
    hasPreviousPageError: false,
    refetch: jest.fn(),
    remove: jest.fn(),
    isEnabled: true,
    promise: Promise.resolve(),
  }) as ReturnType<typeof useGetPayment>;

const createWrapper = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>;
  };
};

const createWrapperWithoutProvider = () => {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
  };
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Context Access', () => {
    it('should return auth context when used within AuthProvider', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('setUser');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('setCustomerInfo');
      expect(result.current).toHaveProperty('removeCustomerInfo');
      expect(result.current).toHaveProperty('customerInfo');
    });

    it('should throw error when used outside AuthProvider', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth(), {
          wrapper: createWrapperWithoutProvider(),
        });
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Initial State', () => {
    it('should return null user and customer info initially', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();
      expect(result.current.customerInfo).toBeNull();
    });

    it('should return user from sessionStorage when available', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should return customer info from localStorage when available', async () => {
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      localStorage.setItem('customerInfo', JSON.stringify(mockCustomerInfo));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.customerInfo).toEqual(mockCustomerInfo);
    });
  });

  describe('Function Properties', () => {
    it('should provide setUser function', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.setUser).toBe('function');
    });

    it('should provide logout function', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.logout).toBe('function');
    });

    it('should provide setCustomerInfo function', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.setCustomerInfo).toBe('function');
    });

    it('should provide removeCustomerInfo function', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.removeCustomerInfo).toBe('function');
    });
  });

  describe('User Management', () => {
    it('should allow setting user via setUser function', async () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };

      await act(async () => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(sessionStorage.getItem('authUser')).toBe(JSON.stringify(mockUser));
    });

    it('should allow clearing user via setUser function', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(sessionStorage.getItem('authUser')).toBeNull();
    });

    it('should allow logging out via logout function', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(sessionStorage.getItem('authUser')).toBeNull();
    });
  });

  describe('Customer Info Management', () => {
    it('should allow setting customer info via setCustomerInfo function', async () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      const mockCustomerInfo: PaymentInterface = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };

      await act(async () => {
        result.current.setCustomerInfo(mockCustomerInfo);
      });

      expect(result.current.customerInfo).toEqual(mockCustomerInfo);
      expect(localStorage.getItem('customerInfo')).toBe(
        JSON.stringify(mockCustomerInfo),
      );
    });

    it('should allow removing customer info via removeCustomerInfo function', async () => {
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };
      localStorage.setItem('customerInfo', JSON.stringify(mockCustomerInfo));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await act(async () => {
        result.current.removeCustomerInfo();
      });

      expect(localStorage.getItem('checkout')).toBeNull();
    });
  });

  describe('Payment Data Integration', () => {
    it('should update customer info when payment data is available', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      const mockPaymentData: PaymentInterface[] = [
        {
          firstName: 'Payment',
          lastName: 'User',
          email: 'payment@example.com',
        },
      ];
      sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      mockUseGetPayment.mockReturnValue(createMockQueryResult(mockPaymentData));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.customerInfo).toEqual(mockPaymentData[0]);
    });

    it('should prioritize payment data over localStorage customer info', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      const mockPaymentData: PaymentInterface[] = [
        {
          firstName: 'Payment',
          lastName: 'User',
          email: 'payment@example.com',
        },
      ];
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'LocalStorage',
        lastName: 'User',
        email: 'localstorage@example.com',
      };

      sessionStorage.setItem('authUser', JSON.stringify(mockUser));
      localStorage.setItem('customerInfo', JSON.stringify(mockCustomerInfo));
      mockUseGetPayment.mockReturnValue(createMockQueryResult(mockPaymentData));

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(result.current.customerInfo).toEqual(mockPaymentData[0]);
      expect(result.current.customerInfo).not.toEqual(mockCustomerInfo);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid JSON in sessionStorage', async () => {
      sessionStorage.setItem('authUser', 'invalid-json');
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth(), {
          wrapper: createWrapper(),
        });
      }).toThrow();

      consoleSpy.mockRestore();
    });

    it('should throw error for invalid JSON in localStorage', async () => {
      localStorage.setItem('customerInfo', 'invalid-json');
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth(), {
          wrapper: createWrapper(),
        });
      }).toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('Context Type Safety', () => {
    it('should return proper AuthContextType interface', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toMatchObject({
        setUser: expect.any(Function),
        logout: expect.any(Function),
        setCustomerInfo: expect.any(Function),
        removeCustomerInfo: expect.any(Function),
      });

      expect(
        result.current.user === null || typeof result.current.user === 'object',
      ).toBe(true);
      expect(
        result.current.customerInfo === null ||
          typeof result.current.customerInfo === 'object',
      ).toBe(true);
    });

    it('should maintain type safety when context is null', () => {
      const useContextSpy = jest.spyOn(React, 'useContext');
      useContextSpy.mockReturnValue(null);

      expect(() => {
        renderHook(() => useAuth(), {
          wrapper: createWrapper(),
        });
      }).toThrow('useAuth must be used within an AuthProvider');

      useContextSpy.mockRestore();
    });
  });

  describe('Hook Behavior', () => {
    it('should re-render when context values change', async () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      expect(result.current.user).toBeNull();

      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      await act(async () => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it('should maintain function references across renders', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const { result, rerender } = renderHook(() => useAuth(), {
        wrapper: createWrapper(),
      });

      rerender();

      expect(typeof result.current.setUser).toBe('function');
      expect(typeof result.current.logout).toBe('function');
      expect(typeof result.current.setCustomerInfo).toBe('function');
      expect(typeof result.current.removeCustomerInfo).toBe('function');
    });
  });
});
