import { render, screen, act, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CategoryItem from '.';
import userEvent from '@testing-library/user-event';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('CategoryItemComponent', () => {
  describe('Rendering', () => {
    it('renders CategoryItem component with correct text', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <CategoryItem
              id={1}
              name="Test"
              imageUrl="https://via.placeholder.com/150"
              imageAlt="Test"
            />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(screen.getByText('Test')).toBeInTheDocument();
        expect(screen.getByText('Shop now')).toBeInTheDocument();
      });
    });
    it('renders CategoryItem component with correct image', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://via.placeholder.com/150');
      expect(image).toHaveAttribute('alt', 'Test');
    });
    it('renders CategoryItem component with customer classes', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            className="flex-col"
          />
        </TestQueryClient>,
      );
      const container = document.querySelector(
        'div[class*="bg-background-primary"]',
      );
      expect(container).toHaveClass('flex-col');
    });
    it('renders CategoryItem component with customer image class name', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
            imageClassName="object-contain"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('img')).toHaveClass('object-contain');
    });
    it('renders CategoryItem component with correct styling classes', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('img')).toHaveClass(
        'w-full h-full object-contain',
      );
    });
    it('renders CategoryItem component with correct link', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/products?categoryId=1&categoryTitle=Test',
      );
    });
    it('renders CategoryItem component with correct button', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('link')).toHaveTextContent('Shop now');
    });
    it('renders CategoryItem component with correct button icon', () => {
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      expect(screen.getByRole('link').querySelector('svg')).toBeInTheDocument();
    });
  });
  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <CategoryItem
            id={1}
            name="Test"
            imageUrl="https://via.placeholder.com/150"
            imageAlt="Test"
          />
        </TestQueryClient>,
      );
      await user.click(screen.getByRole('link'));
      expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        '/products?categoryId=1&categoryTitle=Test',
      );
    });
  });
});
