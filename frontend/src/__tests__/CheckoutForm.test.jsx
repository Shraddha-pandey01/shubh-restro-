import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Checkout } from '../pages/Checkout.jsx';
import CartContext from '../context/CartContext.jsx';
import AuthContext from '../context/AuthContext.jsx';

const mockCartValue = {
  cartItems: [
    {
      menuItemId: 'item-1',
      name: 'Paneer Butter Masala',
      price: 185,
      quantity: 1,
    },
  ],
  subtotal: 185,
  tax: 18.5,
  total: 203.5,
  clearCart: () => {},
};

const mockAuthValue = {
  user: { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 9876543210' },
  isAuthenticated: true,
  loading: false,
};

const renderCheckout = () => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <CartContext.Provider value={mockCartValue}>
        <BrowserRouter>
          <Checkout />
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

describe('Checkout Form Component Tests', () => {
  it('should render checkout with order items and fulfillment options', () => {
    renderCheckout();
    expect(screen.getByText(/Checkout & Confirmation/i)).toBeInTheDocument();
    expect(screen.getByText(/Restaurant Pickup/i)).toBeInTheDocument();
    expect(screen.getByText(/Chauffeured Delivery/i)).toBeInTheDocument();
  });

  it('should switch fulfillment to delivery and prompt for street address', () => {
    renderCheckout();
    const deliveryBtn = screen.getByText(/Chauffeured Delivery/i);
    fireEvent.click(deliveryBtn);

    expect(screen.getByPlaceholderText(/12 Civil Lines/i)).toBeInTheDocument();
    expect(screen.getAllByText(/₹15\.00/i).length).toBeGreaterThanOrEqual(1);
  });
});
