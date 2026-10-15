import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Loading from '.';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LoadingComponent', () => {
  it('renders Loading component with correct text', () => {
    render(
      <TestQueryClient>
        <Loading />
      </TestQueryClient>,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders Loading component with correct icon', () => {
    render(
      <TestQueryClient>
        <Loading />
      </TestQueryClient>,
    );
    const wrapper = document.querySelector('.bg-white');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper?.querySelector('svg')).toBeInTheDocument();
  });
});
