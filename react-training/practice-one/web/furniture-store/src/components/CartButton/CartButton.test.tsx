import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CartButton from '.';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the Button component
jest.mock('../common/Button', () => ({
  __esModule: true,
  default: ({
    children,
    className,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../apis/user-cart', () => ({
  useGetUserCart: jest.fn(),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('CartButtonComponent', () => {
  const mockUseAuth = jest.mocked(
    jest.requireMock('../../hooks/useAuth').useAuth,
  );
  const mockUseGetUserCart = jest.mocked(
    jest.requireMock('../../apis/user-cart').useGetUserCart,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders cart button with ShoppingCart icon', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
      });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders button with correct styling classes', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
      });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('relative');
      expect(button).toHaveClass('w-16');
      expect(button).toHaveClass('h-16');
      expect(button).toHaveClass('p-5');
      expect(button).toHaveClass('mr-5');
      expect(button).toHaveClass('bg-app-secondary');
      expect(button).toHaveClass('rounded-full');
      expect(button).toHaveClass('hover:bg-gray-200');
      expect(button).toHaveClass('transition');
    });
  });

  describe('Cart Count Display', () => {
    it('displays cart count badge when cart has items', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
      });
      mockUseGetUserCart.mockReturnValue({
        data: [{ id: 1 }, { id: 2 }, { id: 3 }],
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      const badge = screen.getByText('3');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('absolute');
      expect(badge).toHaveClass('-top-0.5');
      expect(badge).toHaveClass('-right-0.5');
      expect(badge).toHaveClass('bg-red-500');
      expect(badge).toHaveClass('text-white');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('font-bold');
      expect(badge).toHaveClass('rounded-full');
      expect(badge).toHaveClass('w-5');
      expect(badge).toHaveClass('h-5');
    });

    it('does not display cart count badge when cart is empty', () => {
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
      });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  describe('User Authentication States', () => {
    it('handles logged out user', () => {
      mockUseAuth.mockReturnValue({
        user: null,
      });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({
        user: { id: 1, username: 'testuser' },
      });
      mockUseGetUserCart.mockReturnValue({
        data: [{ id: 1 }],
        isPending: false,
        isError: false,
      });

      render(
        <TestQueryClient>
          <CartButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(button).toBeInTheDocument();
    });
  });
});
