import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import GetStarted from '.';
import userEvent from '@testing-library/user-event';

// Mock the Button component
jest.mock('../common/Button', () => ({
  __esModule: true,
  default: ({
    children,
    className,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button className={className} {...props}>
      {children}
    </button>
  ),
}));

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('GetStarted', () => {
  describe('Rendering', () => {
    it('renders GetStarted component with correct text', () => {
      render(
        <TestQueryClient>
          <GetStarted />
        </TestQueryClient>,
      );
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
    it('renders GetStarted component with correct icon', () => {
      render(
        <TestQueryClient>
          <GetStarted />
        </TestQueryClient>,
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
    it('renders GetStarted component with correct styling classes', () => {
      render(
        <TestQueryClient>
          <GetStarted />
        </TestQueryClient>,
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-app-primary');
      expect(button).toHaveClass('text-white');
    });
  });
  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <GetStarted />
        </TestQueryClient>,
      );
      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toBeInTheDocument();
    });
  });
});
