import { type ReactNode } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import CartItem from './index';
import type { CartInterface } from '../../../interfaces/cart';
import type { ProductInterface } from '../../../interfaces/products';

// Mock the product detail api
jest.mock('../../../apis/product-detail', () => ({
  useGetProductDetail: jest.fn(),
}));

// Mock the update cart api
jest.mock('../../../apis/update-cart', () => ({
  useUpdateCart: jest.fn(),
}));

// Mock the Image component
jest.mock('../../common/Image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      data-testid="product-image"
    />
  ),
}));

// Mock the lazy-loaded components
jest.mock('../../ui/input', () => ({
  Input: ({
    value,
    onChange,
    className,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      value={value}
      onChange={onChange}
      className={className}
      data-testid="quantity-input"
    />
  ),
}));

jest.mock('../../ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      {...props}
      className={`animate-pulse bg-gray-200 ${className}`}
      data-testid="skeleton"
    />
  ),
}));

// Mock data for product detail
const mockProductDetail: ProductInterface = {
  id: 1,
  name: 'Modern Dining Chair',
  price: 299.99,
  variants: [
    {
      id: 1,
      hex: '#FF5733',
      size: 'Medium',
      stock: 10,
      images: [
        {
          url: 'https://example.com/image1.jpg',
          alt: 'Modern Dining Chair',
        },
      ],
    },
    {
      id: 2,
      hex: '#33FF57',
      size: 'Large',
      stock: 5,
      images: [
        {
          url: 'https://example.com/image2.jpg',
          alt: 'Modern Dining Chair Large',
        },
      ],
    },
  ],
};

const mockCartItem: CartInterface = {
  id: 1,
  userId: 1,
  item: {
    productId: 1,
    variantId: 1,
    quantity: 2,
  },
};

const mockSecondCartItem: CartInterface = {
  id: 2,
  userId: 1,
  item: {
    productId: 1,
    variantId: 2,
    quantity: 1,
  },
};

const TestQueryClient = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </BrowserRouter>
  );
};

describe('CartItem Component', () => {
  const mockUseGetProductDetail = jest.mocked(
    jest.requireMock('../../../apis/product-detail').useGetProductDetail,
  );
  const mockUseUpdateCart = jest.mocked(
    jest.requireMock('../../../apis/update-cart').useUpdateCart,
  );
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseGetProductDetail.mockReturnValue({
      data: mockProductDetail,
      isPending: false,
      isError: false,
    });

    mockUseUpdateCart.mockReturnValue({
      mutate: mockMutate,
    });
  });

  describe('Rendering', () => {
    it('renders cart item with product information', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Modern Dining Chair')).toBeInTheDocument();
      });

      expect(screen.getByText('$599.98')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
    });

    it('renders product image', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const image = screen.getByTestId('product-image');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
        expect(image).toHaveAttribute('alt', 'Modern Dining Chair');
      });
    });

    it('renders variant color indicator', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const colorIndicator = document.querySelector(
          '[style*="background-color: rgb(255, 87, 51)"]',
        );
        expect(colorIndicator).toBeInTheDocument();
      });
    });

    it('renders correct variant information', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockSecondCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('$299.99')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('renders skeleton loading state', async () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const skeletons = document.querySelectorAll('[data-testid="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error State', () => {
    it('renders error state with retry button', async () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to load product')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    it('should render Try Again button and handle click in error state', async () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const button = screen.getByRole('button', { name: /try again/i });
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute(
          'class',
          'text-sm text-app-primary hover:underline',
        );

        // Test that the button is clickable (we can't test window.location.reload in jsdom)
        fireEvent.click(button);
        expect(button).toBeInTheDocument();
      });
    });

    it('renders retry button in error state', async () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const retryButton = screen.getByText('Try Again');
        expect(retryButton).toBeInTheDocument();
        expect(retryButton).toHaveAttribute(
          'class',
          'text-sm text-app-primary hover:underline',
        );
      });
    });
  });

  describe('Quantity Management', () => {
    it('updates quantity when input value changes', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('2');
        expect(quantityInput).toBeInTheDocument();
      });

      const quantityInput = screen.getByDisplayValue('2');
      await user.clear(quantityInput);
      await user.type(quantityInput, '5');

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          {
            cartId: 1,
            cartPayload: {
              ...mockCartItem,
              item: {
                productId: 1,
                variantId: 1,
                quantity: 5,
              },
            },
          },
          {},
        );
      });
    });

    it('updates price when quantity changes', async () => {
      const cartItemWithQuantity3: CartInterface = {
        id: 1,
        userId: 1,
        item: {
          productId: 1,
          variantId: 1,
          quantity: 3,
        },
      };

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={cartItemWithQuantity3} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('$899.97')).toBeInTheDocument();
        expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      });
    });

    it('handles minimum quantity of 1', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('2');
        expect(quantityInput).toHaveAttribute('min', '1');
      });
    });

    it('handles maximum quantity based on variant stock', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('2');
        expect(quantityInput).toHaveAttribute('max', '10');
      });
    });

    it('handles different maximum quantity for different variants', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockSecondCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('1');
        expect(quantityInput).toHaveAttribute('max', '5');
      });
    });
  });

  describe('Variant Handling', () => {
    it('uses correct variant image when variant exists', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockSecondCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const image = screen.getByTestId('product-image');
        expect(image).toHaveAttribute('src', 'https://example.com/image2.jpg');
        expect(image).toHaveAttribute('alt', 'Modern Dining Chair Large');
      });
    });

    it('displays correct variant color', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockSecondCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const colorIndicator = document.querySelector(
          '[style*="background-color: rgb(51, 255, 87)"]',
        );
        expect(colorIndicator).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper input attributes for quantity', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('2');
        expect(quantityInput).toHaveAttribute('type', 'number');
        expect(quantityInput).toHaveAttribute('min', '1');
        expect(quantityInput).toHaveAttribute('max', '10');
      });
    });
  });

  describe('User Interactions', () => {
    it('handles invalid quantity input gracefully', async () => {
      const user = userEvent.setup();

      await act(async () => {
        render(
          <TestQueryClient>
            <CartItem cartItem={mockCartItem} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const quantityInput = screen.getByDisplayValue('2');
        expect(quantityInput).toBeInTheDocument();
      });

      const quantityInput = screen.getByDisplayValue('2');
      await user.clear(quantityInput);
      await user.type(quantityInput, 'abc');

      expect(quantityInput).toHaveValue(0);
    });
  });
});
