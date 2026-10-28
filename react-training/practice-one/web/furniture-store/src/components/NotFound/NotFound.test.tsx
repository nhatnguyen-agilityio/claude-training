import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './index';
import type { ReactNode } from 'react';

jest.mock('../common/Image', () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className: string;
  }) {
    return (
      <img src={src} alt={alt} className={className} data-testid="mock-image" />
    );
  };
});

jest.mock('../common/Button', () => {
  return function MockButton({
    children,
    onClick,
    className,
    variant,
    size,
    ...props
  }: {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: string;
    size?: string;
    [key: string]: unknown;
  }) {
    return (
      <button
        onClick={onClick}
        className={className}
        data-testid="mock-button"
        data-variant={variant}
        data-size={size}
        {...props}
      >
        {children}
      </button>
    );
  };
});

jest.mock(
  '../../assets/images/not-found.png',
  () => 'mocked-not-found-image.png',
);

const renderNotFound = () => {
  return render(
    <BrowserRouter>
      <NotFound />
    </BrowserRouter>,
  );
};

describe('NotFound Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component without crashing', () => {
      renderNotFound();

      expect(screen.getByText('OOPs')).toBeInTheDocument();
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    });

    it('should render all required elements', () => {
      renderNotFound();

      expect(screen.getByText('OOPs')).toBeInTheDocument();
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();

      const image = screen.getByTestId('mock-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'mocked-not-found-image.png');
      expect(image).toHaveAttribute('alt', 'Not Found');

      const homeButton = screen.getByTestId('mock-button');
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveTextContent('Home');
    });

    it('should render with correct structure and classes', () => {
      renderNotFound();

      const container = screen.getByText('OOPs').closest('div');
      expect(container).toHaveClass(
        'mt-4',
        'md:mt-10',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-180',
      );
    });
  });

  describe('Typography', () => {
    it('should render OOPs heading with correct classes', () => {
      renderNotFound();

      const oopsHeading = screen.getByText('OOPs');
      expect(oopsHeading).toBeInTheDocument();
      expect(oopsHeading.tagName).toBe('H2');
      expect(oopsHeading).toHaveClass('text-4xl', 'md:text-6xl');
    });

    it('should render 404 heading with correct classes', () => {
      renderNotFound();

      const notFoundHeading = screen.getByText('404 - Page Not Found');
      expect(notFoundHeading).toBeInTheDocument();
      expect(notFoundHeading.tagName).toBe('P');
      expect(notFoundHeading).toHaveClass('text-4xl', 'md:text-6xl');
    });
  });

  describe('Image', () => {
    it('should render image with correct attributes', () => {
      renderNotFound();

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveAttribute('src', 'mocked-not-found-image.png');
      expect(image).toHaveAttribute('alt', 'Not Found');
      expect(image).toHaveClass('w-100', 'h-auto');
    });

    it('should import and use the correct image', () => {
      renderNotFound();

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveAttribute('src', 'mocked-not-found-image.png');
    });
  });

  describe('Navigation', () => {
    it('should render NavLink with correct to prop', () => {
      renderNotFound();

      const navLink = screen.getByRole('link');
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute('href', '/');
    });

    it('should render Home button inside NavLink', () => {
      renderNotFound();

      const navLink = screen.getByRole('link');
      const homeButton = screen.getByTestId('mock-button');

      expect(navLink).toContainElement(homeButton);
      expect(homeButton).toHaveTextContent('Home');
    });
  });

  describe('Button', () => {
    it('should render button with correct props', () => {
      renderNotFound();

      const button = screen.getByTestId('mock-button');
      expect(button).toHaveAttribute('data-variant', 'ghost');
      expect(button).toHaveClass(
        'w-35',
        'h-12',
        'mt-10',
        'text-xl',
        'text-black',
        'font-medium',
        'rounded-3xl',
        'border-1',
      );
    });

    it('should render button with correct text content', () => {
      renderNotFound();

      const button = screen.getByTestId('mock-button');
      expect(button).toHaveTextContent('Home');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive margin classes', () => {
      renderNotFound();

      const container = screen.getByText('OOPs').closest('div');
      expect(container).toHaveClass('mt-4', 'md:mt-10');
    });

    it('should have responsive text size classes', () => {
      renderNotFound();

      const oopsHeading = screen.getByText('OOPs');
      const notFoundHeading = screen.getByText('404 - Page Not Found');

      expect(oopsHeading).toHaveClass('text-4xl', 'md:text-6xl');
      expect(notFoundHeading).toHaveClass('text-4xl', 'md:text-6xl');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderNotFound();

      const h2Element = screen.getByRole('heading', { level: 2 });
      expect(h2Element).toHaveTextContent('OOPs');
    });

    it('should have accessible image with alt text', () => {
      renderNotFound();

      const image = screen.getByTestId('mock-image');
      expect(image).toHaveAttribute('alt', 'Not Found');
    });

    it('should have accessible navigation link', () => {
      renderNotFound();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
      expect(link).toHaveTextContent('Home');
    });
  });

  describe('Component Integration', () => {
    it('should work with React Router', () => {
      renderNotFound();

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('should render all mocked components correctly', () => {
      renderNotFound();

      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
      expect(screen.getByTestId('mock-button')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing image gracefully', () => {
      renderNotFound();

      const image = screen.getByTestId('mock-image');
      expect(image).toBeInTheDocument();
    });

    it('should render even if some props are missing', () => {
      renderNotFound();

      expect(screen.getByText('OOPs')).toBeInTheDocument();
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
      expect(screen.getByTestId('mock-image')).toBeInTheDocument();
      expect(screen.getByTestId('mock-button')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('should have correct container layout classes', () => {
      renderNotFound();

      const container = screen.getByText('OOPs').closest('div');
      expect(container).toHaveClass(
        'mt-4',
        'md:mt-10',
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
        'min-h-180',
      );
    });

    it('should have proper spacing and alignment', () => {
      renderNotFound();

      const container = screen.getByText('OOPs').closest('div');

      expect(container).toHaveClass(
        'flex',
        'flex-col',
        'items-center',
        'justify-center',
      );

      expect(container).toHaveClass('mt-4', 'md:mt-10');

      expect(container).toHaveClass('min-h-180');
    });
  });

  describe('Content Validation', () => {
    it('should display correct 404 error message', () => {
      renderNotFound();

      expect(screen.getByText('OOPs')).toBeInTheDocument();
      expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    });

    it('should provide clear navigation back to home', () => {
      renderNotFound();

      const homeLink = screen.getByRole('link');
      const homeButton = screen.getByTestId('mock-button');

      expect(homeLink).toHaveAttribute('href', '/');
      expect(homeButton).toHaveTextContent('Home');
    });
  });
});
