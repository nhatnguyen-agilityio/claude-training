import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import TopProducts from '.';
import userEvent from '@testing-library/user-event';

// Mock the lazy-loaded components
jest.mock('../ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      {...props}
      className={`animate-pulse bg-gray-200 ${className}`}
      data-testid="skeleton"
    />
  ),
}));

jest.mock('../ui/progress', () => ({
  Progress: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      {...props}
      className={`bg-gray-200 ${className}`}
      data-testid="progress"
    />
  ),
}));

jest.mock('../../apis/products', () => ({
  GetProductsInfinite: jest.fn(() => ({
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  })),
}));

jest.mock('../FilterDropdown', () => ({
  __esModule: true,
  default: ({
    position,
    setPosition,
  }: {
    position: string;
    setPosition: (pos: string) => void;
  }) => (
    <div data-testid="filter-dropdown">
      <button
        onClick={() => setPosition('priceLowToHigh')}
        data-testid="filter-button"
        data-slot="dropdown-menu-trigger"
      >
        Filter: {position}
      </button>
    </div>
  ),
}));

jest.mock('../common/ShowMore', () => ({
  __esModule: true,
  default: ({
    onClick,
    disabled,
  }: {
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid="show-more-button"
      data-slot="button"
    >
      Show More
    </button>
  ),
}));

jest.mock('../ProductItem', () => ({
  __esModule: true,
  default: ({
    id,
    name,
    price,
  }: {
    id: number;
    name: string;
    price: number;
  }) => (
    <div data-testid={`product-item-${id}`}>
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  ),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('TopProductsComponent', () => {
  const mockGetProductsInfinite = jest.mocked(
    jest.requireMock('../../apis/products').GetProductsInfinite,
  );

  const mockProducts = [
    {
      id: 1,
      name: 'Modern Chair',
      price: 299,
      variants: [
        {
          id: 1,
          images: [
            { url: 'https://example.com/chair1.jpg', alt: 'Modern Chair' },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Wooden Table',
      price: 599,
      variants: [
        {
          id: 2,
          images: [
            { url: 'https://example.com/table1.jpg', alt: 'Wooden Table' },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders skeleton loading state', async () => {
      mockGetProductsInfinite.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <TopProducts />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Top Products')).toBeInTheDocument();
      });

      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('renders error message when API fails', () => {
      const mockError = new Error('Failed to fetch products');
      mockGetProductsInfinite.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: mockError,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts />
        </TestQueryClient>,
      );

      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(
        screen.getByText('Error: Failed to fetch products'),
      ).toBeInTheDocument();
      expect(screen.getByText('Error: Failed to fetch products')).toHaveClass(
        'text-red-500',
      );
    });
  });

  describe('Success State', () => {
    it('renders products when data is loaded', async () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: mockProducts, total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <TopProducts />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Top Products')).toBeInTheDocument();
      });

      expect(screen.getByText('Modern Chair')).toBeInTheDocument();
      expect(screen.getByText('Wooden Table')).toBeInTheDocument();
    });

    it('renders filter dropdown and show more button', () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: mockProducts, total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts />
        </TestQueryClient>,
      );

      const filterDropdown = document.querySelector(
        '[data-slot="dropdown-menu-trigger"]',
      );
      expect(filterDropdown).toBeInTheDocument();
      const showMoreButton = document.querySelector('[data-slot="button"]');
      expect(showMoreButton).toBeInTheDocument();
    });

    it('displays correct results count', () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: mockProducts, total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts />
        </TestQueryClient>,
      );

      expect(
        screen.getByText(/Showing \d+ of 100 results/),
      ).toBeInTheDocument();
    });
  });

  describe('Props Handling', () => {
    it('passes all props to GetProductsInfinite', () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: mockProducts, total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts
            categoryId="123"
            searchProducts="chair"
            subCategoryName="Furniture"
          />
        </TestQueryClient>,
      );

      expect(mockGetProductsInfinite).toHaveBeenCalledWith(
        20,
        'mostRecent',
        '123',
        'chair',
        'Furniture',
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty products array', () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: [], total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts />
        </TestQueryClient>,
      );

      expect(
        screen.getByText(
          'No products found. Try adjusting your filters or search',
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Show more click', () => {
    it('calls fetchNextPage when show more button is clicked', async () => {
      mockGetProductsInfinite.mockReturnValue({
        data: { pages: [{ items: mockProducts, total: '100' }] },
        isPending: false,
        isError: false,
        error: null,
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      render(
        <TestQueryClient>
          <TopProducts
            categoryId="1"
            searchProducts="chair"
            subCategoryName="Furniture"
          />
        </TestQueryClient>,
      );
      const showMoreButton = screen.getByTestId('show-more-button');
      expect(showMoreButton).toBeInTheDocument();
      await userEvent.click(showMoreButton);
      expect(mockGetProductsInfinite).toHaveBeenCalledWith(
        20,
        'mostRecent',
        '1',
        'chair',
        'Furniture',
      );
    });
  });
});
