import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ProductItem from '.';

jest.mock('../../apis/add-cart', () => ({
  useAddCart: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockUseAuth = jest.mocked(
  jest.requireMock('../../hooks/useAuth').useAuth,
);

const mockUseAddCart = jest.mocked(
  jest.requireMock('../../apis/add-cart').useAddCart,
);

const mockToast = jest.mocked(jest.requireMock('sonner').toast);

describe('ProductItemComponent', () => {
  const mockMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 1 },
    });
    mockUseAddCart.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });
  });
  describe('Rendering', () => {
    it('renders ProductItem component with correct text', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <ProductItem
              id={1}
              variantId={1}
              name="Test"
              price={100}
              imageUrl="https://via.placeholder.com/150"
              imageAlt="Test"
              variantColor="red"
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
      });
    });
    it('renders ProductItem component with correct image', () => {
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'Test');
    });
    it('renders ProductItem component with correct price', () => {
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );
      expect(screen.getByText('$100')).toBeInTheDocument();
    });
    it('renders ProductItem component with correct button', () => {
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Add to cart');
    });
    it('renders ProductItem component with correct button icon', () => {
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Add to cart');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
    it('renders ProductItem component with correct link', () => {
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('link')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/products/1');
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );
      await user.click(screen.getByRole('button'));
      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Return if user is not logged in', () => {
    it('does not render add to cart button when user is not logged in', () => {
      mockUseAuth.mockReturnValue({
        user: null,
      });
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );

      // Should not find any button (add to cart button should not be rendered)
      expect(screen.queryByRole('button')).not.toBeInTheDocument();

      // Should still render the product information
      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByRole('link')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders ProductItem component with correct loading state', async () => {
      mockUseAddCart.mockReturnValue({
        mutate: mockMutate,
        isLoading: true,
      });
      await act(async () => {
        render(
          <TestQueryClient>
            <ProductItem
              id={1}
              variantId={1}
              name="Test"
              price={100}
              imageUrl="https://via.placeholder.com/150"
              imageAlt="Test"
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      expect(screen.getByRole('button')).toHaveTextContent('Adding...');
      expect(screen.getByRole('button')).toHaveAttribute('disabled');
    });
  });

  describe('Mutation Callbacks', () => {
    it('calls toast with success message when onSuccess callback is triggered', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test Product"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );

      await user.click(screen.getByRole('button'));

      const mutateCall = mockMutate.mock.calls[0];
      const callbacks = mutateCall[1];
      const onSuccessCallback = callbacks.onSuccess;

      onSuccessCallback();

      expect(mockToast).toHaveBeenCalledWith(
        'Product Test Product has been added to your cart',
        {
          className: 'text-left',
        },
      );
    });

    it('calls toast with error message when onError callback is triggered', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <ProductItem
            id={1}
            variantId={1}
            name="Test Product"
            price={100}
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            variantColor="red"
          />
        </TestQueryClient>,
      );

      await user.click(screen.getByRole('button'));

      const mutateCall = mockMutate.mock.calls[0];
      const callbacks = mutateCall[1];
      const onErrorCallback = callbacks.onError;

      onErrorCallback();

      expect(mockToast).toHaveBeenCalledWith(
        'Failed to add product to cart. Please try again.',
        {
          className: 'text-left',
        },
      );
    });
  });
});
