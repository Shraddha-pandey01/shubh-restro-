import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { BookATable } from '../pages/BookATable.jsx';
import AuthContext from '../context/AuthContext.jsx';
import CartContext from '../context/CartContext.jsx';

const mockAuthValue = {
  user: { name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', phone: '+91 9876543210' },
  isAuthenticated: true,
  loading: false,
};

const mockCartValue = {
  cartItems: [],
  itemCount: 0,
};

const renderBookATable = () => {
  return render(
    <AuthContext.Provider value={mockAuthValue}>
      <CartContext.Provider value={mockCartValue}>
        <BrowserRouter>
          <BookATable />
        </BrowserRouter>
      </CartContext.Provider>
    </AuthContext.Provider>
  );
};

describe('BookATable Component Tests', () => {
  it('should render table reservation form inputs', () => {
    renderBookATable();
    expect(screen.getByText(/Reserve Your Sanctuary/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Rahul Sharma/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/\+91 9876543210/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CONFIRM RESERVATION/i })).toBeInTheDocument();
  });

  it('should toggle to reservation lookup view', () => {
    renderBookATable();
    const lookupTabBtn = screen.getByRole('button', { name: /Find Existing Reservation/i });
    fireEvent.click(lookupTabBtn);

    expect(screen.getByText(/Look Up Your Reservation/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/SHUBH-BKG-/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /SEARCH RESERVATION/i })).toBeInTheDocument();
  });
});
