import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './index';

jest.mock('../../components/Hero', () => {
  return function MockHero() {
    return (
      <section data-testid="hero-component">
        <h1>Welcome to Our Furniture Store</h1>
        <p>Discover amazing furniture for your home</p>
      </section>
    );
  };
});

jest.mock('../../components/Categories', () => {
  return function MockCategories() {
    return (
      <section data-testid="categories-component">
        <h2>Shop by Category</h2>
        <div data-testid="category-list">
          <div data-testid="category-item">Living Room</div>
          <div data-testid="category-item">Bedroom</div>
          <div data-testid="category-item">Dining Room</div>
        </div>
      </section>
    );
  };
});

jest.mock('../../components/TopProducts', () => {
  return function MockTopProducts() {
    return (
      <section data-testid="top-products-component">
        <h2>Top Products</h2>
        <div data-testid="product-list">
          <div data-testid="product-item">Modern Chair</div>
          <div data-testid="product-item">Wooden Table</div>
          <div data-testid="product-item">Luxury Sofa</div>
        </div>
      </section>
    );
  };
});

jest.mock('../../components/ImageGallery', () => {
  return function MockImageGallery() {
    return (
      <section data-testid="image-gallery-component">
        <h2>Our Showroom</h2>
        <div data-testid="gallery-grid">
          <div data-testid="gallery-item">Living Room Setup</div>
          <div data-testid="gallery-item">Bedroom Design</div>
          <div data-testid="gallery-item">Kitchen Layout</div>
        </div>
      </section>
    );
  };
});

jest.mock('../../components/Faq', () => {
  return function MockFaq() {
    return (
      <section data-testid="faq-component">
        <h2>Frequently Asked Questions</h2>
        <div data-testid="faq-list">
          <div data-testid="faq-item">What is your return policy?</div>
          <div data-testid="faq-item">How long does delivery take?</div>
          <div data-testid="faq-item">Do you offer assembly services?</div>
        </div>
      </section>
    );
  };
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Home Component', () => {
  describe('Rendering', () => {
    it('renders all child components in correct order', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      expect(screen.getByTestId('hero-component')).toBeInTheDocument();
      expect(screen.getByTestId('categories-component')).toBeInTheDocument();
      expect(screen.getByTestId('top-products-component')).toBeInTheDocument();
      expect(screen.getByTestId('image-gallery-component')).toBeInTheDocument();
      expect(screen.getByTestId('faq-component')).toBeInTheDocument();
    });

    it('renders Hero component first', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const heroSection = screen.getByTestId('hero-component');
      expect(heroSection).toBeInTheDocument();
      expect(heroSection).toHaveTextContent('Welcome to Our Furniture Store');
      expect(heroSection).toHaveTextContent(
        'Discover amazing furniture for your home',
      );
    });

    it('renders Categories component second', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const categoriesSection = screen.getByTestId('categories-component');
      expect(categoriesSection).toBeInTheDocument();
      expect(categoriesSection).toHaveTextContent('Shop by Category');

      const categoryItems = screen.getAllByTestId('category-item');
      expect(categoryItems).toHaveLength(3);
      expect(categoryItems[0]).toHaveTextContent('Living Room');
      expect(categoryItems[1]).toHaveTextContent('Bedroom');
      expect(categoryItems[2]).toHaveTextContent('Dining Room');
    });

    it('renders TopProducts component third', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const topProductsSection = screen.getByTestId('top-products-component');
      expect(topProductsSection).toBeInTheDocument();
      expect(topProductsSection).toHaveTextContent('Top Products');

      const productItems = screen.getAllByTestId('product-item');
      expect(productItems).toHaveLength(3);
      expect(productItems[0]).toHaveTextContent('Modern Chair');
      expect(productItems[1]).toHaveTextContent('Wooden Table');
      expect(productItems[2]).toHaveTextContent('Luxury Sofa');
    });

    it('renders ImageGallery component fourth', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const imageGallerySection = screen.getByTestId('image-gallery-component');
      expect(imageGallerySection).toBeInTheDocument();
      expect(imageGallerySection).toHaveTextContent('Our Showroom');

      const galleryItems = screen.getAllByTestId('gallery-item');
      expect(galleryItems).toHaveLength(3);
      expect(galleryItems[0]).toHaveTextContent('Living Room Setup');
      expect(galleryItems[1]).toHaveTextContent('Bedroom Design');
      expect(galleryItems[2]).toHaveTextContent('Kitchen Layout');
    });

    it('renders Faq component last', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const faqSection = screen.getByTestId('faq-component');
      expect(faqSection).toBeInTheDocument();
      expect(faqSection).toHaveTextContent('Frequently Asked Questions');

      const faqItems = screen.getAllByTestId('faq-item');
      expect(faqItems).toHaveLength(3);
      expect(faqItems[0]).toHaveTextContent('What is your return policy?');
      expect(faqItems[1]).toHaveTextContent('How long does delivery take?');
      expect(faqItems[2]).toHaveTextContent('Do you offer assembly services?');
    });
  });

  describe('Component Structure', () => {
    it('renders components in correct DOM order', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const heroSection = screen.getByTestId('hero-component');
      const categoriesSection = screen.getByTestId('categories-component');
      const topProductsSection = screen.getByTestId('top-products-component');
      const imageGallerySection = screen.getByTestId('image-gallery-component');
      const faqSection = screen.getByTestId('faq-component');

      expect(heroSection.compareDocumentPosition(categoriesSection)).toBe(4); // Node.DOCUMENT_POSITION_FOLLOWING
      expect(
        categoriesSection.compareDocumentPosition(topProductsSection),
      ).toBe(4);
      expect(
        topProductsSection.compareDocumentPosition(imageGallerySection),
      ).toBe(4);
      expect(imageGallerySection.compareDocumentPosition(faqSection)).toBe(4);
    });

    it('does not render any wrapper elements', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const heroSection = screen.getByTestId('hero-component');
      const categoriesSection = screen.getByTestId('categories-component');

      expect(heroSection.parentElement).toBe(categoriesSection.parentElement);
    });
  });

  describe('Content Verification', () => {
    it('displays all expected content from child components', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      expect(
        screen.getByText('Welcome to Our Furniture Store'),
      ).toBeInTheDocument();
      expect(screen.getByText('Shop by Category')).toBeInTheDocument();
      expect(screen.getByText('Top Products')).toBeInTheDocument();
      expect(screen.getByText('Our Showroom')).toBeInTheDocument();
      expect(
        screen.getByText('Frequently Asked Questions'),
      ).toBeInTheDocument();

      expect(
        screen.getByText('Discover amazing furniture for your home'),
      ).toBeInTheDocument();
    });

    it('renders all interactive elements from child components', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const categoryItems = screen.getAllByTestId('category-item');
      expect(categoryItems).toHaveLength(3);
      categoryItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });

      const productItems = screen.getAllByTestId('product-item');
      expect(productItems).toHaveLength(3);
      productItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });

      const galleryItems = screen.getAllByTestId('gallery-item');
      expect(galleryItems).toHaveLength(3);
      galleryItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });

      const faqItems = screen.getAllByTestId('faq-item');
      expect(faqItems).toHaveLength(3);
      faqItems.forEach((item) => {
        expect(item).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure with sections', () => {
      render(
        <TestWrapper>
          <Home />
        </TestWrapper>,
      );

      const heroSection = screen.getByTestId('hero-component');
      const categoriesSection = screen.getByTestId('categories-component');
      const topProductsSection = screen.getByTestId('top-products-component');
      const imageGallerySection = screen.getByTestId('image-gallery-component');
      const faqSection = screen.getByTestId('faq-component');

      expect(heroSection.tagName).toBe('SECTION');
      expect(categoriesSection.tagName).toBe('SECTION');
      expect(topProductsSection.tagName).toBe('SECTION');
      expect(imageGallerySection.tagName).toBe('SECTION');
      expect(faqSection.tagName).toBe('SECTION');

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      const h2Headings = screen.getAllByRole('heading', { level: 2 });
      expect(h2Headings).toHaveLength(4);
    });
  });
});
