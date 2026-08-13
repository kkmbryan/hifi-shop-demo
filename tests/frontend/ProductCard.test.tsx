import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../src/frontend/src/components/ProductCard';
import { CartProvider } from '../../src/frontend/src/context/CartContext';
import { LocaleProvider } from '../../src/frontend/src/context/LocaleContext';
import { PRODUCTS, Product } from '../../src/frontend/src/data/products';

const sampleProduct: Product = PRODUCTS[0];

const TestHarness: React.FC<{ product: Product; onSelect?: (p: Product) => void }> = ({
  product,
  onSelect
}) => (
  <LocaleProvider>
    <CartProvider>
      <ProductCard product={product} onSelectProduct={onSelect} />
    </CartProvider>
  </LocaleProvider>
);

describe('ProductCard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders product details and HKD price correctly', () => {
    render(<TestHarness product={sampleProduct} />);
    expect(screen.getByText(sampleProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(sampleProduct.nameZh)).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(sampleProduct.priceHkd.toLocaleString())).length).toBeGreaterThan(0);
  });

  it('triggers onSelectProduct when title is clicked', () => {
    const handleSelect = jest.fn();
    render(<TestHarness product={sampleProduct} onSelect={handleSelect} />);
    const title = screen.getByText(sampleProduct.nameZh);
    fireEvent.click(title);
    expect(handleSelect).toHaveBeenCalledWith(sampleProduct);
  });

  it('renders image when imageUrl is valid', () => {
    render(<TestHarness product={sampleProduct} />);
    const img = screen.getByAltText(sampleProduct.nameZh);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', sampleProduct.imageUrl);
  });

  it('renders fallback placeholder when imageUrl is empty', () => {
    const productNoImg: Product = { ...sampleProduct, imageUrl: '' };
    render(<TestHarness product={productNoImg} />);
    const fallback = screen.getByRole('img', { name: new RegExp(`${sampleProduct.brand} ${sampleProduct.model}`) });
    expect(fallback).toBeInTheDocument();
    expect(screen.queryByAltText(sampleProduct.nameZh)).not.toBeInTheDocument();
  });

  it('displays fallback placeholder when image loading fails with error event', () => {
    render(<TestHarness product={sampleProduct} />);
    const img = screen.getByAltText(sampleProduct.nameZh);
    fireEvent.error(img);
    const fallback = screen.getByRole('img', { name: new RegExp(`${sampleProduct.brand} ${sampleProduct.model}`) });
    expect(fallback).toBeInTheDocument();
  });
});
