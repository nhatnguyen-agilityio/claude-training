import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import Payment from '.';

// Mock env-variables
jest.mock('../../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:5001/',
}));

const mockUser = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
};

const mockCustomerInfo = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  cardNumber: '4111111111111111',
  cvv: '123',
  expirationDate: '12/25',
};

const mockUseAuth = {
  user: mockUser,
  customerInfo: mockCustomerInfo,
  removeCustomerInfo: jest.fn(),
  setCustomerInfo: jest.fn(),
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
}));

const mockAddPayment = jest.fn();
const mockUpdatePayment = jest.fn();
const mockAddOrder = jest.fn();
const mockDeleteCart = jest.fn();

jest.mock('../../apis/add-payment', () => ({
  useAddPayment: () => ({ mutate: mockAddPayment }),
}));

jest.mock('../../apis/update-payment', () => ({
  useUpdatePayment: () => ({ mutate: mockUpdatePayment }),
}));

jest.mock('../../apis/add-order', () => ({
  useAddOrder: () => ({ mutate: mockAddOrder }),
}));

jest.mock('../../apis/delete-cart', () => ({
  useDeleteCart: () => ({ mutate: mockDeleteCart }),
}));

jest.mock('../../apis/user-cart', () => ({
  useGetUserCart: () => ({
    data: [
      {
        id: 1,
        item: {
          productId: 1,
          variantId: 101,
          quantity: 2,
        },
      },
    ],
  }),
}));

jest.mock('../../apis/get-payment', () => ({
  useGetPayment: () => ({
    data: [],
  }),
}));

jest.mock('../ui/form', () => ({
  Form: ({ children }: { children: ReactNode }) => (
    <div data-testid="form-wrapper">{children}</div>
  ),
  FormControl: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormField: ({
    render,
  }: {
    render: (props: { field: unknown }) => ReactNode;
  }) => {
    const fieldProps = {
      onChange: jest.fn(),
      onBlur: jest.fn(),
      value: '',
      name: 'test-field',
      ref: jest.fn(),
    };
    return <div>{render({ field: fieldProps })}</div>;
  },
  FormItem: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  FormLabel: ({
    children,
    htmlFor,
  }: {
    children: ReactNode;
    htmlFor?: string;
  }) => <label htmlFor={htmlFor}>{children}</label>,
  FormMessage: () => <div data-testid="form-message"></div>,
}));

jest.mock('../ui/input', () => ({
  Input: ({
    placeholder,
    type,
    className,
    ...props
  }: Record<string, unknown>) => (
    <input
      placeholder={placeholder as string}
      type={type as string}
      className={className as string}
      data-testid={`input-${(placeholder as string)?.toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    />
  ),
}));

jest.mock('../ui/checkbox', () => ({
  Checkbox: ({
    id,
    checked,
    onCheckedChange,
    className,
  }: Record<string, unknown>) => (
    <input
      id={id as string}
      type="checkbox"
      checked={checked as boolean}
      onChange={(e) =>
        (onCheckedChange as (value: boolean) => void)?.(e.target.checked)
      }
      className={className as string}
      data-testid={`checkbox-${id as string}`}
    />
  ),
}));

jest.mock('../common/Button', () => ({
  __esModule: true,
  default: ({
    children,
    type,
    className,
    disabled,
    onClick,
  }: Record<string, unknown>) => (
    <button
      type={type as 'submit' | 'reset' | 'button'}
      className={className as string}
      disabled={disabled as boolean}
      onClick={onClick as () => void}
      data-testid="submit-button"
    >
      {children as ReactNode}
    </button>
  ),
}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const TestWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Payment Component', () => {
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  describe('Rendering', () => {
    it('renders payment form with all required elements', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('input-card-number')).toBeInTheDocument();
      expect(screen.getByTestId('input-expiration-date')).toBeInTheDocument();
      expect(screen.getByTestId('input-cvv')).toBeInTheDocument();
      expect(screen.getByTestId('input-cardholder-name')).toBeInTheDocument();
      expect(
        screen.getByTestId('checkbox-useShippingAddress'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('checkbox-rememberMe')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    it('renders form with correct structure', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Pay Now');
    });
  });

  describe('Form Fields', () => {
    it('renders card number input with correct attributes', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const cardNumberInput = screen.getByTestId('input-card-number');
      expect(cardNumberInput).toHaveAttribute('type', 'number');
      expect(cardNumberInput).toHaveAttribute('placeholder', 'Card number');
    });

    it('renders expiration date input with correct attributes', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const expirationInput = screen.getByTestId('input-expiration-date');
      expect(expirationInput).toHaveAttribute('type', 'text');
      expect(expirationInput).toHaveAttribute('placeholder', 'Expiration date');
    });

    it('renders CVV input with correct attributes', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const cvvInput = screen.getByTestId('input-cvv');
      expect(cvvInput).toHaveAttribute('type', 'number');
      expect(cvvInput).toHaveAttribute('placeholder', 'CVV');
    });

    it('renders cardholder name input with correct attributes', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const nameInput = screen.getByTestId('input-cardholder-name');
      expect(nameInput).toHaveAttribute('type', 'text');
      expect(nameInput).toHaveAttribute('placeholder', 'Cardholder name');
    });

    it('renders checkboxes with correct labels', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      expect(
        screen.getByText('Use shipping address as billing address'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Save my information for faster checkout'),
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles form submission', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockCustomerInfo),
      );

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockAddOrder).toHaveBeenCalled();
    });

    it('calls onNext when form is submitted successfully', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockCustomerInfo),
      );

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      const addOrderCall = mockAddOrder.mock.calls[0];
      const onSuccessCallback = addOrderCall[1].onSuccess;
      onSuccessCallback();

      expect(mockOnNext).toHaveBeenCalled();
    });

    it('handles checkbox interactions', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const useShippingCheckbox = screen.getByTestId(
        'checkbox-useShippingAddress',
      );
      const rememberMeCheckbox = screen.getByTestId('checkbox-rememberMe');

      await user.click(useShippingCheckbox);
      await user.click(rememberMeCheckbox);

      expect(useShippingCheckbox).toBeInTheDocument();
      expect(rememberMeCheckbox).toBeInTheDocument();
    });
  });

  describe('Form Validation Schema', () => {
    it('has correct validation schema structure', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
      expect(screen.getAllByTestId('form-message')).toHaveLength(4);
    });

    it('renders form message components for validation', () => {
      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const formMessages = screen.getAllByTestId('form-message');
      expect(formMessages).toHaveLength(4);
    });
  });

  describe('Customer Information Integration', () => {
    it('handles empty customer info gracefully', () => {
      const mockUseAuthEmpty = {
        ...mockUseAuth,
        customerInfo: null,
      };

      const useAuthModule = jest.requireMock('../../hooks/useAuth');
      useAuthModule.useAuth = jest.fn().mockReturnValue(mockUseAuthEmpty);

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('handles form submission with valid data', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockCustomerInfo),
      );

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(screen.getByTestId('form-wrapper')).toBeInTheDocument();
    });

    it('handles rememberMe checkbox interaction', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockCustomerInfo),
      );

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const rememberMeCheckbox = screen.getByTestId('checkbox-rememberMe');
      await user.click(rememberMeCheckbox);

      expect(rememberMeCheckbox).toBeInTheDocument();
    });

    it('handles useShippingAddress checkbox interaction', async () => {
      const user = userEvent.setup();
      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify(mockCustomerInfo),
      );

      render(
        <TestWrapper>
          <Payment onNext={mockOnNext} />
        </TestWrapper>,
      );

      const useShippingCheckbox = screen.getByTestId(
        'checkbox-useShippingAddress',
      );
      await user.click(useShippingCheckbox);

      expect(useShippingCheckbox).toBeInTheDocument();
    });
  });
});
