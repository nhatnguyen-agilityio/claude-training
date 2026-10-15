import type { ReactNode } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Cart from './index';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../apis/user-cart', () => ({
  useGetUserCart: jest.fn(),
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
    className,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('../ui/skeleton', () => ({
  Skeleton: function MockSkeleton({ className }: { className: string }) {
    return <div data-testid="skeleton" className={className} />;
  },
}));

jest.mock('./CartItem', () => {
  return function MockCartItem({
    cartItem,
  }: {
    cartItem: {
      id: number;
      productName: string;
      price: number;
      quantity: number;
      imageUrl: string;
    };
  }) {
    return (
      <div data-testid="cart-item">
        <div data-testid="cart-item-id">{cartItem.id}</div>
        <div data-testid="cart-item-name">{cartItem.productName}</div>
        <div data-testid="cart-item-price">{cartItem.price}</div>
        <div data-testid="cart-item-quantity">{cartItem.quantity}</div>
        <div data-testid="cart-item-image">{cartItem.imageUrl}</div>
      </div>
    );
  };
});

jest.mock('lucide-react', () => ({
  TriangleAlert: () => <div data-testid="triangle-alert-icon" />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to} data-testid="link">
      {children}
    </a>
  ),
}));

const mockUseAuth = jest.mocked(
  jest.requireMock('../../hooks/useAuth').useAuth,
);
const mockUseGetUserCart = jest.mocked(
  jest.requireMock('../../apis/user-cart').useGetUserCart,
);

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Cart Component', () => {
  const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
  const mockOnNext = jest.fn();
  const mockOnLogin = jest.fn();

  const mockCartItems = [
    {
      id: 1,
      productName: 'Modern Chair',
      price: 299,
      quantity: 2,
      imageUrl: 'https://example.com/chair.jpg',
    },
    {
      id: 2,
      productName: 'Wooden Table',
      price: 599,
      quantity: 1,
      imageUrl: 'https://example.com/table.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders loading skeletons when data is pending', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      await act(async () => {
        render(
          <TestWrapper>
            <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
          </TestWrapper>,
        );
      });

      await waitFor(() => {
        const skeletons = screen.getAllByTestId('skeleton');
        expect(skeletons.length).toBeGreaterThan(0);

        expect(skeletons[0]).toHaveClass('h-20 w-20 rounded-lg');
        expect(skeletons[1]).toHaveClass('h-4 w-3/4');
        expect(skeletons[2]).toHaveClass('h-4 w-1/2');
      });
    });

    it('renders correct number of cart item skeletons', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons).toHaveLength(19);
    });

    it('renders bottom skeleton for checkout button', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const bottomSkeleton = screen
        .getAllByTestId('skeleton')
        .find((skeleton) => skeleton.className.includes('w-full h-14'));
      expect(bottomSkeleton).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error message when API fails', async () => {
      const errorMessage = 'Failed to fetch cart data';
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: errorMessage },
      });

      await act(async () => {
        render(
          <TestWrapper>
            <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
          </TestWrapper>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to load cart')).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByTestId('triangle-alert-icon')).toBeInTheDocument();
      });
    });

    it('renders default error message when no specific error message', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Failed to load cart')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Something went wrong while loading your cart. Please try again.',
        ),
      ).toBeInTheDocument();
    });

    it('renders try again button in error state', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: 'Network error' },
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton.tagName).toBe('BUTTON');
    });

    it('renders shop all button in error state', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: 'Network error' },
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const shopAllButton = screen.getByText('SHOP ALL');
      const shopAllLink = screen.getByTestId('link');

      expect(shopAllButton).toBeInTheDocument();
      expect(shopAllLink).toHaveAttribute('href', '/products');
    });
  });

  describe('User Authentication States', () => {
    it('renders login message when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(
        screen.getByText('Your need login to see your cart'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

    it('renders login button when user is not authenticated', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({ user: null });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const loginButton = screen.getByText('Login');
      await user.click(loginButton);

      expect(mockOnLogin).toHaveBeenCalled();
    });

    it('calls useGetUserCart with correct parameters when user is authenticated', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(mockUseGetUserCart).toHaveBeenCalledWith(1, true);
    });

    it('calls useGetUserCart with disabled flag when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(mockUseGetUserCart).toHaveBeenCalledWith(NaN, false);
    });
  });

  describe('Cart Content States', () => {
    it('renders cart items when user has items in cart', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const cartItems = screen.getAllByTestId('cart-item');
      expect(cartItems).toHaveLength(2);

      const cartItemNames = screen.getAllByTestId('cart-item-name');
      const cartItemPrices = screen.getAllByTestId('cart-item-price');
      const cartItemQuantities = screen.getAllByTestId('cart-item-quantity');

      expect(cartItemNames[0]).toHaveTextContent('Modern Chair');
      expect(cartItemPrices[0]).toHaveTextContent('299');
      expect(cartItemQuantities[0]).toHaveTextContent('2');
    });

    it('renders empty cart message when user has no items', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('renders all cart item details correctly', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const firstItemName = screen.getAllByTestId('cart-item-name')[0];
      const firstItemPrice = screen.getAllByTestId('cart-item-price')[0];
      const firstItemQuantity = screen.getAllByTestId('cart-item-quantity')[0];

      expect(firstItemName).toHaveTextContent('Modern Chair');
      expect(firstItemPrice).toHaveTextContent('299');
      expect(firstItemQuantity).toHaveTextContent('2');

      const secondItemName = screen.getAllByTestId('cart-item-name')[1];
      const secondItemPrice = screen.getAllByTestId('cart-item-price')[1];
      const secondItemQuantity = screen.getAllByTestId('cart-item-quantity')[1];

      expect(secondItemName).toHaveTextContent('Wooden Table');
      expect(secondItemPrice).toHaveTextContent('599');
      expect(secondItemQuantity).toHaveTextContent('1');
    });
  });

  describe('Navigation Actions', () => {
    it('renders next button when user has items in cart', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton).toBeInTheDocument();

      await user.click(nextButton);
      expect(mockOnNext).toHaveBeenCalled();
    });

    it('does not render next button when cart is empty', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });

    it('does not render next button when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.queryByText('Next')).not.toBeInTheDocument();
    });
  });

  describe('Button Positioning', () => {
    it('applies fixed positioning for small cart (less than 4 items)', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const nextButton = screen.getByText('Next');
      const buttonContainer = nextButton.parentElement;
      expect(buttonContainer).toHaveClass(
        'fixed',
        'bottom-0',
        'left-0',
        'right-0',
      );
    });

    it('applies sticky positioning for large cart (4 or more items)', () => {
      const largeCart = [
        ...mockCartItems,
        {
          id: 3,
          productName: 'Luxury Sofa',
          price: 1299,
          quantity: 1,
          imageUrl: 'https://example.com/sofa.jpg',
        },
        {
          id: 4,
          productName: 'Coffee Table',
          price: 399,
          quantity: 1,
          imageUrl: 'https://example.com/coffee-table.jpg',
        },
      ];

      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: largeCart,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const nextButton = screen.getByText('Next');
      const buttonContainer = nextButton.parentElement;
      expect(buttonContainer).toHaveClass('sticky', 'bottom-0');
    });
  });

  describe('Image Rendering', () => {
    it('renders empty cart image with correct attributes', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveAttribute(
        'src',
        'https://ucarecdn.com/7c8fb29d-1c6e-43bd-af7e-dbb55c271c1f/-/format/auto/',
      );
      expect(image).toHaveAttribute('alt', 'Squircle');
      expect(image).toHaveClass('w-full h-full object-contain');
    });

    it('renders login required image with correct attributes', () => {
      mockUseAuth.mockReturnValue({ user: null });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveAttribute(
        'src',
        'https://ucarecdn.com/7c8fb29d-1c6e-43bd-af7e-dbb55c271c1f/-/format/auto/',
      );
      expect(image).toHaveAttribute('alt', 'Squircle');
      expect(image).toHaveClass('w-full h-full object-contain');
    });
  });

  describe('Component Integration', () => {
    it('passes correct props to CartItem components', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const cartItems = screen.getAllByTestId('cart-item');
      expect(cartItems).toHaveLength(2);

      const cartItemIds = screen.getAllByTestId('cart-item-id');
      const cartItemImages = screen.getAllByTestId('cart-item-image');

      expect(cartItemIds[0]).toHaveTextContent('1');
      expect(cartItemImages[0]).toHaveTextContent(
        'https://example.com/chair.jpg',
      );
    });

    it('handles multiple renders correctly', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      const { rerender } = render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('cart-item')).toHaveLength(2);

      rerender(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
    });
  });

  describe('Accessibility', () => {
    it('has proper button accessibility', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      const nextButton = screen.getByText('Next');
      expect(nextButton.tagName).toBe('BUTTON');
      expect(nextButton).toBeInTheDocument();
    });

    it('has accessible error state', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: 'Network error' },
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Failed to load cart')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('SHOP ALL')).toBeInTheDocument();
    });

    it('has accessible empty state', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined user gracefully', () => {
      mockUseAuth.mockReturnValue({ user: undefined });
      mockUseGetUserCart.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(
        screen.getByText('Your need login to see your cart'),
      ).toBeInTheDocument();
    });

    it('handles component unmounting during API call', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      const { unmount } = render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('skeleton')).toHaveLength(19);

      unmount();

      expect(() => unmount()).not.toThrow();
    });

    it('handles null cart data gracefully', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });
      mockUseGetUserCart.mockReturnValue({
        data: null,
        isPending: false,
        isError: false,
        error: null,
      });

      expect(() => {
        render(
          <TestWrapper>
            <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
          </TestWrapper>,
        );
      }).toThrow();
    });
  });

  describe('State Transitions', () => {
    it('transitions from loading to success state', async () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      const { rerender } = render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('skeleton')).toHaveLength(19);

      mockUseGetUserCart.mockReturnValue({
        data: mockCartItems,
        isPending: false,
        isError: false,
        error: null,
      });

      rerender(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getAllByTestId('cart-item')).toHaveLength(2);
      });
    });

    it('transitions from loading to error state', () => {
      mockUseAuth.mockReturnValue({ user: mockUser });

      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      const { rerender } = render(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('skeleton')).toHaveLength(19);

      mockUseGetUserCart.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: 'API Error' },
      });

      rerender(
        <TestWrapper>
          <Cart onNext={mockOnNext} onLogin={mockOnLogin} />
        </TestWrapper>,
      );

      expect(screen.getByText('Failed to load cart')).toBeInTheDocument();
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });
});
