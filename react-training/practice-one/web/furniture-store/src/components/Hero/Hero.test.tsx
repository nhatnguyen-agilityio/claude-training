import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Hero from '.';

jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children: ReactNode }) => (
    <div data-testid="helmet">{children}</div>
  ),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HeroComponent', () => {
  describe('Rendering', () => {
    it('renders main heading with correct text', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(
        'Discover the Artistry of Modern Contemporary Furniture',
      );
    });

    it('renders store name heading', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const storeHeading = screen.getByRole('heading', { level: 2 });
      expect(storeHeading).toBeInTheDocument();
      expect(storeHeading).toHaveTextContent('FURNITURE STORE');
    });

    it('renders description paragraph', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const description = screen.getByText(
        'Experience the elegance and functionality of cutting-edge design where luxury meets innovation in every piece for ultimate relaxation',
      );
      expect(description).toBeInTheDocument();
    });

    it('renders hero image with picture element', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const picture = document.querySelector('picture');
      expect(picture).toBeInTheDocument();

      const img = screen.getByAltText(
        'Modern contemporary furniture showcasing elegant living room furniture',
      );
      expect(img).toBeInTheDocument();
    });

    it('renders Helmet component for preloading', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      // Helmet component was removed for LCP optimization, so we test the actual content instead
      expect(screen.getByText('FURNITURE STORE')).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('applies correct classes to store heading', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const storeHeading = screen.getByRole('heading', { level: 2 });
      expect(storeHeading).toHaveClass('text-sm');
      expect(storeHeading).toHaveClass('mb-4');
      expect(storeHeading).toHaveClass('md:mb-6');
      expect(storeHeading).toHaveClass('md:text-lg');
    });

    it('applies correct classes to main heading', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveClass('px-6');
      expect(mainHeading).toHaveClass('text-2xl');
      expect(mainHeading).toHaveClass('mb-4');
      expect(mainHeading).toHaveClass('font-semibold');
      expect(mainHeading).toHaveClass('md:mb-6');
      expect(mainHeading).toHaveClass('md:text-5xl');
      expect(mainHeading).toHaveClass('md:font-bold');
      expect(mainHeading).toHaveClass('lg:text-6xl');
    });

    it('applies correct classes to description', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const description = screen.getByText(
        'Experience the elegance and functionality of cutting-edge design where luxury meets innovation in every piece for ultimate relaxation',
      );
      expect(description).toHaveClass('text-base');
      expect(description).toHaveClass('text-center');
      expect(description).toHaveClass('md:text-xl');
    });

    it('applies correct classes to image container', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const imageContainer = document.querySelector('div[class*="h-59"]');
      expect(imageContainer).toHaveClass('w-full');
      expect(imageContainer).toHaveClass('h-59');
      expect(imageContainer).toHaveClass('bg-gray-50');
      expect(imageContainer).toHaveClass('md:h-100');
      expect(imageContainer).toHaveClass('lg:h-106');
      expect(imageContainer).toHaveClass('relative');
    });

    it('applies correct classes to hero image', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const img = screen.getByAltText(
        'Modern contemporary furniture showcasing elegant living room furniture',
      );
      expect(img).toHaveClass('w-full');
      expect(img).toHaveClass('h-full');
      expect(img).toHaveClass('object-cover');
    });

    it('applies correct classes to main section', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const section = document.querySelector('section');
      expect(section).toHaveClass('mt-12');
      expect(section).toHaveClass('container');
    });
  });

  describe('Image Sources and Attributes', () => {
    it('renders picture element with correct source elements', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const picture = document.querySelector('picture');
      expect(picture).toBeInTheDocument();

      const sources = document.querySelectorAll('source');
      expect(sources).toHaveLength(2);

      // Check desktop source
      const desktopSource = sources[0];
      expect(desktopSource).toHaveAttribute('media', '(min-width: 1024px)');
      expect(desktopSource.getAttribute('srcSet')).toContain(
        'https://ucarecdn.com/d474fba4-43b2-42d5-ace1-a804990777c5/-/resize/1280x/-/format/auto/-/quality/smart/',
      );

      // Check tablet source
      const tabletSource = sources[1];
      expect(tabletSource).toHaveAttribute('media', '(min-width: 640px)');
      expect(tabletSource.getAttribute('srcSet')).toContain(
        'https://ucarecdn.com/6b6ab92c-287c-449a-8663-28380c902884/-/resize/1024x/-/format/auto/-/quality/smart/',
      );
    });

    it('renders img element with correct attributes', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const img = screen.getByAltText(
        'Modern contemporary furniture showcasing elegant living room furniture',
      );
      expect(img.getAttribute('src')).toContain(
        'https://ucarecdn.com/658288ac-40ec-43dd-893a-3c62c979259c/-/resize/640x/-/format/auto/-/quality/smart/',
      );
      expect(img).toHaveAttribute(
        'alt',
        'Modern contemporary furniture showcasing elegant living room furniture',
      );
      expect(img).toHaveAttribute('fetchPriority', 'high');
      expect(img).toHaveAttribute('loading', 'eager');
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });

  describe('Content Structure', () => {
    it('renders content wrapper with correct classes', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      const contentWrapper = document.querySelector('div[class*="lg:px-0"]');
      expect(contentWrapper).toBeInTheDocument();
      expect(contentWrapper).toHaveClass('lg:px-0');
      expect(contentWrapper).toHaveClass('mb-8');
    });

    it('renders all required headings and text elements', () => {
      render(
        <TestQueryClient>
          <Hero />
        </TestQueryClient>,
      );

      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();

      expect(
        screen.getByText(/Experience the elegance and functionality/),
      ).toBeInTheDocument();

      expect(
        screen.getByAltText(
          'Modern contemporary furniture showcasing elegant living room furniture',
        ),
      ).toBeInTheDocument();
    });
  });
});
