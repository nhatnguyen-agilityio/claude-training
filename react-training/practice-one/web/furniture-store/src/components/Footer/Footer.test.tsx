import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Footer from '.';

jest.mock('../common/Image', () => {
  return function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    return <img src={src} alt={alt} data-testid="footer-logo" {...props} />;
  };
});

jest.mock('./InfomationItem', () => {
  return function MockInformationItem({
    title,
    information,
    className,
  }: {
    title: string;
    information: string;
    className: string;
  }) {
    return (
      <div
        data-testid={`info-item-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <h3>{title}</h3>
        <p className={className}>{information}</p>
      </div>
    );
  };
});

Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FooterComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the footer container', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const footer = document.querySelector(
          'div[class*="mt-10 w-full h-200 lg:h-100 bg-tertiary-black"]',
        );
        expect(footer).toBeInTheDocument();
      });
    });

    it('renders the logo image', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      const logo = screen.getByTestId('footer-logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute(
        'src',
        'https://ucarecdn.com/15cd9ab3-c422-4a15-8dfe-4dae05794b87/-/format/auto/',
      );
      expect(logo).toHaveAttribute('alt', 'logo');
    });

    it('renders navigation links', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Sale')).toBeInTheDocument();
      expect(screen.getByText('About Us')).toBeInTheDocument();
    });

    it('renders all information items', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      expect(screen.getByTestId('info-item-contact-us')).toBeInTheDocument();
      expect(screen.getByTestId('info-item-email')).toBeInTheDocument();
      expect(screen.getByTestId('info-item-address')).toBeInTheDocument();
      expect(screen.getByTestId('info-item-opening-hours')).toBeInTheDocument();
    });

    it('renders scroll to top button', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      const scrollButton = screen.getByRole('button');
      expect(scrollButton).toBeInTheDocument();
    });

    it('renders copyright text', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      expect(screen.getByText('© 2025 — Copyright')).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('renders footer container with correct classes', () => {
      render(
        <TestQueryClient>
          <Footer />
        </TestQueryClient>,
      );

      const footer = document.querySelector(
        'div[class*="mt-10 w-full h-200 lg:h-100 bg-tertiary-black"]',
      );
      expect(footer).toHaveClass('mt-10');
      expect(footer).toHaveClass('w-full');
      expect(footer).toHaveClass('h-200');
      expect(footer).toHaveClass('lg:h-100');
      expect(footer).toHaveClass('bg-tertiary-black');
    });

    describe('Navigation Links', () => {
      it('renders all navigation links with correct href', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const homeLink = screen.getByText('Home').closest('a');
        const blogLink = screen.getByText('Blog').closest('a');
        const saleLink = screen.getByText('Sale').closest('a');
        const aboutLink = screen.getByText('About Us').closest('a');

        expect(homeLink).toHaveAttribute('href', '#');
        expect(blogLink).toHaveAttribute('href', '#');
        expect(saleLink).toHaveAttribute('href', '#');
        expect(aboutLink).toHaveAttribute('href', '#');
      });

      it('renders navigation links with hover effects', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const homeLink = screen.getByText('Home').closest('a');
        const blogLink = screen.getByText('Blog').closest('a');
        const saleLink = screen.getByText('Sale').closest('a');
        const aboutLink = screen.getByText('About Us').closest('a');

        expect(homeLink).toHaveClass('hover:underline');
        expect(blogLink).toHaveClass('hover:underline');
        expect(saleLink).toHaveClass('hover:underline');
        expect(aboutLink).toHaveClass('hover:underline');
      });

      it('renders navigation list items with separators', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const listItems = document.querySelectorAll('ul li');
        expect(listItems).toHaveLength(4);

        listItems.forEach((item) => {
          expect(item).toHaveClass("after:content-['/']");
          expect(item).toHaveClass('after:mx-3');
          expect(item).toHaveClass('after:font-light');
        });
      });
    });

    describe('Information Items', () => {
      it('renders contact information with correct data', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const contactItem = screen.getByTestId('info-item-contact-us');
        expect(contactItem).toBeInTheDocument();
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByText('+1 999 888-76-54')).toBeInTheDocument();
      });

      it('renders email information with correct data', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const emailItem = screen.getByTestId('info-item-email');
        expect(emailItem).toBeInTheDocument();
        expect(screen.getByText('Email')).toBeInTheDocument();
        expect(screen.getByText('hello@logoipsum.com')).toBeInTheDocument();
      });

      it('renders address information with correct data', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const addressItem = screen.getByTestId('info-item-address');
        expect(addressItem).toBeInTheDocument();
        expect(screen.getByText('ADDRESS')).toBeInTheDocument();
        expect(
          screen.getByText('2118 Thornridge Cir. Syracuse, Connecticut 35624'),
        ).toBeInTheDocument();
      });

      it('renders opening hours information with correct data', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const hoursItem = screen.getByTestId('info-item-opening-hours');
        expect(hoursItem).toBeInTheDocument();
        expect(screen.getByText('OPENING HOURS')).toBeInTheDocument();
        expect(screen.getByText('9am—6pm')).toBeInTheDocument();
      });
    });

    describe('Scroll to Top Functionality', () => {
      it('renders scroll button with ArrowUp icon', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const scrollButton = screen.getByRole('button');
        expect(scrollButton).toBeInTheDocument();

        const icon = scrollButton.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });

      it('calls window.scrollTo when scroll button is clicked', async () => {
        const user = userEvent.setup();
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const scrollButton = screen.getByRole('button');
        await user.click(scrollButton);

        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });

    describe('Accessibility', () => {
      it('has proper alt text for logo image', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const logo = screen.getByTestId('footer-logo');
        expect(logo).toHaveAttribute('alt', 'logo');
      });

      it('has proper link structure for navigation', () => {
        render(
          <TestQueryClient>
            <Footer />
          </TestQueryClient>,
        );

        const navLinks = screen.getAllByRole('link');
        expect(navLinks).toHaveLength(4);

        navLinks.forEach((link) => {
          expect(link).toHaveAttribute('href', '#');
        });
      });
    });
  });
});
