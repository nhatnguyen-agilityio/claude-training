import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductInfo from './index';
import type { ProductVariant } from '../../interfaces/products';

const makeVariant = (id: number, stock: number): ProductVariant => ({
  id,
  hex: '#FF5733',
  size: 'Medium',
  stock,
  images: [],
});

const renderInfo = (variants: ProductVariant[]) =>
  render(
    <MemoryRouter>
      <ProductInfo
        name="Modern Dining Chair"
        rating={{ average: 4.5 }}
        price={100}
        basePrice={150}
        description="A chair"
        variants={variants}
        userId="1"
        onAddToCart={jest.fn()}
      />
    </MemoryRouter>,
  );

describe('ProductInfo stock handling', () => {
  it('disables the quantity input and the add-to-cart button when stock is 0', () => {
    renderInfo([makeVariant(1, 0)]);

    expect(screen.getByLabelText('Quantity')).toBeDisabled();
    expect(screen.getAllByText('Out of stock').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Out of stock' })).toBeDisabled();
    expect(screen.getByLabelText('Quantity')).toHaveAttribute('max', '0');
  });

  it('caps the quantity at the stock when stock is above 0', () => {
    renderInfo([makeVariant(1, 7)]);

    const input = screen.getByLabelText('Quantity');
    expect(input).toBeEnabled();
    expect(input).toHaveAttribute('max', '7');
  });
});
