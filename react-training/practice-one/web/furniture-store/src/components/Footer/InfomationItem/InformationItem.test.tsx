import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import InformationItem from '.';
import { render, screen } from '@testing-library/react';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('InformationItemComponent', () => {
  describe('Rendering', () => {
    it('renders the information item', () => {
      render(
        <TestQueryClient>
          <InformationItem title="OPENING HOURS" information="9am—6pm" />
        </TestQueryClient>,
      );
      expect(screen.getByText('OPENING HOURS')).toBeInTheDocument();
      expect(screen.getByText('9am—6pm')).toBeInTheDocument();
    });

    it('renders the information item with className', () => {
      render(
        <TestQueryClient>
          <InformationItem
            title="OPENING HOURS"
            information="9am—6pm"
            className="text-left"
          />
        </TestQueryClient>,
      );
      expect(screen.getByText('OPENING HOURS')).toBeInTheDocument();
      const informationItem = screen.getByText('9am—6pm');
      expect(informationItem).toBeInTheDocument();
      expect(informationItem).toHaveClass('text-left');
    });
  });
});
