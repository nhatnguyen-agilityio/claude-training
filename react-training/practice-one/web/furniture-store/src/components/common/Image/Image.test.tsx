import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Image from '.';
import { render, screen } from '@testing-library/react';

const TestQueryClient = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ImageComponent', () => {
  describe('Rendering', () => {
    it('renders image with src and alt', () => {
      render(
        <TestQueryClient>
          <Image src="https://via.placeholder.com/150" alt="test" />
        </TestQueryClient>,
      );
      expect(screen.getByAltText('test')).toBeInTheDocument();
      expect(screen.getByAltText('test')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
    });

    it('renders image with width and height', () => {
      render(
        <TestQueryClient>
          <Image
            src="https://via.placeholder.com/150"
            alt="test"
            width="150"
            height="150"
          />
        </TestQueryClient>,
      );
      expect(screen.getByAltText('test')).toBeInTheDocument();
      expect(screen.getByAltText('test')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
      expect(screen.getByAltText('test')).toHaveAttribute('width', '150');
      expect(screen.getByAltText('test')).toHaveAttribute('height', '150');
    });

    it('renders image with custom className', () => {
      render(
        <TestQueryClient>
          <Image
            src="https://via.placeholder.com/150"
            alt="test"
            className="w-100 h-100"
          />
        </TestQueryClient>,
      );
      expect(screen.getByAltText('test')).toBeInTheDocument();
      expect(screen.getByAltText('test')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
      expect(screen.getByAltText('test')).toHaveAttribute(
        'class',
        'w-100 h-100',
      );
    });
  });

  describe('Edge cases', () => {
    it('renders image with empty alt', () => {
      render(
        <TestQueryClient>
          <Image src="https://via.placeholder.com/150" alt="" />
        </TestQueryClient>,
      );
      expect(screen.getByAltText('')).toBeInTheDocument();
      expect(screen.getByAltText('')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
    });

    it('renders image with empty width and height', () => {
      render(
        <TestQueryClient>
          <Image
            src="https://via.placeholder.com/150"
            alt="test"
            width=""
            height=""
          />
        </TestQueryClient>,
      );
      expect(screen.getByAltText('test')).toBeInTheDocument();
      expect(screen.getByAltText('test')).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150',
      );
      expect(screen.getByAltText('test')).toHaveAttribute('width', '');
      expect(screen.getByAltText('test')).toHaveAttribute('height', '');
    });
  });
});
