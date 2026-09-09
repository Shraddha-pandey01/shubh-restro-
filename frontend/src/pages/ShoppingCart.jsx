import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';

export const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, tax, total, itemCount } = useCart();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 lg:px-margin-desktop max-w-6xl mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Your Selection
          </span>
          <h1 className="font-headline text-3xl md:text-5xl text-on-surface mt-2">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="glass-panel p-12 text-center max-w-xl mx-auto my-12">
            <span className="material-symbols-outlined text-5xl text-primary/60 mb-4">
              shopping_basket
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-2">Your Cart is Empty</h2>
            <p className="font-body text-sm text-on-surface-variant mb-6 font-light">
              Explore our authentic Indian vegetarian creations and add gourmet dishes to begin.
            </p>
            <Link
              to="/menu"
              className="inline-block font-label-caps text-xs bg-primary text-on-primary px-8 py-3.5 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.menuItemId}
                  className="glass-panel p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 justify-between"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover border border-primary/20 flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-headline text-lg text-on-surface">
                        <Link to={`/menu/${item.menuItemId}`} className="hover:text-primary transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      <div className="text-primary font-headline text-sm mt-1">
                        ₹{item.price} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                    <div className="flex items-center border border-primary/30 bg-surface-container">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="px-3 py-1 text-on-surface hover:text-primary transition-colors text-sm font-bold"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-headline text-xs text-primary">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="px-3 py-1 text-on-surface hover:text-primary transition-colors text-sm font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="font-headline text-base text-on-surface w-20 text-right">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.menuItemId)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-between items-center">
                <Link
                  to="/menu"
                  className="font-label-caps text-xs text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Continue Exploring Dishes
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 glass-panel p-6 space-y-6">
              <h2 className="font-headline text-xl text-on-surface border-b border-primary/20 pb-4">
                Summary
              </h2>

              <div className="space-y-3 font-body text-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-headline">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (10%)</span>
                  <span className="text-on-surface font-headline">₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-base font-semibold">
                  <span className="text-on-surface">Total</span>
                  <span className="text-primary font-headline text-xl">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                id="checkout-proceed-btn"
                className="block w-full text-center font-label-caps text-xs md:text-sm bg-primary text-on-primary py-4 px-6 rounded-none hover:bg-primary-fixed transition-colors font-semibold uppercase tracking-widest shadow-lg"
              >
                Proceed to Checkout
              </Link>

              <div className="text-[11px] text-on-surface-variant/60 text-center uppercase tracking-wider">
                Pay upon pickup / table arrival for v1
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ShoppingCart;
