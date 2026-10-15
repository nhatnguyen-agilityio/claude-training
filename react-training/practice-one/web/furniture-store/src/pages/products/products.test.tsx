import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Products from './index';

jest.mock('../../apis/main-categories', () => ({
  GetMainCategories: jest.fn(),
}));

jest.mock('../../apis/sub-categories', () => ({
  GetSubCategories: jest.fn(),
}));

jest.mock('../../components/CategoryButtons', () => {
  return function MockCategoryButtons({
    buttonList,
    selectedCategory,
    onCategorySelect,
  }: {
    buttonList: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
  }) {
    return (
      <div data-testid="category-buttons">
        <h3>Category Buttons</h3>
        {buttonList.map((category, index) => (
          <button
            key={index}
            data-testid={`category-button-${category.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onCategorySelect(category)}
            className={selectedCategory === category ? 'selected' : ''}
          >
            {category}
          </button>
        ))}
      </div>
    );
  };
});

jest.mock('../../components/TopProducts', () => {
  return function MockTopProducts({
    categoryId,
    searchProducts,
    subCategoryName,
  }: {
    categoryId: string | null;
    searchProducts: string;
    subCategoryName: string;
  }) {
    return (
      <div data-testid="top-products">
        <h3>Top Products</h3>
        <div data-testid="top-products-category-id">{categoryId || 'null'}</div>
        <div data-testid="top-products-search">{searchProducts || 'empty'}</div>
        <div data-testid="top-products-sub-category">{subCategoryName}</div>
      </div>
    );
  };
});

jest.mock('../../components/PeopleViewed', () => {
  return function MockPeopleViewed({ categoryId }: { categoryId?: number }) {
    return (
      <div data-testid="people-viewed">
        <h3>People Also Viewed</h3>
        <div data-testid="people-viewed-category-id">{categoryId ?? 0}</div>
      </div>
    );
  };
});

jest.mock('../../components/SearchProduct', () => {
  return function MockSearchProduct({
    searchProductsInput,
    setSearchProductsInput,
    setSearchProducts,
  }: {
    searchProductsInput: string;
    setSearchProductsInput: (value: string) => void;
    setSearchProducts: (value: string) => void;
  }) {
    return (
      <div data-testid="search-product">
        <input
          data-testid="search-input"
          value={searchProductsInput}
          onChange={(e) => setSearchProductsInput(e.target.value)}
          placeholder="Search products..."
        />
        <button
          data-testid="search-button"
          onClick={() => setSearchProducts(searchProductsInput)}
        >
          Search
        </button>
      </div>
    );
  };
});

jest.mock('../../components/common/Breadcrumb', () => {
  return function MockBreadcrumbComponent({
    items,
  }: {
    items: Array<{ label: string; href?: string; isCurrentPage?: boolean }>;
  }) {
    return (
      <nav data-testid="breadcrumb">
        {items.map((item, index) => (
          <div key={index} data-testid="breadcrumb-item">
            {item.href ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span className={item.isCurrentPage ? 'current' : ''}>
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    );
  };
});

jest.mock('../../components/ui/skeleton', () => ({
  Skeleton: function MockSkeleton({ className }: { className: string }) {
    return <div data-testid="skeleton" className={className} />;
  },
}));

const mockGetMainCategories = jest.mocked(
  jest.requireMock('../../apis/main-categories').GetMainCategories,
);

const mockGetSubCategories = jest.mocked(
  jest.requireMock('../../apis/sub-categories').GetSubCategories,
);

const TestWrapper = ({
  children,
  initialEntries = ['/products'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) => <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;

describe('Products Component', () => {
  const mockCategories = [
    { id: 1, name: 'Living Room' },
    { id: 2, name: 'Bedroom' },
    { id: 3, name: 'Dining Room' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders products page with all components', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('All Products')).toBeInTheDocument();
      });

      expect(screen.getByTestId('search-product')).toBeInTheDocument();
      expect(screen.getByTestId('category-buttons')).toBeInTheDocument();
      expect(screen.getByTestId('top-products')).toBeInTheDocument();
      expect(screen.getByTestId('people-viewed')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('renders with category title from URL params', async () => {
      mockGetSubCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper
          initialEntries={[
            '/products?categoryTitle=Living%20Room&categoryId=1',
          ]}
        >
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
          'All Products',
        );
      });

      expect(
        screen.getByText(
          'Transform your sitting room with our elegant and functional seating options, perfect for every modern home.',
        ),
      ).toBeInTheDocument();
    });

    it('renders breadcrumb with category when categoryTitle is provided', async () => {
      mockGetSubCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper
          initialEntries={[
            '/products?categoryTitle=Living%20Room&categoryId=1',
          ]}
        >
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
        expect(breadcrumbItems).toHaveLength(2);
        expect(breadcrumbItems[0]).toHaveTextContent('Home');
        expect(breadcrumbItems[1]).toHaveTextContent('Living Room');
      });
    });

    it('renders breadcrumb without category when no categoryTitle', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const breadcrumbItems = screen.getAllByTestId('breadcrumb-item');
        expect(breadcrumbItems).toHaveLength(1);
        expect(breadcrumbItems[0]).toHaveTextContent('Home');
      });
    });
  });

  describe('Loading State', () => {
    it('renders loading skeletons when data is pending', () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      const skeletons = screen.getAllByTestId('skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
      expect(skeletons[0]).toHaveClass('h-8 w-48 mb-4');
      expect(skeletons[1]).toHaveClass('h-8 w-100');
      expect(skeletons[2]).toHaveClass('h-14 w-full rounded-3xl');
    });

    it('renders correct number of category button skeletons', () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      const categorySkeletons = screen
        .getAllByTestId('skeleton')
        .filter((skeleton) =>
          skeleton.className.includes('h-12 w-24 rounded-2xl'),
        );
      expect(categorySkeletons).toHaveLength(8);
    });
  });

  describe('Error State', () => {
    it('renders error message when API fails', () => {
      const errorMessage = 'Failed to fetch categories';
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: errorMessage },
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      expect(screen.getByText('Categories Buttons')).toBeInTheDocument();
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      expect(screen.getByText(`Error: ${errorMessage}`)).toHaveClass(
        'text-red-500',
      );
    });

    it('renders error state with proper styling', () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: { message: 'Network error' },
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      const errorElement = screen.getByText('Error: Network error');
      expect(errorElement).toHaveClass('text-red-500');
    });
  });

  describe('Category Selection', () => {
    it('renders category buttons with All as default selected', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const allButton = screen.getByTestId('category-button-all');
        expect(allButton).toHaveClass('selected');
      });

      expect(
        screen.getByTestId('category-button-living-room'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('category-button-bedroom')).toBeInTheDocument();
      expect(
        screen.getByTestId('category-button-dining-room'),
      ).toBeInTheDocument();
    });

    it('handles category selection for main categories', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const livingRoomButton = screen.getByTestId(
          'category-button-living-room',
        );
        expect(livingRoomButton).toBeInTheDocument();
      });

      const livingRoomButton = screen.getByTestId(
        'category-button-living-room',
      );
      await userEvent.click(livingRoomButton);

      await waitFor(() => {
        expect(livingRoomButton).toHaveClass('selected');
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('top-products-category-id'),
        ).toHaveTextContent('1');
      });
    });

    it('handles category selection for sub categories', async () => {
      mockGetSubCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper initialEntries={['/products?categoryId=1']}>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const bedroomButton = screen.getByTestId('category-button-bedroom');
        expect(bedroomButton).toBeInTheDocument();
      });

      const bedroomButton = screen.getByTestId('category-button-bedroom');
      await userEvent.click(bedroomButton);

      await waitFor(() => {
        expect(bedroomButton).toHaveClass('selected');
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('top-products-sub-category'),
        ).toHaveTextContent('2');
      });
    });

    it('resets to All category when All is selected', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const allButton = screen.getByTestId('category-button-all');
        expect(allButton).toBeInTheDocument();
      });

      const allButton = screen.getByTestId('category-button-all');
      await userEvent.click(allButton);

      await waitFor(() => {
        expect(allButton).toHaveClass('selected');
      });

      await waitFor(() => {
        expect(
          screen.getByTestId('top-products-category-id'),
        ).toHaveTextContent('null');
      });
    });
  });

  describe('Search Functionality', () => {
    it('renders search input with empty initial value', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toHaveValue('');
        expect(searchInput).toHaveAttribute(
          'placeholder',
          'Search products...',
        );
      });
    });

    it('updates search input value when typing', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'chair');

      expect(searchInput).toHaveValue('chair');
    });

    it('triggers search when search button is clicked', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'table');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'table',
        );
      });
    });

    it('passes search term to TopProducts component', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'sofa');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'sofa',
        );
      });
    });
  });

  describe('API Integration', () => {
    it('calls GetMainCategories when no categoryId in URL', () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      expect(mockGetMainCategories).toHaveBeenCalledWith(true);
    });

    it('calls GetSubCategories when categoryId is in URL', () => {
      mockGetSubCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper initialEntries={['/products?categoryId=1']}>
          <Products />
        </TestWrapper>,
      );

      expect(mockGetSubCategories).toHaveBeenCalledWith('1', true);
    });

    it('handles API data transformation correctly', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId('category-button-all')).toBeInTheDocument();
        expect(
          screen.getByTestId('category-button-living-room'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('category-button-bedroom'),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId('category-button-dining-room'),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Component Props Integration', () => {
    it('passes correct props to TopProducts component', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('top-products-category-id'),
        ).toHaveTextContent('null');
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'empty',
        );
        expect(
          screen.getByTestId('top-products-sub-category'),
        ).toHaveTextContent('All');
      });
    });

    it('passes correct props to PeopleViewed component', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('people-viewed-category-id'),
        ).toHaveTextContent('0');
      });
    });

    it('updates PeopleViewed categoryId when main category is selected', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const livingRoomButton = screen.getByTestId(
          'category-button-living-room',
        );
        expect(livingRoomButton).toBeInTheDocument();
      });

      const livingRoomButton = screen.getByTestId(
        'category-button-living-room',
      );
      await user.click(livingRoomButton);

      await waitFor(() => {
        expect(
          screen.getByTestId('people-viewed-category-id'),
        ).toHaveTextContent('1');
      });
    });
  });

  describe('URL Parameter Handling', () => {
    it('sets mainCategoryId from URL categoryId parameter', async () => {
      mockGetSubCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper initialEntries={['/products?categoryId=5']}>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId('people-viewed-category-id'),
        ).toHaveTextContent('5');
      });
    });

    it('handles missing URL parameters gracefully', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper initialEntries={['/products']}>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByText('All Products')).toBeInTheDocument();
        expect(
          screen.getByTestId('people-viewed-category-id'),
        ).toHaveTextContent('0');
      });
    });
  });

  describe('State Management', () => {
    it('maintains separate state for search input and search term', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');

      await user.type(searchInput, 'test search');
      expect(searchInput).toHaveValue('test search');

      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'test search',
        );
      });
    });

    it('resets search when category changes', async () => {
      const user = userEvent.setup();
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        expect(searchInput).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      const searchButton = screen.getByTestId('search-button');
      await user.type(searchInput, 'chair');
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'chair',
        );
      });

      const livingRoomButton = screen.getByTestId(
        'category-button-living-room',
      );
      await user.click(livingRoomButton);

      await waitFor(() => {
        expect(screen.getByTestId('top-products-search')).toHaveTextContent(
          'chair',
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { level: 2 });
        expect(mainHeading).toHaveTextContent('All Products');
      });
    });

    it('has accessible search functionality', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const searchInput = screen.getByTestId('search-input');
        const searchButton = screen.getByTestId('search-button');

        expect(searchInput).toHaveAttribute(
          'placeholder',
          'Search products...',
        );
        expect(searchButton).toHaveTextContent('Search');
      });
    });

    it('has accessible category buttons', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const categoryButtons = screen.getAllByRole('button');
        expect(categoryButtons.length).toBeGreaterThan(0);

        const allButton = screen.getByTestId('category-button-all');
        expect(allButton).toHaveClass('selected');
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty categories data', async () => {
      mockGetMainCategories.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const allButton = screen.getByTestId('category-button-all');
        expect(allButton).toBeInTheDocument();
        expect(allButton).toHaveClass('selected');
      });

      expect(
        screen.queryByTestId('category-button-living-room'),
      ).not.toBeInTheDocument();
    });

    it('handles undefined categories data', async () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      await waitFor(() => {
        const allButton = screen.getByTestId('category-button-all');
        expect(allButton).toBeInTheDocument();
        expect(allButton).toHaveClass('selected');
      });

      expect(
        screen.queryByTestId('category-button-living-room'),
      ).not.toBeInTheDocument();
    });

    it('handles component unmounting during API call', () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      const { unmount } = render(
        <TestWrapper>
          <Products />
        </TestWrapper>,
      );

      expect(screen.getAllByTestId('skeleton')).toHaveLength(55);

      unmount();

      expect(() => unmount()).not.toThrow();
    });
  });
});
