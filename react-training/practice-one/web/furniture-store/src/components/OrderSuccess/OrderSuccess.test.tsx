import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import OrderSuccess from '.';

jest.mock('../common/Button', () => ({
  __esModule: true,
  default: ({
    children,
    type,
    className,
    disabled,
    onClick,
  }: Record<string, unknown>) => (
    <button
      type={type as 'submit' | 'reset' | 'button'}
      className={className as string}
      disabled={disabled as boolean}
      onClick={onClick as () => void}
      data-testid="done-button"
    >
      {children as ReactNode}
    </button>
  ),
}));

jest.mock('../common/Image', () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) {
    return (
      <img src={src} alt={alt} className={className} data-testid="mock-image" />
    );
  };
});

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('OrderSuccess Component', () => {
  const mockOnNext = jest.fn();

  it('renders order success component', () => {
    render(
      <TestWrapper>
        <OrderSuccess onBack={() => {}} />
      </TestWrapper>,
    );
    expect(screen.getByText('Your Order is Confirmed!')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Thank you for shopping with us! Your beautiful new furniture is on its way and will be with you soon. Get ready to transform your space!',
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId('done-button')).toBeInTheDocument();
  });

  it('calls onBack when done button is clicked', () => {
    render(
      <TestWrapper>
        <OrderSuccess onBack={mockOnNext} />
      </TestWrapper>,
    );
    fireEvent.click(screen.getByTestId('done-button'));
    expect(mockOnNext).toHaveBeenCalled();
  });

  it('renders image', () => {
    render(
      <TestWrapper>
        <OrderSuccess onBack={() => {}} />
      </TestWrapper>,
    );
    const mockImage = screen.getByTestId('mock-image');
    expect(mockImage).toBeInTheDocument();
    expect(mockImage).toHaveAttribute(
      'src',
      'https://ucarecdn.com/e16a953e-9f0b-4842-987d-da9496c6e677/-/format/auto/',
    );
    expect(mockImage).toHaveAttribute('alt', 'Squircle');
    expect(mockImage).toHaveClass('w-full h-full object-contain');
  });
});
