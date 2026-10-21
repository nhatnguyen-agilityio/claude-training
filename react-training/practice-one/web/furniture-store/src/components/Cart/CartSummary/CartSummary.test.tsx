import { render, screen } from '@testing-library/react';
import CartSummary from './index';
import { useGetCartProducts } from '../../../apis/cart-products';
import type { CartInterface } from '../../../interfaces/cart';

jest.mock('../../../apis/cart-products', () => ({
  useGetCartProducts: jest.fn(),
}));

jest.mock('../../ui/skeleton', () => ({
  Skeleton: function MockSkeleton({ className }: { className: string }) {
    return <div data-testid="skeleton" className={className} />;
  },
}));

const mockUseGetCartProducts = useGetCartProducts as jest.MockedFunction<
  typeof useGetCartProducts
>;

const cartItems: CartInterface[] = [
  { id: 1, userId: 1, item: { productId: 1, variantId: 1, quantity: 2 } },
];

const mockProducts = (price: number) => {
  mockUseGetCartProducts.mockReturnValue({
    data: [{ id: 1, name: 'Chair', price, variants: [] }],
    isPending: false,
    isError: false,
  });
};

describe('CartSummary', () => {
  it('should show skeletons when products are loading', () => {
    mockUseGetCartProducts.mockReturnValue({
      data: [],
      isPending: true,
      isError: false,
    });

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('should show an error message when products fail to load', () => {
    mockUseGetCartProducts.mockReturnValue({
      data: [],
      isPending: false,
      isError: true,
    });

    render(<CartSummary cartItems={cartItems} />);

    expect(
      screen.getByText('Failed to load order summary'),
    ).toBeInTheDocument();
  });

  it('should show subtotal, shipping fee and total when subtotal is below the threshold', () => {
    mockProducts(100);

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getByText('$200')).toBeInTheDocument();
    expect(screen.getByText('$25')).toBeInTheDocument();
    expect(screen.getByText('$225')).toBeInTheDocument();
    expect(
      screen.getByText('Add $300 more for free shipping'),
    ).toBeInTheDocument();
  });

  it('should show free shipping when subtotal reaches the threshold', () => {
    mockProducts(300);

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getAllByText('$600')).toHaveLength(2);
  });
});
