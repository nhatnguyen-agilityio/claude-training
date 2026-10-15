import { render, screen, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BreadcrumbComponent from './index';
import type { ReactNode } from 'react';

// Mock the lazy-loaded breadcrumb components
jest.mock('../../ui/breadcrumb', () => ({
  Breadcrumb: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLElement>) => (
    <nav {...props} className={className} data-testid="breadcrumb">
      {children}
    </nav>
  ),
  BreadcrumbList: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol {...props} data-testid="breadcrumb-list">
      {children}
    </ol>
  ),
  BreadcrumbItem: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} data-testid="breadcrumb-item">
      {children}
    </li>
  ),
  BreadcrumbLink: ({
    children,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} href={href} data-testid="breadcrumb-link">
      {children}
    </a>
  ),
  BreadcrumbPage: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
      {...props}
      data-testid="breadcrumb-page"
      aria-current="page"
      aria-disabled="true"
    >
      {children}
    </span>
  ),
  BreadcrumbSeparator: ({
    ...props
  }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
      {...props}
      data-slot="breadcrumb-separator"
      data-testid="breadcrumb-separator"
    >
      /
    </span>
  ),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('BreadcrumbComponent', () => {
  describe('Rendering', () => {
    it('renders breadcrumb with home item', async () => {
      const items = [{ label: 'Home', href: '/', isCurrentPage: true }];

      await act(async () => {
        render(
          <TestQueryClient>
            <BreadcrumbComponent items={items} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
      });
    });

    it('renders breadcrumb with category item', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Sitting room', href: '/sitting-room', isCurrentPage: true },
      ];

      await act(async () => {
        render(
          <TestQueryClient>
            <BreadcrumbComponent items={items} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Sitting room')).toBeInTheDocument();
      });
    });

    it('renders breadcrumb with multiple items', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Product Details', href: '/products/1', isCurrentPage: true },
      ];

      await act(async () => {
        render(
          <TestQueryClient>
            <BreadcrumbComponent items={items} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Product Details')).toBeInTheDocument();
      });
    });

    it('renders separators between items', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'Category', isCurrentPage: true },
      ];

      await act(async () => {
        render(
          <TestQueryClient>
            <BreadcrumbComponent items={items} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const separators = document.querySelectorAll(
          '[data-slot="breadcrumb-separator"]',
        );
        expect(separators.length).toBe(2);
      });
    });
  });

  describe('Current Page Handling', () => {
    it('renders current page as BreadcrumbPage', async () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Sitting room', isCurrentPage: true },
      ];

      await act(async () => {
        render(
          <TestQueryClient>
            <BreadcrumbComponent items={items} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const currentPageElement = screen.getByText('Sitting room');
        expect(currentPageElement).toBeInTheDocument();
        expect(currentPageElement).toHaveAttribute('aria-disabled', 'true');
        expect(currentPageElement).toHaveAttribute('aria-current', 'page');
      });
    });
  });

  describe('Link Handling', () => {
    it('uses provided href for links', () => {
      const items = [
        { label: 'Home', href: '/home' },
        { label: 'Products', href: '/products' },
      ];

      render(
        <TestQueryClient>
          <BreadcrumbComponent items={items} />
        </TestQueryClient>,
      );

      expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
        'href',
        '/home',
      );
      expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute(
        'href',
        '/products',
      );
    });
  });

  describe('Styling and Customization', () => {
    it('applies custom className', () => {
      const items = [
        { label: 'Home', href: '/' },
        { label: 'Current', isCurrentPage: true },
      ];

      render(
        <TestQueryClient>
          <BreadcrumbComponent items={items} className="font-bold" />
        </TestQueryClient>,
      );

      const breadcrumbElement = document.querySelector('nav.font-bold');
      expect(breadcrumbElement).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty items array', () => {
      render(
        <TestQueryClient>
          <BreadcrumbComponent items={[]} />
        </TestQueryClient>,
      );

      expect(document.querySelector('nav')).toBeInTheDocument();
    });

    it('handles single item without href', () => {
      const items = [{ label: 'Single Item' }];

      render(
        <TestQueryClient>
          <BreadcrumbComponent items={items} />
        </TestQueryClient>,
      );

      expect(screen.getByText('Single Item')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Single Item' })).toHaveAttribute(
        'href',
        '/',
      );
    });

    it('handles items with empty labels', () => {
      const items = [
        { label: '', href: '/' },
        { label: 'Valid Label', href: '/valid' },
      ];

      render(
        <TestQueryClient>
          <BreadcrumbComponent items={items} />
        </TestQueryClient>,
      );

      expect(screen.getByText('Valid Label')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '' })).toBeInTheDocument();
    });
  });
});
