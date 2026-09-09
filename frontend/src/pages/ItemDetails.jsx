import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FALLBACK_MENU } from '../data/fallbackMenu.js';

export const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState('');

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDish = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/menu/${itemId}`);
        if (res.success && res.data) {
          setItem(res.data);
        } else {
          const found = FALLBACK_MENU.find((i) => i._id === itemId) || FALLBACK_MENU[0];
          setItem(found);
        }
      } catch {
        const found = FALLBACK_MENU.find((i) => i._id === itemId) || FALLBACK_MENU[0];
        setItem(found);
      } finally {
        setLoading(false);
      }
    };

    fetchDish();
  }, [itemId]);

  const handleAddToCart = () => {
    if (!item) return;
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in or create an account to curate your luxury dining order.',
        },
      });
      return;
    }
    addToCart(item, quantity);
    setNotification(`Added ${quantity}x "${item.name}" to cart`);
    setTimeout(() => setNotification(''), 3000);
  };

  if (loading) {
    return (
      <div className="bg-background text-on-background min-h-screen">
        <Navbar />
        <div className="pt-48 pb-24 text-center font-headline text-primary text-xl animate-pulse">
          EXPLORING DISH DETAILS...
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="bg-background text-on-background min-h-screen">
        <Navbar />
        <div className="pt-48 pb-24 text-center">
          <h2 className="font-headline text-3xl text-on-surface mb-4">Dish Not Found</h2>
          <Link to="/menu" className="font-label-caps text-xs text-primary border border-primary px-6 py-3">
            Return to Menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-primary text-on-primary px-6 py-3 shadow-2xl font-label-caps text-xs tracking-wider flex items-center gap-2 border border-black animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {notification}
        </div>
      )}

      {/* Breadcrumb Header */}
      <div className="pt-32 pb-6 px-6 lg:px-margin-desktop max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 font-label-caps text-xs text-on-surface-variant uppercase tracking-wider">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/menu" className="hover:text-primary">Menu</Link>
          <span>/</span>
          <span className="text-primary">{item.name}</span>
        </nav>
      </div>

      {/* Main Content Showcase */}
      <main className="pb-24 px-6 lg:px-margin-desktop max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Dish Image */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-3">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Dish Details */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-label-caps text-xs text-primary tracking-[0.25em] uppercase">
                  {item.category}
                </span>
                <span className="text-on-surface-variant/40">•</span>
                {item.isVeg ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-label-caps uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Vegetarian
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-label-caps uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-600/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Non-Vegetarian
                  </span>
                )}
              </div>
              <h1 className="font-headline text-3xl md:text-5xl text-on-surface mt-2 mb-4 leading-tight">
                {item.name}
              </h1>
              <div className="text-3xl font-headline text-primary">
                ₹{item.price}
              </div>
            </div>

            <div className="border-t border-b border-primary/20 py-4">
              <p className="font-body text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tasting Notes and Wine Pairing */}
            <div className="space-y-4 bg-surface-container-lowest p-6 border border-primary/10">
              {item.tastingNotes && (
                <div>
                  <h4 className="font-label-caps text-[11px] text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">palette</span>
                    Tasting Profile
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant italic">
                    {item.tastingNotes}
                  </p>
                </div>
              )}

              {item.winePairing && (
                <div className="pt-3 border-t border-white/5">
                  <h4 className="font-label-caps text-[11px] text-primary uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">local_cafe</span>
                    Beverage Pairing
                  </h4>
                  <p className="font-body text-xs text-on-surface-variant italic">
                    {item.winePairing}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity and Order Action */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center border border-primary/30 bg-surface-container">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-on-surface hover:text-primary transition-colors text-sm font-bold"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 font-headline text-sm text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-on-surface hover:text-primary transition-colors text-sm font-bold"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="flex-1 font-label-caps text-xs md:text-sm bg-primary text-on-primary py-3.5 px-6 rounded-none hover:bg-primary-fixed disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Add to Cart • ₹{(item.price * quantity).toFixed(2)}
              </button>
            </div>

            <div className="flex gap-4 text-xs text-on-surface-variant pt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">verified</span>
                Signature Kitchen Preparation
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-primary">schedule</span>
                Fresh Table-Side Plating
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
