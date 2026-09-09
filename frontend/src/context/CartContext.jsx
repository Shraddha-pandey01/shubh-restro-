import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved =
        localStorage.getItem('shubhrestro_cart') ||
        localStorage.getItem('lumiere_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('shubhrestro_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore localStorage write error
    }
  }, [cartItems]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === (item._id || item.menuItemId));
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === (item._id || item.menuItemId)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item._id || item.menuItemId,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: Math.max(1, quantity),
        },
      ];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCartItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = Math.round(cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0) * 100) / 100;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    tax,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
