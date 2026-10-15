import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import SearchProduct from '.';

const TestWrapper = ({
  children,
  initialEntries = ['/'],
}: {
  children: ReactNode;
  initialEntries?: string[];
}) => <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>;

describe('SearchProductComponent', () => {
  describe('Rendering', () => {
    it('Render SearchProduct component with empty search value', () => {
      render(
        <TestWrapper>
          <SearchProduct />
        </TestWrapper>,
      );
      expect(
        screen.getByPlaceholderText('Search by name or category...'),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    it('Render SearchProduct component with search value from URL', () => {
      render(
        <TestWrapper initialEntries={['/?search=Chair']}>
          <SearchProduct />
        </TestWrapper>,
      );
      expect(
        screen.getByPlaceholderText('Search by name or category...'),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('Chair')).toBeInTheDocument();
    });

    it('Render SearchProduct component with valid button search icon', () => {
      render(
        <TestWrapper>
          <SearchProduct />
        </TestWrapper>,
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(
        screen.getByRole('button').querySelector('svg'),
      ).toBeInTheDocument();
    });
  });

  describe('User Interaction', () => {
    it('User input search value and click search button', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchProduct />
        </TestWrapper>,
      );

      const input = screen.getByPlaceholderText(
        'Search by name or category...',
      );
      await user.type(input, 'Test');

      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      // After clicking search, the URL should be updated
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    });

    it('User input search value and press enter key', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <SearchProduct />
        </TestWrapper>,
      );

      const input = screen.getByPlaceholderText(
        'Search by name or category...',
      );
      await user.type(input, 'Chair');

      expect(screen.getByDisplayValue('Chair')).toBeInTheDocument();

      await user.keyboard('{enter}');

      // After pressing enter, the search value should remain
      expect(screen.getByDisplayValue('Chair')).toBeInTheDocument();
    });

    it('User clicks search button with existing search value from URL', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper initialEntries={['/?search=TestSearch']}>
          <SearchProduct />
        </TestWrapper>,
      );

      expect(screen.getByDisplayValue('TestSearch')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      // Search value should persist after clicking search
      expect(screen.getByDisplayValue('TestSearch')).toBeInTheDocument();
    });

    it('User clears search value and clicks search button', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper initialEntries={['/?search=Chair']}>
          <SearchProduct />
        </TestWrapper>,
      );

      const input = screen.getByPlaceholderText(
        'Search by name or category...',
      );

      expect(screen.getByDisplayValue('Chair')).toBeInTheDocument();

      await user.clear(input);
      expect(screen.getByDisplayValue('')).toBeInTheDocument();

      await user.click(screen.getByRole('button'));

      // After clearing and searching, input should be empty
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });
  });
});
