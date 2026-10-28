import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '.';
import { fireEvent, render, screen } from '@testing-library/react';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('NavbarComponent', () => {
  describe('Rendering', () => {
    it('renders navbar with home item', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Shop')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('renders navbar with home item hover', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Home')).toHaveClass('hover:bg-gray-300');
    });

    it('renders navbar with shop item hover', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Shop')).toHaveClass('hover:bg-gray-300');
    });

    it('renders navbar with categories item hover', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Categories')).toHaveClass('hover:bg-gray-300');
    });

    it('renders navbar with blog item hover', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Blog')).toHaveClass('hover:bg-gray-300');
    });
  });

  describe('Interaction', () => {
    it('navigates to home page when home item is clicked', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      fireEvent.click(screen.getByText('Home'));
      expect(window.location.pathname).toBe('/');
    });

    it('navigates to shop page when shop item is clicked', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      fireEvent.click(screen.getByText('Shop'));
      expect(window.location.pathname).toBe('/products');
    });

    it('navigates to categories page when categories item is clicked', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      fireEvent.click(screen.getByText('Categories'));
      expect(window.location.pathname).toBe('/products');
    });

    it('navigates to blog page when blog item is clicked', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      fireEvent.click(screen.getByText('Blog'));
      expect(window.location.pathname).toBe('/products');
    });
  });

  describe('Edge cases', () => {
    it('renders navbar with empty items', () => {
      render(
        <TestQueryClient>
          <Navbar />
        </TestQueryClient>,
      );
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Shop')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Home')).toHaveClass('hover:bg-gray-300');
      expect(screen.getByText('Shop')).toHaveClass('hover:bg-gray-300');
      expect(screen.getByText('Categories')).toHaveClass('hover:bg-gray-300');
      expect(screen.getByText('Blog')).toHaveClass('hover:bg-gray-300');
    });
  });
});
