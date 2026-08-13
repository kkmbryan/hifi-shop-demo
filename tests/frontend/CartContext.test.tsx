import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart, formatHkdPrice } from '../../src/frontend/src/context/CartContext';
import { PRODUCTS } from '../../src/frontend/src/data/products';

const TestCartComponent: React.FC = () => {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPriceHkd, totalCount, formatHkd } = useCart();

  const mockProduct1 = PRODUCTS.find(p => p.id === 'prod-chord-hugo-tt2') || PRODUCTS[0];
  const mockProduct2 = PRODUCTS.find(p => p.id === 'prod-sennheiser-hd800s') || PRODUCTS[1];

  return (
    <div>
      <span data-testid="total-count">{totalCount}</span>
      <span data-testid="total-price">{formatHkd(totalPriceHkd)}</span>
      <span data-testid="cart-items-count">{cart.length}</span>

      <button onClick={() => addToCart(mockProduct1)}>Add Hugo TT2</button>
      <button onClick={() => addToCart(mockProduct2)}>Add HD800S</button>
      <button onClick={() => removeFromCart(mockProduct1.id)}>Remove Hugo TT2</button>
      <button onClick={() => updateQuantity(mockProduct1.id, 3)}>Update Hugo TT2 Qty to 3</button>
      <button onClick={() => updateQuantity(mockProduct1.id, 0)}>Set Hugo TT2 Qty to 0</button>
      <button onClick={() => clearCart()}>Clear Cart</button>

      <ul>
        {cart.map(item => (
          <li key={item.product.id} data-testid={`cart-item-${item.product.id}`}>
            {item.product.nameEn} - Qty: {item.quantity} - Subtotal: {formatHkd(item.product.priceHkd * item.quantity)}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('CartContext Unit & Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should verify single HKD currency formatting ($39,800 HKD)', () => {
    expect(formatHkdPrice(39800)).toBe('$39,800 HKD');
    expect(formatHkdPrice(7980.5)).toBe('$7,980.5 HKD');
    expect(formatHkdPrice(0)).toBe('$0 HKD');
    expect(formatHkdPrice(118000)).toBe('$118,000 HKD');
  });

  it('should initialize with empty shopping cart', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$0 HKD');
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('0');
  });

  it('should allow guest to add items to cart and compute total HKD price', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Add Hugo TT2' }));

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$39,800 HKD');

    // Adding same product again increments quantity
    await user.click(screen.getByRole('button', { name: 'Add Hugo TT2' }));
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$79,600 HKD');

    // Add another product (HD800S price 14,200)
    await user.click(screen.getByRole('button', { name: 'Add HD800S' }));
    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');
    expect(screen.getByTestId('total-count')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$93,800 HKD');
  });

  it('should allow item removal from guest cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Add Hugo TT2' }));
    await user.click(screen.getByRole('button', { name: 'Add HD800S' }));

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Remove Hugo TT2' }));

    expect(screen.getByTestId('cart-items-count')).toHaveTextContent('1');
    expect(screen.queryByTestId('cart-item-prod-chord-hugo-tt2')).toBeNull();
    expect(screen.getByTestId('total-price')).toHaveTextContent('$14,200 HKD');
  });

  it('should support quantity updates and clearing cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Add Hugo TT2' }));
    await user.click(screen.getByRole('button', { name: 'Update Hugo TT2 Qty to 3' }));

    expect(screen.getByTestId('total-count')).toHaveTextContent('3');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$119,400 HKD');

    await user.click(screen.getByRole('button', { name: 'Clear Cart' }));
    expect(screen.getByTestId('total-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total-price')).toHaveTextContent('$0 HKD');
  });
});
