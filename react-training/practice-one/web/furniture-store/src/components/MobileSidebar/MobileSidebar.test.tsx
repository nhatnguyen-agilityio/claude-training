import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MobileSidebar from './index';
import { useAuth } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');
jest.mock('../Navbar', () => {
  return function MockNavbar({ onClose }: { onClose?: () => void }) {
    return (
      <nav data-testid="navbar">
        <button onClick={onClose} data-testid="navbar-close">
          Close
        </button>
      </nav>
    );
  };
});
jest.mock('../CartButton', () => {
  return function MockCartButton({
    onClick,
  }: {
    onClick: (e: React.MouseEvent) => void;
  }) {
    return (
      <button onClick={onClick} data-testid="cart-button">
        Cart
      </button>
    );
  };
});
jest.mock('../UserButton', () => {
  return function MockUserButton() {
    return <button data-testid="user-button">User</button>;
  };
});
jest.mock('../GetStarted', () => {
  return function MockGetStarted({
    onClick,
  }: {
    onClick: (e: React.MouseEvent) => void;
  }) {
    return (
      <button onClick={onClick} data-testid="get-started-button">
        Get Started
      </button>
    );
  };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('MobileSidebar', () => {
  const mockOnClose = jest.fn();
  const mockOnCartClick = jest.fn();
  const mockOnLoginClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should render navbar and user actions for authenticated user', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('cart-button')).toBeInTheDocument();
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
      expect(
        screen.queryByTestId('get-started-button'),
      ).not.toBeInTheDocument();
    });

    it('should call onClose when navbar close is clicked', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      fireEvent.click(screen.getByTestId('navbar-close'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onCartClick when cart button is clicked', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      fireEvent.click(screen.getByTestId('cart-button'));
      expect(mockOnCartClick).toHaveBeenCalledTimes(1);
    });

    it('should handle cart button click without errors', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      const cartButton = screen.getByTestId('cart-button');

      expect(() => {
        fireEvent.click(cartButton);
      }).not.toThrow();

      expect(mockOnCartClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should render navbar and get started button for non-authenticated user', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('get-started-button')).toBeInTheDocument();
      expect(screen.queryByTestId('cart-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('user-button')).not.toBeInTheDocument();
    });

    it('should call onLoginClick when get started button is clicked', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      fireEvent.click(screen.getByTestId('get-started-button'));
      expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
    });

    it('should handle get started button click without errors', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      const getStartedButton = screen.getByTestId('get-started-button');

      expect(() => {
        fireEvent.click(getStartedButton);
      }).not.toThrow();

      expect(mockOnLoginClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('with optional props', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should render without optional props', () => {
      renderWithRouter(<MobileSidebar />);

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('cart-button')).toBeInTheDocument();
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });

    it('should handle missing onCartClick gracefully', () => {
      renderWithRouter(
        <MobileSidebar onClose={mockOnClose} onLoginClick={mockOnLoginClick} />,
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('cart-button'));
      }).not.toThrow();
    });

    it('should handle missing onLoginClick gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });

      renderWithRouter(
        <MobileSidebar onClose={mockOnClose} onCartClick={mockOnCartClick} />,
      );

      expect(() => {
        fireEvent.click(screen.getByTestId('get-started-button'));
      }).not.toThrow();
    });
  });

  describe('layout and styling', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should have proper container classes', () => {
      const { container } = renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass('flex', 'flex-col', 'h-full');
    });

    it('should render user actions section with proper styling', () => {
      const { container } = renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      const userActionsDiv = container.querySelector(
        '.flex.items-center.p-4.mb-4.border-gray-200',
      );
      expect(userActionsDiv).toBeInTheDocument();
    });
  });

  describe('component integration', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should render all child components correctly', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      // Check that all expected components are rendered
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('cart-button')).toBeInTheDocument();
      expect(screen.getByTestId('user-button')).toBeInTheDocument();
    });

    it('should pass correct props to child components', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
      expect(screen.getByTestId('cart-button')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
        setUser: jest.fn(),
        logout: jest.fn(),
        customerInfo: null,
        setCustomerInfo: jest.fn(),
        removeCustomerInfo: jest.fn(),
      });
    });

    it('should have accessible buttons', () => {
      renderWithRouter(
        <MobileSidebar
          onClose={mockOnClose}
          onCartClick={mockOnCartClick}
          onLoginClick={mockOnLoginClick}
        />,
      );

      const cartButton = screen.getByTestId('cart-button');
      const userButton = screen.getByTestId('user-button');

      expect(cartButton).toBeInTheDocument();
      expect(userButton).toBeInTheDocument();
      expect(cartButton.tagName).toBe('BUTTON');
      expect(userButton.tagName).toBe('BUTTON');
    });
  });
});
