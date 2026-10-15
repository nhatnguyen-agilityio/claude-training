import { render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Checkout from '.';

const mockCustomerInfo = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '1234567890',
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
};

const mockUseAuth = {
  customerInfo: mockCustomerInfo,
  user: { id: 1, username: 'testuser' },
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth,
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
  FormMessage: () => <div data-testid="form-message"></div>,
}));

jest.mock('../ui/input', () => ({
  Input: ({
    placeholder,
    className,
    type,
    ...props
  }: {
    placeholder?: string;
    className?: string;
    type?: string;
    [key: string]: unknown;
  }) => (
    <input
      placeholder={placeholder}
      className={className}
      type={type}
      data-testid={`input-${placeholder?.toLowerCase().replace(/\s+/g, '-')}`}
      {...props}
    />
  ),
}));

jest.mock('../common/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
    type,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    [key: string]: unknown;
  }) {
    return (
      <button
        onClick={onClick}
        className={className}
        type={type}
        data-testid="submit-button"
        {...props}
      >
        {children}
      </button>
    );
  };
});

const mockForm = {
  control: {},
  handleSubmit: jest.fn((fn) => (e: Event) => {
    e.preventDefault();
    fn({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '1234567890',
      address: '123 Main St',
      city: 'New York',
      country: 'USA',
    });
  }),
};

jest.mock('react-hook-form', () => ({
  useForm: () => mockForm,
}));

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Checkout Component', () => {
  const mockOnNext = jest.fn();
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.setItem.mockClear();
  });

  describe('Rendering', () => {
    it('renders checkout form with all required elements', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Customer Information')).toBeInTheDocument();
      expect(screen.getByText('Shipping Address')).toBeInTheDocument();

      expect(screen.getByTestId('input-email')).toBeInTheDocument();
      expect(screen.getByTestId('input-first-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-last-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-phone-number')).toBeInTheDocument();
      expect(screen.getByTestId('input-address')).toBeInTheDocument();
      expect(screen.getByTestId('input-city')).toBeInTheDocument();
      expect(screen.getByTestId('input-country')).toBeInTheDocument();

      expect(screen.getByTestId('submit-button')).toBeInTheDocument();
      expect(screen.getByText('Proceed to payment')).toBeInTheDocument();
    });

    it('renders form with correct structure', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const form = screen.getByTestId('form-wrapper');
      expect(form).toBeInTheDocument();

      const cityInput = screen.getByTestId('input-city');
      const countryInput = screen.getByTestId('input-country');
      expect(cityInput).toBeInTheDocument();
      expect(countryInput).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('renders email input with correct attributes', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const emailInput = screen.getByTestId('input-email');
      expect(emailInput).toHaveAttribute('placeholder', 'Email');
    });

    it('renders name inputs with correct attributes', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const firstNameInput = screen.getByTestId('input-first-name');
      const lastNameInput = screen.getByTestId('input-last-name');

      expect(firstNameInput).toHaveAttribute('placeholder', 'First Name');
      expect(lastNameInput).toHaveAttribute('placeholder', 'Last Name');
    });

    it('renders phone number input with correct type', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const phoneInput = screen.getByTestId('input-phone-number');
      expect(phoneInput).toHaveAttribute('type', 'number');
      expect(phoneInput).toHaveAttribute('placeholder', 'Phone Number');
    });

    it('renders address input with correct attributes', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const addressInput = screen.getByTestId('input-address');
      expect(addressInput).toHaveAttribute('placeholder', 'Address');
    });

    it('renders city and country inputs in grid layout', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const cityInput = screen.getByTestId('input-city');
      const countryInput = screen.getByTestId('input-country');

      expect(cityInput).toHaveAttribute('placeholder', 'City');
      expect(countryInput).toHaveAttribute('placeholder', 'Country');
    });
  });

  describe('User Interactions', () => {
    it('handles form submission', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      expect(mockForm.handleSubmit).toHaveBeenCalled();
    });

    it('calls onNext when form is submitted', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalled();
      });
    });

    it('saves form data to localStorage on submission', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'checkout',
          JSON.stringify({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '1234567890',
            address: '123 Main St',
            city: 'New York',
            country: 'USA',
          }),
        );
      });
    });
  });

  describe('Form Validation Schema', () => {
    it('renders form message components for validation', () => {
      render(
        <TestWrapper>
          <Checkout onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const formMessages = screen.getAllByTestId('form-message');
      expect(formMessages).toHaveLength(7); // 7 form fields
    });
  });
});
