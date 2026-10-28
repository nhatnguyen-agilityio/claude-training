import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Categories from '.';

// Mock the lazy-loaded Skeleton component
jest.mock('../ui/skeleton', () => ({
  Skeleton: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div
      {...props}
      className={`animate-pulse bg-gray-200 ${className}`}
      data-testid="skeleton"
    />
  ),
}));

jest.mock('../../apis/main-categories', () => ({
  GetMainCategories: jest.fn(() => ({
    data: undefined,
    isPending: false,
    isError: false,
    error: null,
  })),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('CategoriesComponent', () => {
  const mockGetMainCategories = jest.mocked(
    jest.requireMock('../../apis/main-categories').GetMainCategories,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders skeleton loading state', async () => {
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: true,
        isError: false,
        error: null,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <Categories />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument();
      });

      const container = document.querySelector('div[class*="mt-6"]');
      expect(container).toBeInTheDocument();
      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('Error State', () => {
    it('renders error message when API fails', () => {
      const mockError = new Error('Failed to fetch categories');
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: mockError,
      });

      render(
        <TestQueryClient>
          <Categories />
        </TestQueryClient>,
      );

      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(
        screen.getByText('Error: Failed to fetch categories'),
      ).toBeInTheDocument();
    });

    it('renders error state with correct styling', () => {
      const mockError = new Error('Network error');
      mockGetMainCategories.mockReturnValue({
        data: undefined,
        isPending: false,
        isError: true,
        error: mockError,
      });

      render(
        <TestQueryClient>
          <Categories />
        </TestQueryClient>,
      );

      const errorMessage = screen.getByText('Error: Network error');
      expect(errorMessage).toHaveClass('text-red-500');
    });
  });

  describe('Success State', () => {
    const mockCategories = [
      {
        id: 1,
        name: 'Living Room',
        image: {
          url: 'https://example.com/living-room.jpg',
          alt: 'Living Room Furniture',
        },
      },
      {
        id: 2,
        name: 'Bedroom',
        image: {
          url: 'https://example.com/bedroom.jpg',
          alt: 'Bedroom Furniture',
        },
      },
      {
        id: 3,
        name: 'Kitchen',
        image: {
          url: 'https://example.com/kitchen.jpg',
          alt: 'Kitchen Furniture',
        },
      },
      {
        id: 4,
        name: 'Office',
        image: {
          url: 'https://example.com/office.jpg',
          alt: 'Office Furniture',
        },
      },
    ];

    it('renders categories when data is loaded', async () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      await act(async () => {
        render(
          <TestQueryClient>
            <Categories />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Categories')).toBeInTheDocument();
      });

      expect(screen.getByText('Living Room')).toBeInTheDocument();
      expect(screen.getByText('Bedroom')).toBeInTheDocument();
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
      expect(screen.getByText('Office')).toBeInTheDocument();
    });

    it('renders links with correct href attributes', () => {
      mockGetMainCategories.mockReturnValue({
        data: mockCategories,
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestQueryClient>
          <Categories />
        </TestQueryClient>,
      );

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(4);

      expect(links[0]).toHaveAttribute(
        'href',
        '/products?categoryId=1&categoryTitle=Living Room',
      );
      expect(links[1]).toHaveAttribute(
        'href',
        '/products?categoryId=2&categoryTitle=Bedroom',
      );
      expect(links[2]).toHaveAttribute(
        'href',
        '/products?categoryId=3&categoryTitle=Kitchen',
      );
      expect(links[3]).toHaveAttribute(
        'href',
        '/products?categoryId=4&categoryTitle=Office',
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles empty categories array', () => {
      mockGetMainCategories.mockReturnValue({
        data: [],
        isPending: false,
        isError: false,
        error: null,
      });

      render(
        <TestQueryClient>
          <Categories />
        </TestQueryClient>,
      );

      expect(screen.getByText('Categories')).toBeInTheDocument();
      const categoryItems = document.querySelectorAll(
        'div[class*="bg-background-primary"]',
      );
      expect(categoryItems).toHaveLength(0);
    });
  });
});
