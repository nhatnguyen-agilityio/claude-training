import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ScrollToTop from '.';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: mockScrollTo,
});

const TestWrapper = ({
  children,
  initialEntries,
}: {
  children: ReactNode;
  initialEntries?: string[];
}) => <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;

describe('ScrollToTop Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('returns null and does not render any DOM elements', () => {
      const { container } = render(
        <TestWrapper>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Scroll Behavior', () => {
    it('scrolls to top when component mounts', () => {
      render(
        <TestWrapper initialEntries={['/home']}>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });

    it('scrolls to top when pathname changes - separate renders', () => {
      const { unmount } = render(
        <TestWrapper initialEntries={['/home']}>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);

      unmount();

      render(
        <TestWrapper initialEntries={['/products']}>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty pathname', () => {
      render(
        <TestWrapper initialEntries={['']}>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });

    it('handles routes with query parameters', () => {
      render(
        <TestWrapper initialEntries={['/products?categoryId=1&page=2']}>
          <ScrollToTop />
        </TestWrapper>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Integration with React Router', () => {
    it('works correctly with BrowserRouter', () => {
      render(
        <BrowserRouter>
          <ScrollToTop />
        </BrowserRouter>,
      );

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
      expect(mockScrollTo).toHaveBeenCalledTimes(1);
    });
  });
});
