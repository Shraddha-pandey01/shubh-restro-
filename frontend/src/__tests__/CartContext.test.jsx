import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext.jsx';

describe('CartContext Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('should add item to cart and calculate subtotal and tax (10%) accurately', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const item = {
      _id: 'paneer-item-1',
      name: 'Paneer Tikka',
      price: 185,
      imageUrl: 'https://example.com/paneer.jpg',
    };

    act(() => {
      result.current.addToCart(item, 2);
    });

    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(370);
    expect(result.current.tax).toBe(37);
    expect(result.current.total).toBe(407);
  });

  it('should increment quantity when adding the same item again', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const item = {
      _id: 'dal-1',
      name: 'Dal Makhani',
      price: 48,
    };

    act(() => {
      result.current.addToCart(item, 1);
    });
    act(() => {
      result.current.addToCart(item, 2);
    });

    expect(result.current.itemCount).toBe(3);
    expect(result.current.subtotal).toBe(144);
  });

  it('should update item quantity and remove item if quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    const item = {
      _id: 'shahi-1',
      name: 'Shahi Paneer',
      price: 68,
    };

    act(() => {
      result.current.addToCart(item, 2);
    });
    act(() => {
      result.current.updateQuantity('shahi-1', 4);
    });
    expect(result.current.itemCount).toBe(4);

    act(() => {
      result.current.updateQuantity('shahi-1', 0);
    });
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should remove item and clear cart completely', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addToCart({ _id: 'item-1', name: 'Item 1', price: 20 }, 1);
      result.current.addToCart({ _id: 'item-2', name: 'Item 2', price: 30 }, 1);
    });

    expect(result.current.itemCount).toBe(2);

    act(() => {
      result.current.removeFromCart('item-1');
    });
    expect(result.current.itemCount).toBe(1);

    act(() => {
      result.current.clearCart();
    });
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });
});
