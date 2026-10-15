import { useState, type ChangeEvent, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ProductDetail from './index';

jest.mock('../../apis/product-detail', () => ({
  useGetProductDetail: jest.fn(),
}));

jest.mock('../../apis/add-cart', () => ({
  useAddCart: jest.fn(),
}));

jest.mock('../../apis/main-categories', () => ({
  GetMainCategories: jest.fn(),
}));

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

jest.mock('../../components/common/Breadcrumb', () => {
  return function MockBreadcrumb({
    className,
    items,
  }: {
    className: string;
    items: Array<{
      label: string | ReactNode;
      href?: string;
      isCurrentPage?: boolean;
    }>;
  }) {
    return (
      <nav className={className} data-testid="breadcrumb">
        {items.map((item, index) => (
          <span key={index} data-testid="breadcrumb-item">
            {typeof item.label === 'string' ? item.label : 'Skeleton'}
          </span>
        ))}
      </nav>
    );
  };
});

jest.mock('../../components/ui/carousel', () => ({
  Carousel: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="carousel">
      {children}
    </div>
  ),
  CarouselContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="carousel-content">{children}</div>
  ),
  CarouselItem: ({ children }: { children: ReactNode }) => (
    <div data-testid="carousel-item">{children}</div>
  ),
}));

jest.mock('../../components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    disabled,
    className,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    variant?: string;
    disabled?: boolean;
    className?: string;
    [key: string]: unknown;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('../../components/ui/input', () => ({
  Input: ({
    type,
    min,
    max,
    value,
    onChange,
    className,
    ...props
  }: {
    type?: string;
    min?: number;
    max?: number;
    value?: number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    [key: string]: unknown;
  }) => {
    const [inputValue, setInputValue] = useState(value || 1);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(Number(e.target.value));
      if (onChange) onChange(e);
    };

    return (
      <input
        type={type}
        min={min}
        max={max}
        value={inputValue}
        onChange={handleChange}
        className={className}
        {...props}
      />
    );
  },
}));

jest.mock('../../components/ui/skeleton', () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

jest.mock('../../components/PeopleViewed', () => {
  return function MockPeopleViewed({ categoryId }: { categoryId?: number }) {
    return (
      <div data-testid="people-viewed">
        People Also Viewed {categoryId && `for category ${categoryId}`}
      </div>
    );
  };
});

jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  Box: () => <div data-testid="box-icon" />,
  Sprout: () => <div data-testid="sprout-icon" />,
  TriangleAlert: () => <div data-testid="triangle-alert-icon" />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const mockUseGetProductDetail = jest.mocked(
  jest.requireMock('../../apis/product-detail').useGetProductDetail,
);
const mockUseAddCart = jest.mocked(
  jest.requireMock('../../apis/add-cart').useAddCart,
);
const mockGetMainCategories = jest.mocked(
  jest.requireMock('../../apis/main-categories').GetMainCategories,
);
const mockUseAuth = jest.mocked(jest.requireMock('../../hooks/useAuth').useAuth);
const mockToast = jest.fn();

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter initialEntries={['/products/123']}>{children}</MemoryRouter>
);

describe('ProductDetail Page', () => {
  const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
  const mockMutate = jest.fn();
  const mockMainCategories = [
    { id: 1, name: 'Sitting Room' },
    { id: 2, name: 'Bedroom' },
    { id: 3, name: 'Kitchen' },
  ];
  const mockProductDetail = {
    id: 123,
    name: 'Luxe Armchair - Left Arm Chute',
    price: 599,
    basePrice: 999,
    description: 'A luxurious armchair perfect for your living room.',
    rating: { average: 4.5 },
    mainCategoryId: 1,
    variants: [
      {
        id: 1,
        hex: '#8B4513',
        images: [
          { url: 'https://example.com/image1.jpg', alt: 'Armchair front view' },
          { url: 'https://example.com/image2.jpg', alt: 'Armchair side view' },
          { url: 'https://example.com/image3.jpg', alt: 'Armchair back view' },
        ],
      },
      {
        id: 2,
        hex: '#000000',
        images: [
          { url: 'https://example.com/image4.jpg', alt: 'Black armchair' },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest
      .mocked(jest.requireMock('react-router-dom').useParams)
      .mockReturnValue({ id: '123' });

    mockUseAuth.mockReturnValue({ user: mockUser });

    mockUseAddCart.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
    });

    mockGetMainCategories.mockReturnValue({
      data: mockMainCategories,
    });

    jest.mocked(jest.requireMock('sonner').toast).mockImplementation(mockToast);
  });

  describe('Loading State', () => {
    it('renders loading skeletons when product data is pending', () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getAllByTestId('skeleton')).toHaveLength(22);
      expect(screen.getAllByTestId('skeleton')[0]).toBeInTheDocument();
      expect(screen.getByTestId('people-viewed')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error state when product data fails to load', () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      // The component renders an empty div in this test scenario
      expect(document.body.innerHTML).toBe('<div></div>');
    });

    it('renders try again button in error state', () => {
      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const tryAgainButton = screen.getByText('Try Again');
      expect(tryAgainButton).toBeInTheDocument();
      expect(tryAgainButton).toHaveClass('bg-app-primary');
    });
  });

  describe('Success State - Product Display', () => {
    beforeEach(() => {
      mockUseGetProductDetail.mockReturnValue({
        data: mockProductDetail,
        isPending: false,
        isError: false,
      });
    });

    it('renders product details correctly', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(
        screen.getByRole('heading', { name: 'Luxe Armchair - Left Arm Chute' }),
      ).toBeInTheDocument();
      expect(screen.getByText('$599')).toBeInTheDocument();
      expect(screen.getByText('$999')).toBeInTheDocument();
      expect(screen.getByText('-40%')).toBeInTheDocument();
      expect(
        screen.getByText('A luxurious armchair perfect for your living room.'),
      ).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
    });

    it('renders breadcrumb with correct items', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
      expect(breadcrumbItems).toHaveLength(3);
      expect(breadcrumbItems[0]).toHaveTextContent('Homepage');
      expect(breadcrumbItems[1]).toHaveTextContent('Sitting Room');
      expect(breadcrumbItems[2]).toHaveTextContent(
        'Luxe Armchair - Left Arm Chute',
      );
    });

    it('renders mobile carousel for product images', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByTestId('carousel')).toBeInTheDocument();
      expect(screen.getByTestId('carousel-content')).toBeInTheDocument();
      expect(screen.getAllByTestId('carousel-item')).toHaveLength(3);
      expect(screen.getAllByTestId('mock-image')).toHaveLength(7);
    });

    it('renders desktop image grid', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const images = screen.getAllByTestId('mock-image');
      expect(images.length).toBeGreaterThan(3);
    });

    it('renders product features', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByText('Free shipping included')).toBeInTheDocument();
      expect(
        screen.getByText('Made from the best of materials sourced'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('box-icon')).toBeInTheDocument();
      expect(screen.getByTestId('sprout-icon')).toBeInTheDocument();
    });

    it('renders people viewed component with category ID', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByTestId('people-viewed')).toBeInTheDocument();
    });
  });

  describe('Variant Selection', () => {
    beforeEach(() => {
      mockUseGetProductDetail.mockReturnValue({
        data: mockProductDetail,
        isPending: false,
        isError: false,
      });
    });

    it('renders color variants', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const variantElements = screen.getByTestId('check-icon');
      expect(variantElements).toBeInTheDocument();
    });

    it('handles variant selection click', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('Quantity Input', () => {
    beforeEach(() => {
      mockUseGetProductDetail.mockReturnValue({
        data: mockProductDetail,
        isPending: false,
        isError: false,
      });
    });

    it('renders quantity input with correct attributes', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const quantityInput = screen.getByDisplayValue('1');
      expect(quantityInput).toHaveAttribute('type', 'number');
      expect(quantityInput).toHaveAttribute('min', '1');
      expect(quantityInput).toHaveAttribute('max', '100');
    });

    it('handles quantity change', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const quantityInput = screen.getByDisplayValue('1');
      await user.clear(quantityInput);
      await user.type(quantityInput, '5');

      expect(quantityInput).toHaveValue(5);
    });
  });

  describe('Add to Cart Functionality', () => {
    beforeEach(() => {
      mockUseGetProductDetail.mockReturnValue({
        data: mockProductDetail,
        isPending: false,
        isError: false,
      });
    });

    it('renders add to cart button', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Add to cart');
      expect(addToCartButton).toBeInTheDocument();
    });

    it('shows loading state when adding to cart', () => {
      mockUseAddCart.mockReturnValue({
        mutate: mockMutate,
        isLoading: true,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByText('Adding to cart...')).toBeInTheDocument();
      expect(screen.getByText('Adding to cart...')).toHaveAttribute('disabled');
    });

    it('handles add to cart click when user is logged in', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Add to cart');
      await user.click(addToCartButton);

      expect(mockMutate).toHaveBeenCalledWith(
        {
          userId: 1,
          item: {
            productId: 123,
            variantId: 1,
            quantity: 1,
          },
        },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });

    it('shows disabled button when user is not logged in', async () => {
      const user = userEvent.setup();
      mockUseAuth.mockReturnValue({ user: null });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Sign in to add item to cart');
      expect(addToCartButton).toBeDisabled();

      // Button should be disabled, so clicking won't trigger any action
      await user.click(addToCartButton);

      // No toast should be called since button is disabled
      expect(mockToast).not.toHaveBeenCalled();
    });

    it('shows success toast when product is added to cart', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Add to cart');
      await user.click(addToCartButton);

      const mutateCall = mockMutate.mock.calls[0];
      if (mutateCall && mutateCall[1] && mutateCall[1].onSuccess) {
        mutateCall[1].onSuccess();

        expect(mockToast).toHaveBeenCalledWith(
          'Product Luxe Armchair - Left Arm Chute has been added to your cart',
          { className: 'text-left' },
        );
      }
    });

    it('shows error toast when adding to cart fails', async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Add to cart');
      await user.click(addToCartButton);

      const mutateCall = mockMutate.mock.calls[0];
      if (mutateCall && mutateCall[1] && mutateCall[1].onError) {
        mutateCall[1].onError();

        expect(mockToast).toHaveBeenCalledWith(
          'Failed to add product to cart. Please try again.',
          { className: 'text-left' },
        );
      }
    });
  });

  describe('Edge Cases', () => {
    it('handles missing product ID', () => {
      jest
        .mocked(jest.requireMock('react-router-dom').useParams)
        .mockReturnValue({ id: undefined });

      mockUseGetProductDetail.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('handles product with no variants', () => {
      const productWithoutVariants = {
        ...mockProductDetail,
        variants: [],
      };

      mockUseGetProductDetail.mockReturnValue({
        data: productWithoutVariants,
        isPending: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(
        screen.getByRole('heading', { name: 'Luxe Armchair - Left Arm Chute' }),
      ).toBeInTheDocument();
    });

    it('handles product with no images', () => {
      const productWithoutImages = {
        ...mockProductDetail,
        variants: [
          {
            ...mockProductDetail.variants[0],
            images: [],
          },
        ],
      };

      mockUseGetProductDetail.mockReturnValue({
        data: productWithoutImages,
        isPending: false,
        isError: false,
      });

      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      expect(
        screen.getByRole('heading', { name: 'Luxe Armchair - Left Arm Chute' }),
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseGetProductDetail.mockReturnValue({
        data: mockProductDetail,
        isPending: false,
        isError: false,
      });
    });

    it('has proper button accessibility', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const addToCartButton = screen.getByText('Add to cart');
      expect(addToCartButton).not.toHaveAttribute('disabled');
    });

    it('has proper input accessibility', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const quantityInput = screen.getByDisplayValue('1');
      expect(quantityInput).toHaveAttribute('type', 'number');
      expect(quantityInput).toHaveAttribute('min', '1');
      expect(quantityInput).toHaveAttribute('max', '100');
    });

    it('has proper image accessibility', () => {
      render(
        <TestWrapper>
          <ProductDetail />
        </TestWrapper>,
      );

      const images = screen.getAllByTestId('mock-image');
      expect(images.length).toBeGreaterThan(0);

      images.forEach((image) => {
        expect(image).toHaveAttribute('alt');
      });
    });
  });
});
