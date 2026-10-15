import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import FilterDropdown from '.';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FilterDropdownComponent', () => {
  describe('Rendering', () => {
    it('renders filter dropdown with most recent position', async () => {
      const setPosition = jest.fn();
      await act(async () => {
        render(
          <TestQueryClient>
            <FilterDropdown position="mostRecent" setPosition={setPosition} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Most Recent' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Most Recent' }),
        ).not.toHaveAttribute('disabled');
      });
    });

    it('renders filter dropdown with low to high position', async () => {
      const setPosition = jest.fn();
      await act(async () => {
        render(
          <TestQueryClient>
            <FilterDropdown position="lowToHigh" setPosition={setPosition} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Price: Low to High' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Price: Low to High' }),
        ).not.toHaveAttribute('disabled');
      });
    });

    it('renders filter dropdown with high to low position', async () => {
      const setPosition = jest.fn();
      await act(async () => {
        render(
          <TestQueryClient>
            <FilterDropdown position="highToLow" setPosition={setPosition} />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: 'Price: High to Low' }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('button', { name: 'Price: High to Low' }),
        ).not.toHaveAttribute('disabled');
      });
    });
  });

  describe('Interaction', () => {
    it('calls setPosition when dropdown item is selected', async () => {
      const user = userEvent.setup();
      const setPosition = jest.fn();
      render(
        <TestQueryClient>
          <FilterDropdown position="mostRecent" setPosition={setPosition} />
        </TestQueryClient>,
      );

      await user.click(screen.getByRole('button', { name: 'Most Recent' }));

      await user.click(
        screen.getByRole('menuitemradio', { name: 'Price: Low to High' }),
      );

      expect(setPosition).toHaveBeenCalledWith('lowToHigh');
    });
  });

  describe('Edge cases', () => {
    it('renders filter dropdown with empty position', () => {
      const setPosition = jest.fn();
      render(
        <TestQueryClient>
          <FilterDropdown position="" setPosition={setPosition} />
        </TestQueryClient>,
      );
      expect(
        screen.getByRole('button', { name: 'Price: High to Low' }),
      ).toBeInTheDocument();
    });

    it('renders filter dropdown with empty setPosition', () => {
      const setPosition = jest.fn();
      render(
        <TestQueryClient>
          <FilterDropdown position="mostRecent" setPosition={setPosition} />
        </TestQueryClient>,
      );
      expect(
        screen.getByRole('button', { name: 'Most Recent' }),
      ).toBeInTheDocument();
    });

    it('renders filter dropdown with empty position and empty setPosition', () => {
      const setPosition = jest.fn();
      render(
        <TestQueryClient>
          <FilterDropdown position="" setPosition={setPosition} />
        </TestQueryClient>,
      );
      expect(
        screen.getByRole('button', { name: 'Price: High to Low' }),
      ).toBeInTheDocument();
    });
  });
});
