import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import UserButton from '.';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('UserButtonComponent', () => {
  const mockLogout = jest.fn();
  const mockUseAuth = jest.mocked(
    jest.requireMock('../../hooks/useAuth').useAuth,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      logout: mockLogout,
    });
  });

  describe('Rendering', () => {
    it('renders user button with CircleUser icon', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <UserButton />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();

        const icon = button.querySelector('svg');
        expect(icon).toBeInTheDocument();
      });
    });

    it('renders button with correct styling classes', async () => {
      await act(async () => {
        render(
          <TestQueryClient>
            <UserButton />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toHaveClass('w-16');
        expect(button).toHaveClass('h-16');
        expect(button).toHaveClass('bg-app-secondary');
        expect(button).toHaveClass('rounded-full');
        expect(button).toHaveClass('hover:bg-gray-200');
        expect(button).toHaveClass('transition');
      });
    });
  });

  describe('Dropdown Functionality', () => {
    it('opens dropdown when button is clicked', async () => {
      const user = userEvent.setup();
      await act(async () => {
        render(
          <TestQueryClient>
            <UserButton />
          </TestQueryClient>,
        );
      });

      await waitFor(() => {
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
      });

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('renders logout menu item with LogOut icon', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <UserButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const logoutItem = screen.getByText('Logout');
      expect(logoutItem).toBeInTheDocument();

      const logoutIcon = logoutItem.parentElement?.querySelector('svg');
      expect(logoutIcon).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls logout function when logout menu item is clicked', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <UserButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const logoutItem = screen.getByText('Logout');
      await user.click(logoutItem);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles logout function being undefined', async () => {
      mockUseAuth.mockReturnValue({
        logout: undefined,
      });

      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <UserButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const logoutItem = screen.getByText('Logout');

      await expect(user.click(logoutItem)).resolves.not.toThrow();
    });

    it('handles logout function being null', async () => {
      mockUseAuth.mockReturnValue({
        logout: null,
      });

      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <UserButton />
        </TestQueryClient>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      const logoutItem = screen.getByText('Logout');

      await expect(user.click(logoutItem)).resolves.not.toThrow();
    });
  });
});
