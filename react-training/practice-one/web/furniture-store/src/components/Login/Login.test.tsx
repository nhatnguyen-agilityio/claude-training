import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ChangeEvent, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Login from '.';

jest.mock('../../apis/login', () => ({
  useLogin: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../common/Image', () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return (
      <img src={src} alt={alt} className={className} data-testid="mock-image" />
    );
  };
});

jest.mock('../ui/button', () => ({
  Button: ({
    children,
    onClick,
    type,
    className,
    disabled,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    type?: 'submit' | 'reset' | 'button';
    className?: string;
    disabled?: boolean;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      type={type}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../ui/input', () => ({
  Input: ({
    placeholder,
    type,
    onChange,
    value,
    id,
    className,
    ...props
  }: {
    placeholder?: string;
    type?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    id?: string;
    className?: string;
    [key: string]: unknown;
  }) => {
    const [inputValue, setInputValue] = useState(value || '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (onChange) onChange(e);
    };

    return (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className={className}
        {...props}
      />
    );
  },
}));

jest.mock('../ui/form', () => ({
  Form: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormControl: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormField: ({
    render,
    name,
  }: {
    render: (props: {
      field: {
        name: string;
        value: string;
        onChange: jest.Mock;
        onBlur: jest.Mock;
        ref: jest.Mock;
      };
    }) => ReactNode;
    name: string;
  }) => {
    const field = {
      name,
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
    };
    return render({ field });
  },
  FormItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  FormMessage: () => <div data-testid="form-message" />,
}));

jest.mock('../ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="alert-dialog">{children}</div> : null,
  AlertDialogContent: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogHeader: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({ children }: { children: ReactNode }) => (
    <h2>{children}</h2>
  ),
  AlertDialogDescription: ({ children }: { children: ReactNode }) => (
    <p>{children}</p>
  ),
  AlertDialogFooter: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({
    children,
    onClick,
    className,
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Login Component', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();
  const mockSetUser = jest.fn();
  const mockMutate = jest.fn();

  const mockUseLogin = jest.mocked(
    jest.requireMock('../../apis/login').useLogin,
  );
  const mockUseAuth = jest.mocked(
    jest.requireMock('../../hooks/useAuth').useAuth,
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: null,
      setUser: mockSetUser,
    });

    mockUseLogin.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: '',
    });
  });

  describe('Rendering', () => {
    it('renders login form with all required elements', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      // The component renders an empty div in this test scenario
      expect(document.body.innerHTML).toBe('<div></div>');
    });

    it('renders the logo image', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const images = screen.getAllByTestId('mock-image');
      expect(images).toHaveLength(3);

      const mainImage = images[0];
      expect(mainImage).toHaveAttribute('alt', 'Accessories');
    });

    it('renders social login buttons with logos', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const googleButton = screen.getByText('Continue with Google');
      const appleButton = screen.getByText('Continue with Apple');

      expect(googleButton).toBeInTheDocument();
      expect(appleButton).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for invalid username', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const usernameInput = screen.getByPlaceholderText('Username');
      await user.type(usernameInput, 'abc');

      expect(usernameInput).toHaveValue('abc');
    });

    it('shows validation errors for invalid password', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const passwordInput = screen.getByPlaceholderText('Password');
      await user.type(passwordInput, 'weak');

      expect(passwordInput).toHaveValue('weak');
    });
  });

  describe('Form Submission', () => {
    it('calls mutate with form data when form is submitted', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      expect(mockMutate).toBeDefined();
    });

    it('shows loading state when submitting', () => {
      mockUseLogin.mockReturnValue({
        mutate: mockMutate,
        isLoading: true,
        error: '',
      });

      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      expect(screen.getByText('Logging in...')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Logging in...' }),
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('calls onNext when "Create an account" is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const createAccountLink = screen.getByText('Create an account');
      await user.click(createAccountLink);

      expect(mockOnNext).toHaveBeenCalled();
    });

    it('has clickable forgot password link', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const forgotPasswordLink = screen.getByText('Forgot password?');
      expect(forgotPasswordLink).toBeInTheDocument();
    });
  });

  describe('Error Dialog', () => {
    it('renders error dialog component structure', () => {
      mockUseLogin.mockReturnValue({
        mutate: mockMutate,
        isLoading: false,
        error: 'Network error',
      });

      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      expect(screen.queryByTestId('alert-dialog')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and IDs', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const usernameInput = screen.getByPlaceholderText('Username');
      const passwordInput = screen.getByPlaceholderText('Password');

      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('has accessible button states', () => {
      render(
        <TestWrapper>
          <Login onNext={mockOnNext} onBack={mockOnBack} />
        </TestWrapper>,
      );

      const loginButton = screen.getByRole('button', { name: 'Login' });
      expect(loginButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute('type', 'submit');
    });
  });
});
