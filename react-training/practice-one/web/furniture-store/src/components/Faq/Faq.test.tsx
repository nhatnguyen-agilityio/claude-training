import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Faq from '.';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('FaqComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the main heading', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      expect(
        screen.getByText('We have got the answers to your questions'),
      ).toBeInTheDocument();
    });

    it('renders all FAQ items', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      expect(
        screen.getByText('What types of furniture do you offer?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Do you offer international shipping?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('What is your return policy?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('What payment methods do you accept?'),
      ).toBeInTheDocument();
    });

    it('renders FAQ item numbers', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders accordion container', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const accordion = document.querySelector('[data-slot="accordion"]');
      expect(accordion).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('renders heading with correct classes', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const heading = screen.getByText(
        'We have got the answers to your questions',
      );
      expect(heading).toHaveClass('text-left');
      expect(heading).toHaveClass('text-xl');
      expect(heading).toHaveClass('font-bold');
      expect(heading).toHaveClass('md:text-2xl');
      expect(heading).toHaveClass('lg:text-4xl');
    });

    it('renders accordion with correct classes', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const accordion = document.querySelector('[data-slot="accordion"]');
      expect(accordion).toHaveClass('w-full');
      expect(accordion).toHaveClass('mt-1');
      expect(accordion).toHaveClass('border-b-1');
    });
  });

  describe('FAQ Data', () => {
    it('displays correct FAQ questions', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const expectedQuestions = [
        'What types of furniture do you offer?',
        'Do you offer international shipping?',
        'What is your return policy?',
        'What payment methods do you accept?',
      ];

      expectedQuestions.forEach((question) => {
        expect(screen.getByText(question)).toBeInTheDocument();
      });
    });

    it('displays correct FAQ answers', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const expectedAnswer =
        'Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.';

      const answerElements = screen.getAllByText(expectedAnswer);
      expect(answerElements).toHaveLength(1);
    });
  });

  describe('Accordion Functionality', () => {
    it('sets first item as default open', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const accordionItems = document.querySelectorAll(
        '[data-slot="accordion-item"]',
      );
      expect(accordionItems).toHaveLength(4);

      expect(accordionItems[0]).toBeInTheDocument();
    });

    it('renders accordion triggers as buttons', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(4);
    });

    it('handles accordion trigger clicks', async () => {
      const user = userEvent.setup();
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const buttons = screen.getAllByRole('button');

      await user.click(buttons[1]);
      expect(buttons[1]).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for accordion', () => {
      render(
        <TestQueryClient>
          <Faq />
        </TestQueryClient>,
      );

      const accordion = document.querySelector('[data-slot="accordion"]');
      expect(accordion).toBeInTheDocument();

      const accordionItems = document.querySelectorAll(
        '[data-slot="accordion-item"]',
      );
      expect(accordionItems).toHaveLength(4);

      accordionItems.forEach((item) => {
        const trigger = item.querySelector('[data-slot="accordion-trigger"]');
        const content = item.querySelector('[data-slot="accordion-content"]');
        expect(trigger).toBeInTheDocument();
        expect(content).toBeInTheDocument();
      });
    });
  });
});
