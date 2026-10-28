import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Main from './index';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../components/common/Image', () => {
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

jest.mock('../../components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navigation Menu</nav>;
  };
});

jest.mock('../../components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer Content</footer>;
  };
});

jest.mock('../../components/Sidebar', () => ({
  __esModule: true,
  default: function MockSidebar({
    open,
    onOpenChange,
    button,
    title,
    children,
  }: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    button: ReactNode;
    title: string;
    children: ReactNode;
  }) {
    return (
      <div data-testid="sidebar" data-open={open}>
        <div data-testid="sidebar-button">{button}</div>
        <div data-testid="sidebar-title">{title}</div>
        <div data-testid="sidebar-content">{children}</div>
        <button data-testid="sidebar-close" onClick={() => onOpenChange(false)}>
          Close
        </button>
      </div>
    );
  },
}));

jest.mock('../../components/CartButton', () => {
  return {
    __esModule: true,
    default: function MockCartButton({
      onClick,
    }: {
      onClick?: (e: React.MouseEvent) => void;
    }) {
      return (
        <button data-testid="cart-button" onClick={onClick}>
          Cart
        </button>
      );
    },
  };
});

jest.mock('../../components/GetStarted', () => {
  return {
    __esModule: true,
    default: function MockGetStarted({
      onClick,
    }: {
      onClick?: (e: React.MouseEvent) => void;
    }) {
      return (
        <button data-testid="get-started-button" onClick={onClick}>
          Get Started
        </button>
      );
    },
  };
});

jest.mock('../../components/UserButton', () => {
  return {
    __esModule: true,
    default: function MockUserButton() {
      return <button data-testid="user-button">User Menu</button>;
    },
  };
});

jest.mock('../../components/Loading', () => {
  return {
    __esModule: true,
    default: function MockLoading() {
      return <div data-testid="loading">Loading...</div>;
    },
  };
});

jest.mock('../../components/Cart', () => {
  return function MockCart({
    onNext,
    onLogin,
  }: {
    onNext?: () => void;
    onLogin?: () => void;
  }) {
    return (
      <div data-testid="cart-component">
        <button data-testid="cart-next" onClick={onNext}>
          Next to Checkout
        </button>
        <button data-testid="cart-login" onClick={onLogin}>
          Login
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Checkout', () => {
  return function MockCheckout({
    onNext,
    onLogin,
  }: {
    onNext?: () => void;
    onLogin?: () => void;
  }) {
    return (
      <div data-testid="checkout-component">
        <button data-testid="checkout-next" onClick={onNext}>
          Next to Payment
        </button>
        <button data-testid="checkout-login" onClick={onLogin}>
          Login
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Payment', () => {
  return function MockPayment({ onNext }: { onNext?: () => void }) {
    return (
      <div data-testid="payment-component">
        <button data-testid="payment-next" onClick={onNext}>
          Complete Order
        </button>
      </div>
    );
  };
});

jest.mock('../../components/OrderSuccess', () => {
  return function MockOrderSuccess({ onBack }: { onBack?: () => void }) {
    return (
      <div data-testid="order-success-component">
        <button data-testid="order-success-back" onClick={onBack}>
          Back to Home
        </button>
      </div>
    );
  };
});

jest.mock('../../components/Login', () => {
  return function MockLogin({
    onNext,
    onBack,
  }: {
    onNext?: () => void;
    onBack?: () => void;
  }) {
    return (
      <div data-testid="login-component">
        <button data-testid="login-next" onClick={onNext}>
          Sign Up
        </button>
        <button data-testid="login-back" onClick={onBack}>
          Back
        </button>
      </div>
    );
  };
});

jest.mock('../../components/SignUp', () => {
  return function MockSignUp({ onNext }: { onNext?: () => void }) {
    return (
      <div data-testid="signup-component">
        <button data-testid="signup-next" onClick={onNext}>
          Login
        </button>
      </div>
    );
  };
});

jest.mock('../../components/ui/sonner', () => ({
  Toaster: function MockToaster() {
    return <div data-testid="toaster">Toast Container</div>;
  },
}));

jest.mock('lucide-react', () => ({
  AlignJustify: () => <div data-testid="align-justify-icon" />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
  Outlet: () => <div data-testid="outlet">Page Content</div>,
}));

const mockUseAuth = jest.mocked(jest.requireMock('../../hooks/useAuth').useAuth);

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <HelmetProvider>
    <BrowserRouter>{children}</BrowserRouter>
  </HelmetProvider>
);

describe('Main Component', () => {
  const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders main layout with header, outlet, and footer', () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('toaster')).toBeInTheDocument();
    });

    it('renders logo with correct link', () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const logoLink = screen.getByTestId('link');
      expect(logoLink).toHaveAttribute('href', '/');
      expect(logoLink).toContainElement(screen.getByTestId('mock-image'));
    });

    it('renders mobile menu icon', () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      expect(screen.getByTestId('align-justify-icon')).toBeInTheDocument();
    });
  });

  describe('User Authentication States', () => {
    it('renders GetStarted button when user is not logged in', () => {
      mockUseAuth.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      expect(screen.getByTestId('get-started-button')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
    });

    it('renders CartButton and UserButton when user is logged in', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('cart-button')).toBeInTheDocument();
        expect(screen.getByTestId('user-button')).toBeInTheDocument();
        expect(
          screen.queryByTestId('get-started-button'),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Sidebar State Management', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('starts with sidebar closed', () => {
      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'false');
    });

    it('opens cart when CartButton is clicked', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const cartButton = screen.getByTestId('cart-button');
      await user.click(cartButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'true');

      await waitFor(() => {
        expect(screen.getByTestId('cart-component')).toBeInTheDocument();
      });
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Cart');
    });

    it('opens login when GetStarted is clicked', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const getStartedButton = screen.getByTestId('get-started-button');
      await user.click(getStartedButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'true');

      await waitFor(() => {
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
      });
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('');
    });

    it('closes sidebar when close button is clicked', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const cartButton = screen.getByTestId('cart-button');
      await user.click(cartButton);

      const closeButton = screen.getByTestId('sidebar-close');
      await user.click(closeButton);

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Cart Flow', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('navigates from cart to checkout', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));

      await waitFor(() => {
        expect(screen.getByTestId('cart-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('cart-next'));

      await waitFor(() => {
        expect(screen.getByTestId('checkout-component')).toBeInTheDocument();
      });
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Checkout');
    });

    it('navigates from checkout to payment', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));

      await waitFor(() => {
        expect(screen.getByTestId('cart-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('cart-next'));

      await waitFor(() => {
        expect(screen.getByTestId('checkout-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('checkout-next'));

      await waitFor(() => {
        expect(screen.getByTestId('payment-component')).toBeInTheDocument();
      });
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Payment');
    });

    it('completes order flow from payment to success', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));

      await waitFor(() => {
        expect(screen.getByTestId('cart-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('cart-next'));

      await waitFor(() => {
        expect(screen.getByTestId('checkout-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('checkout-next'));

      await waitFor(() => {
        expect(screen.getByTestId('payment-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('payment-next'));

      await waitFor(() => {
        expect(
          screen.getByTestId('order-success-component'),
        ).toBeInTheDocument();
      });
    });

    it('returns to closed state from order success', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      await user.click(screen.getByTestId('cart-next'));
      await user.click(screen.getByTestId('checkout-next'));
      await user.click(screen.getByTestId('payment-next'));

      await user.click(screen.getByTestId('order-success-back'));

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Authentication Flow', () => {
    it('navigates from cart to login when user needs to authenticate', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('get-started-button'));

      await waitFor(() => {
        expect(screen.getByTestId('login-component')).toBeInTheDocument();
      });

      await user.click(screen.getByTestId('login-next'));

      await waitFor(() => {
        expect(screen.getByTestId('signup-component')).toBeInTheDocument();
      });
    });

    it('navigates from signup back to login', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('get-started-button'));
      await user.click(screen.getByTestId('login-next'));

      await user.click(screen.getByTestId('signup-next'));

      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });

    it('returns to closed state from login back button', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('get-started-button'));

      await user.click(screen.getByTestId('login-back'));

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Sidebar Title Management', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('shows correct title for each step', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Cart');

      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Checkout');

      await user.click(screen.getByTestId('checkout-next'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('Payment');

      await user.click(screen.getByTestId('payment-next'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('');
    });

    it('shows empty title for login and signup steps', async () => {
      mockUseAuth.mockReturnValue({ user: null });
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('get-started-button'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('');

      await user.click(screen.getByTestId('login-next'));
      expect(screen.getByTestId('sidebar-title')).toHaveTextContent('');
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('prevents default behavior on button clicks', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const cartButton = screen.getByTestId('cart-button');
      await user.click(cartButton);

      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );
    });

    it('handles multiple rapid clicks correctly', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );

      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('checkout-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('checkout-next'));
      expect(screen.getByTestId('payment-component')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('renders all child components in sidebar when appropriate', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('cart-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('checkout-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('checkout-next'));
      expect(screen.getByTestId('payment-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('payment-next'));
      expect(screen.getByTestId('order-success-component')).toBeInTheDocument();
    });

    it('passes correct props to child components', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('cart-next')).toBeInTheDocument();
      expect(screen.getByTestId('cart-login')).toBeInTheDocument();

      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('checkout-next')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-login')).toBeInTheDocument();

      await user.click(screen.getByTestId('checkout-next'));
      expect(screen.getByTestId('payment-next')).toBeInTheDocument();

      await user.click(screen.getByTestId('payment-next'));
      expect(screen.getByTestId('order-success-back')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('has proper heading structure', () => {
      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toContainElement(screen.getByTestId('mock-image'));
    });

    it('has accessible navigation elements', () => {
      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('link')).toHaveAttribute('href', '/');
    });

    it('has accessible buttons with proper roles', () => {
      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      const cartButton = screen.getByTestId('cart-button');
      expect(cartButton).toBeInTheDocument();
      expect(cartButton.tagName).toBe('BUTTON');

      const userButton = screen.getByTestId('user-button');
      expect(userButton).toBeInTheDocument();
      expect(userButton.tagName).toBe('BUTTON');
    });
  });

  describe('State Transitions', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({ user: mockUser });
    });

    it('maintains state consistency during transitions', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'false',
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );
      expect(screen.getByTestId('cart-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );
      expect(screen.getByTestId('checkout-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('checkout-next'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );
      expect(screen.getByTestId('payment-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('payment-next'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'true',
      );
      expect(screen.getByTestId('order-success-component')).toBeInTheDocument();
    });

    it('handles state reset when closing sidebar', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Main />
        </TestWrapper>,
      );

      await user.click(screen.getByTestId('cart-button'));
      await user.click(screen.getByTestId('cart-next'));
      expect(screen.getByTestId('checkout-component')).toBeInTheDocument();

      await user.click(screen.getByTestId('sidebar-close'));
      expect(screen.getByTestId('sidebar')).toHaveAttribute(
        'data-open',
        'false',
      );

      await user.click(screen.getByTestId('cart-button'));
      expect(screen.getByTestId('cart-component')).toBeInTheDocument();
    });
  });
});
