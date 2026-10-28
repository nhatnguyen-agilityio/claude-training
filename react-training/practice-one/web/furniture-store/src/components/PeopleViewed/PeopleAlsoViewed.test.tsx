import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import PeopleAlsoViewed from '.';

jest.mock('../../apis/products', () => ({
  GetProducts: jest.fn(),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../ProductItem', () => {
  return function MockProductItem({
    name,
    price,
  }: {
    name: string;
    price: number;
  }) {
    return (
      <div data-testid="product-item">
        <div>{name}</div>
        <div>{price}</div>
      </div>
    );
  };
});

const mockGetProducts = jest.mocked(
  jest.requireMock('../../apis/products').GetProducts,
);

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('PeopleAlsoViewedComponent', () => {
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
  describe('Rendering', () => {
    it('renders PeopleAlsoViewed component with correct title', async () => {
      mockGetProducts.mockReturnValue({
        data: { items: mockProducts, total: '100' },
        isPending: false,
        isError: false,
      });
      await act(async () => {
        render(
          <TestQueryClient>
            <PeopleAlsoViewed />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('People Also Viewed')).toBeInTheDocument();
      });
    });

    it('renders product items when data is available', async () => {
      mockGetProducts.mockReturnValue({
        data: { items: mockProducts, total: '100' },
        isPending: false,
        isError: false,
      });
      await act(async () => {
        render(
          <TestQueryClient>
            <PeopleAlsoViewed />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const productItems = screen.getAllByTestId('product-item');
        expect(productItems).toHaveLength(2);
        expect(screen.getByText('Modern Chair')).toBeInTheDocument();
        expect(screen.getByText('Wooden Table')).toBeInTheDocument();
        expect(screen.getByText('299')).toBeInTheDocument();
        expect(screen.getByText('599')).toBeInTheDocument();
      });
    });

    it('renders PeopleAlsoViewed component with category id', async () => {
      mockGetProducts.mockReturnValue({
        data: { items: mockProducts, total: '100' },
        isPending: false,
        isError: false,
      });
      await act(async () => {
        render(
          <TestQueryClient>
            <PeopleAlsoViewed categoryId={1} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const productItems = screen.getAllByTestId('product-item');
        expect(productItems).toHaveLength(2);
        expect(screen.getByText('Modern Chair')).toBeInTheDocument();
        expect(screen.getByText('Wooden Table')).toBeInTheDocument();
      });
    });
  });
  describe('Loading State', () => {
    it('renders loading skeletons when data is pending', async () => {
      mockGetProducts.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
      });
      await act(async () => {
        render(
          <TestQueryClient>
            <PeopleAlsoViewed />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
        expect(skeletons.length).toBeGreaterThan(0);
        expect(skeletons.length).toBe(24);
      });
    });
  });

  describe('Error State', () => {
    it('renders error message when data fails to load', () => {
      mockGetProducts.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
      });
      render(
        <TestQueryClient>
          <PeopleAlsoViewed />
        </TestQueryClient>,
      );

      expect(screen.getByText('People Also Viewed')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load recommended products'),
      ).toBeInTheDocument();

      const errorIcon = document.querySelector('.lucide-triangle-alert');
      expect(errorIcon).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('renders navigation buttons when data is available', () => {
      mockGetProducts.mockReturnValue({
        data: { items: mockProducts, total: '100' },
        isPending: false,
        isError: false,
      });
      render(
        <TestQueryClient>
          <PeopleAlsoViewed />
        </TestQueryClient>,
      );

      const carouselPrevious = document.querySelector(
        '[data-slot="carousel-previous"]',
      );
      const carouselNext = document.querySelector(
        '[data-slot="carousel-next"]',
      );

      expect(carouselPrevious).toBeInTheDocument();
      expect(carouselNext).toBeInTheDocument();
    });
  });
});
