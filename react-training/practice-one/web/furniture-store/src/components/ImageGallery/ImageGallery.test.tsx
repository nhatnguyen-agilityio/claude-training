import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ImageGallery from '.';

// Mock the lazy-loaded components
jest.mock('../ui/card', () => ({
  Card: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props} className={className} data-testid="gallery-card">
      {children}
    </div>
  ),
}));

jest.mock('../ui/progress', () => ({
  Progress: ({ value, className }: { value: number; className: string }) => (
    <div className={className} data-testid="progress-bar" data-value={value}>
      Progress: {value}%
    </div>
  ),
}));

// Mock the toast function
jest.mock('sonner', () => ({
  toast: jest.fn(),
}));

jest.mock('../common/Image', () => ({
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
      data-testid="gallery-image"
    />
  ),
}));

jest.mock('../CategoryButtons', () => ({
  __esModule: true,
  default: ({
    buttonList,
    selectedCategory,
    onCategorySelect,
  }: {
    buttonList: string[];
    selectedCategory: string;
    onCategorySelect: (category: string) => void;
  }) => (
    <div data-testid="category-buttons">
      {buttonList.map((category) => (
        <button
          key={category}
          onClick={() => onCategorySelect(category)}
          data-testid={`category-button-${category}`}
          className={selectedCategory === category ? 'selected' : 'unselected'}
        >
          {category}
        </button>
      ))}
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
      className={disabled ? 'disabled' : 'enabled'}
    >
      Show More
    </button>
  ),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ImageGalleryComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the main heading', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <ImageGallery />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByText('Design inspiration and modern home ideas'),
        ).toBeInTheDocument();
      });
    });

    it('renders all category buttons with correct labels', () => {
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      const expectedCategories = [
        'All',
        'Bedroom',
        'Living Room',
        'Kitchen',
        'Workspace',
        'Outdoor',
        'Bathroom',
        'Home office',
        'Dinning room',
      ];

      expectedCategories.forEach((category) => {
        expect(
          screen.getByTestId(`category-button-${category}`),
        ).toBeInTheDocument();
      });
    });

    it('renders progress section', () => {
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      expect(screen.getByText('Showing 9 of 100 results')).toBeInTheDocument();
    });

    it('renders show more button', () => {
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      expect(screen.getByTestId('show-more-button')).toBeInTheDocument();
    });
  });

  describe('Interactive Elements', () => {
    it('shows "All" as selected category by default', () => {
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      const allButton = screen.getByTestId('category-button-All');
      expect(allButton).toHaveClass('selected');
    });

    it('handles category selection', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      const kitchenButton = screen.getByTestId('category-button-Kitchen');
      await user.click(kitchenButton);

      expect(kitchenButton).toHaveClass('selected');

      const allButton = screen.getByTestId('category-button-All');
      expect(allButton).toHaveClass('unselected');
    });

    it('handles show more button click', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      const showMoreButton = screen.getByTestId('show-more-button');
      expect(showMoreButton).toHaveClass('enabled');
      expect(showMoreButton).not.toHaveAttribute('disabled');

      await user.click(showMoreButton);
      expect(showMoreButton).toHaveClass('enabled');
    });
  });

  describe('Data Display', () => {
    it('displays correct results count', () => {
      render(
        <TestQueryClient>
          <ImageGallery />
        </TestQueryClient>,
      );

      expect(screen.getByText('Showing 9 of 100 results')).toBeInTheDocument();
    });
  });
});
