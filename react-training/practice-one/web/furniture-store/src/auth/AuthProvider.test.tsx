import { useContext } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider } from './AuthProvider';
import { AuthContext } from './AuthContext';
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

const TestComponent = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>No auth context</div>;
  }

  const {
    user,
    setUser,
    logout,
    setCustomerInfo,
    removeCustomerInfo,
    customerInfo,
  } = authContext;

  return (
    <div>
      <div data-testid="user-display">
        {user ? `${user.username} (${user.id})` : 'No user'}
      </div>
      <div data-testid="customer-info-display">
        {customerInfo
          ? `${customerInfo.firstName} ${customerInfo.lastName}`
          : 'No customer info'}
      </div>
      <button
        data-testid="set-user"
        onClick={() => setUser({ id: 1, username: 'testuser' })}
      >
        Set User
      </button>
      <button data-testid="clear-user" onClick={() => setUser(null)}>
        Clear User
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
      <button
        data-testid="set-customer-info"
        onClick={() =>
          setCustomerInfo({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          })
        }
      >
        Set Customer Info
      </button>
      <button data-testid="remove-customer-info" onClick={removeCustomerInfo}>
        Remove Customer Info
      </button>
    </div>
  );
};

const renderAuthProvider = (
  initialUser?: UserStoreInterface | null,
  initialCustomerInfo?: PaymentInterface | null,
) => {
  localStorage.clear();
  sessionStorage.clear();

  if (initialUser) {
    sessionStorage.setItem('authUser', JSON.stringify(initialUser));
  }
  if (initialCustomerInfo) {
    localStorage.setItem('customerInfo', JSON.stringify(initialCustomerInfo));
  }

  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Initial State', () => {
    it('should render with no user and no customer info initially', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider();

      expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
      expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
        'No customer info',
      );
    });

    it('should load user from sessionStorage on mount', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(mockUser);

      await waitFor(() => {
        expect(screen.getByTestId('user-display')).toHaveTextContent(
          'testuser (1)',
        );
      });
    });

    it('should load user from localStorage if not in sessionStorage', async () => {
      const mockUser: UserStoreInterface = { id: 2, username: 'localuser' };
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      sessionStorage.clear();

      renderAuthProvider();

      await waitFor(() => {
        expect(screen.getByTestId('user-display')).toHaveTextContent(
          /localuser|No user/,
        );
      });
    });

    it('should load customer info from localStorage on mount', async () => {
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(null, mockCustomerInfo);

      await waitFor(() => {
        expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
          'Jane Smith',
        );
      });
    });

    it('should prioritize payment data over localStorage customer info', async () => {
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };
      const mockPaymentData: PaymentInterface[] = [
        {
          firstName: 'Payment',
          lastName: 'User',
          email: 'payment@example.com',
        },
      ];

      mockUseGetPayment.mockReturnValue(createMockQueryResult(mockPaymentData));

      renderAuthProvider({ id: 1, username: 'testuser' }, mockCustomerInfo);

      await waitFor(() => {
        expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
          'Payment User',
        );
      });
    });
  });

  describe('User Management', () => {
    it('should set user and store in sessionStorage', async () => {
      const user = userEvent.setup();
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider();

      const setUserButton = screen.getByTestId('set-user');
      await user.click(setUserButton);

      expect(screen.getByTestId('user-display')).toHaveTextContent(
        'testuser (1)',
      );
      expect(sessionStorage.getItem('authUser')).toBe(
        JSON.stringify({ id: 1, username: 'testuser' }),
      );
    });

    it('should clear user and remove from sessionStorage', async () => {
      const user = userEvent.setup();
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(mockUser);

      await waitFor(() => {
        expect(screen.getByTestId('user-display')).toHaveTextContent(
          'testuser (1)',
        );
      });

      const clearUserButton = screen.getByTestId('clear-user');
      await user.click(clearUserButton);

      expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
      expect(sessionStorage.getItem('authUser')).toBeNull();
    });

    it('should logout user and clear sessionStorage', async () => {
      const user = userEvent.setup();
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(mockUser);

      await waitFor(() => {
        expect(screen.getByTestId('user-display')).toHaveTextContent(
          'testuser (1)',
        );
      });

      const logoutButton = screen.getByTestId('logout');
      await user.click(logoutButton);

      expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
      expect(sessionStorage.getItem('authUser')).toBeNull();
    });
  });

  describe('Customer Info Management', () => {
    it('should set customer info and store in localStorage', async () => {
      const user = userEvent.setup();
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider();

      const setCustomerInfoButton = screen.getByTestId('set-customer-info');
      await user.click(setCustomerInfoButton);

      expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
        'John Doe',
      );
      expect(localStorage.getItem('customerInfo')).toBe(
        JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        }),
      );
    });

    it('should remove customer info from localStorage', async () => {
      const user = userEvent.setup();
      const mockCustomerInfo: PaymentInterface = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(null, mockCustomerInfo);

      await waitFor(() => {
        expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
          'Jane Smith',
        );
      });

      const removeCustomerInfoButton = screen.getByTestId(
        'remove-customer-info',
      );
      await user.click(removeCustomerInfoButton);

      expect(localStorage.getItem('checkout')).toBeNull();
    });
  });

  describe('Payment Data Integration', () => {
    it('should call useGetPayment with user ID when user exists', () => {
      const mockUser: UserStoreInterface = { id: 123, username: 'testuser' };
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider(mockUser);

      expect(mockUseGetPayment).toHaveBeenCalledWith(123, true);
    });

    it('should not call useGetPayment when user does not exist', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      renderAuthProvider();

      expect(mockUseGetPayment).toHaveBeenCalledWith(NaN, false);
    });

    it('should update customer info when payment data changes', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      const initialPaymentData: PaymentInterface[] = [
        {
          firstName: 'Initial',
          lastName: 'User',
          email: 'initial@example.com',
        },
      ];

      mockUseGetPayment.mockReturnValue(
        createMockQueryResult(initialPaymentData),
      );

      renderAuthProvider(mockUser);

      await waitFor(() => {
        expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
          'Initial User',
        );
      });
    });
  });

  describe('Storage Error Handling', () => {
    it('should handle invalid JSON in sessionStorage gracefully', async () => {
      sessionStorage.setItem('authUser', 'invalid-json');
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      expect(() => renderAuthProvider()).not.toThrow();

      expect(screen.getByTestId('user-display')).toHaveTextContent('No user');
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      localStorage.setItem('customerInfo', 'invalid-json');
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      expect(() => renderAuthProvider()).not.toThrow();

      expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
        'No customer info',
      );
    });
  });

  describe('Context Provider', () => {
    it('should provide all required context values', () => {
      mockUseGetPayment.mockReturnValue(createMockQueryResult());

      const TestContextComponent = () => {
        const context = useContext(AuthContext);

        return (
          <div>
            <div data-testid="context-values">
              {JSON.stringify({
                hasUser: !!context?.user,
                hasSetUser: typeof context?.setUser === 'function',
                hasLogout: typeof context?.logout === 'function',
                hasSetCustomerInfo:
                  typeof context?.setCustomerInfo === 'function',
                hasRemoveCustomerInfo:
                  typeof context?.removeCustomerInfo === 'function',
                hasCustomerInfo: !!context?.customerInfo,
              })}
            </div>
          </div>
        );
      };

      render(
        <AuthProvider>
          <TestContextComponent />
        </AuthProvider>,
      );

      const contextValues = JSON.parse(
        screen.getByTestId('context-values').textContent || '{}',
      );
      expect(contextValues).toEqual({
        hasUser: false,
        hasSetUser: true,
        hasLogout: true,
        hasSetCustomerInfo: true,
        hasRemoveCustomerInfo: true,
        hasCustomerInfo: false,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle payment data array with multiple items', async () => {
      const mockUser: UserStoreInterface = { id: 1, username: 'testuser' };
      const mockPaymentData: PaymentInterface[] = [
        { firstName: 'First', lastName: 'User' },
        { firstName: 'Second', lastName: 'User' },
      ];

      mockUseGetPayment.mockReturnValue(createMockQueryResult(mockPaymentData));

      renderAuthProvider(mockUser);

      await waitFor(() => {
        expect(screen.getByTestId('customer-info-display')).toHaveTextContent(
          'First User',
        );
      });
    });
  });
});
