import { fireEvent, render, screen } from '@testing-library/react';
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

const mockRefetch = jest.fn();

const cartItems: CartInterface[] = [
  { id: 1, userId: 1, item: { productId: 1, variantId: 1, quantity: 2 } },
];

const mockProducts = (price: number) => {
  mockUseGetCartProducts.mockReturnValue({
    data: [{ id: 1, name: 'Chair', price, variants: [] }],
    isPending: false,
    isError: false,
    refetch: mockRefetch,
  });
};

describe('CartSummary', () => {
  beforeEach(() => {
    mockRefetch.mockClear();
  });

  it('should show skeletons when products are loading', () => {
    mockUseGetCartProducts.mockReturnValue({
      data: [],
      isPending: true,
      isError: false,
      refetch: mockRefetch,
    });

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getAllByTestId('skeleton')).toHaveLength(3);
  });

  it('should show an error message when products fail to load', () => {
    mockUseGetCartProducts.mockReturnValue({
      data: [],
      isPending: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<CartSummary cartItems={cartItems} />);

    expect(
      screen.getByText('Failed to load order summary'),
    ).toBeInTheDocument();
  });

  it('should refetch products when the try again button is clicked', () => {
    mockUseGetCartProducts.mockReturnValue({
      data: [],
      isPending: false,
      isError: true,
      refetch: mockRefetch,
    });

    render(<CartSummary cartItems={cartItems} />);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it('should show subtotal, shipping fee and total when subtotal is below the threshold', () => {
    mockProducts(100);

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getByText('$200.00')).toBeInTheDocument();
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    expect(screen.getByText('$225.00')).toBeInTheDocument();
    expect(
      screen.getByText('Add $300.00 more for free shipping'),
    ).toBeInTheDocument();
  });

  it('should show free shipping when subtotal reaches the threshold', () => {
    mockProducts(300);

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getAllByText('$600.00')).toHaveLength(2);
  });

  it('should show free shipping when subtotal is exactly the threshold', () => {
    mockProducts(250);

    render(<CartSummary cartItems={cartItems} />);

    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getAllByText('$500.00')).toHaveLength(2);
    expect(
      screen.queryByText(/more for free shipping/),
    ).not.toBeInTheDocument();
  });
});
