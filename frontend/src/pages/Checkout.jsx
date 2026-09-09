import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';

export const Checkout = () => {
  const { cartItems, subtotal, tax, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('pickup');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    street: '',
    city: '',
    postalCode: '',
    instructions: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const deliveryFee = orderType === 'delivery' ? 15 : 0;
  const grandTotal = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items before checkout.');
      return;
    }

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and contact phone number are required.');
      return;
    }

    if (orderType === 'delivery' && !formData.street.trim()) {
      setError('Street address is required for delivery.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        guestName: formData.name,
        guestPhone: formData.phone,
        guestEmail: formData.email,
        orderType,
        address:
          orderType === 'delivery'
            ? {
                street: formData.street,
                city: formData.city,
                postalCode: formData.postalCode,
                instructions: formData.instructions,
              }
            : undefined,
        items: cartItems.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
        paymentMethod: orderType === 'delivery' ? 'cash_on_delivery' : 'pay_at_pickup',
      };

      const res = await api.post('/orders', payload);
      if (res.success && res.data) {
        clearCart();
        navigate(`/orders/${res.data._id}`);
      } else {
        setError(res.message || 'Failed to place order.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while placing order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-48 pb-24 px-6 text-center max-w-md mx-auto">
          <h2 className="font-headline text-3xl text-on-surface mb-4">Cart is Empty</h2>
          <p className="font-body text-sm text-on-surface-variant mb-6">
            Please add dishes from our tasting menu to proceed with checkout.
          </p>
          <Link
            to="/menu"
            className="font-label-caps text-xs bg-primary text-on-primary px-8 py-3 uppercase tracking-wider"
          >
            Go to Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 lg:px-margin-desktop max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Final Step
          </span>
          <h1 className="font-headline text-3xl md:text-5xl text-on-surface mt-2">
            Checkout & Confirmation
          </h1>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error/10 border border-error text-error text-xs font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Order Fulfillment Method */}
            <div className="glass-panel p-6">
              <h2 className="font-headline text-lg text-on-surface mb-4">
                1. Order Fulfillment
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 border text-left transition-colors flex flex-col gap-1 ${
                    orderType === 'pickup'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  <div className="font-headline text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">storefront</span>
                    Restaurant Pickup
                  </div>
                  <span className="text-[11px] text-on-surface-variant/70">
                    Complimentary • Ready in 30 mins
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 border text-left transition-colors flex flex-col gap-1 ${
                    orderType === 'delivery'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/10 text-on-surface-variant hover:border-primary/40'
                  }`}
                >
                  <div className="font-headline text-sm font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    Chauffeured Delivery
                  </div>
                  <span className="text-[11px] text-on-surface-variant/70">
                    +₹15.00 Flat Rate
                  </span>
                </button>
              </div>
            </div>

            {/* Guest / Contact Details */}
            <div className="glass-panel p-6 space-y-4">
              <h2 className="font-headline text-lg text-on-surface mb-4">
                2. Contact Information
              </h2>
              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="checkout-name-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="checkout-phone-input"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="checkout-email-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul.sharma@gmail.com"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Delivery Address fields */}
              {orderType === 'delivery' && (
                <div className="pt-4 border-t border-white/10 space-y-4">
                  <h3 className="font-headline text-sm text-on-surface">Delivery Address</h3>
                  <div>
                    <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      required={orderType === 'delivery'}
                      placeholder="e.g. 12 Civil Lines, Prayagraj"
                      className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Prayagraj"
                        className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="211001"
                        className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Note */}
            <div className="glass-panel p-6">
              <h2 className="font-headline text-lg text-on-surface mb-2">
                3. Settlement & Payment
              </h2>
              <div className="p-4 bg-surface-container border border-primary/20 text-xs text-on-surface-variant flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">payments</span>
                <div>
                  <div className="font-semibold text-on-surface">Pay at Restaurant / Upon Delivery</div>
                  <p className="text-[11px] text-on-surface-variant/70 mt-0.5">
                    We accept all major credit cards, cash, and luxury concierge billing upon receipt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary & Place Order CTA */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 space-y-6 sticky top-32">
              <h2 className="font-headline text-xl text-on-surface border-b border-primary/20 pb-3">
                Order Review
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.menuItemId} className="flex justify-between text-xs py-1">
                    <span className="text-on-surface">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-headline text-primary">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-primary/20 pt-4 space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-headline text-on-surface">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span className="font-headline text-on-surface">₹{tax.toFixed(2)}</span>
                </div>
                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-headline text-on-surface">₹15.00</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-white/10 text-on-surface">
                  <span>Total Due</span>
                  <span className="font-headline text-2xl text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                id="place-order-submit-btn"
                disabled={isSubmitting}
                className="w-full font-label-caps text-xs md:text-sm bg-primary text-on-primary py-4 px-6 rounded-none hover:bg-primary-fixed transition-colors font-semibold uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'PLACING ORDER...' : `CONFIRM & ORDER • ₹${grandTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
