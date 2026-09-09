import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { FALLBACK_MENU } from '../data/fallbackMenu.js';

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [notification, setNotification] = useState('');

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    'All',
    'Starters',
    'Main Course',
    'Rice & Biryani',
    'Breads',
    'South Indian',
    'Snacks',
    'Desserts',
    'Beverages',
    'Chef Specialties',
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);

      const applyFallbackFilter = () => {
        let filtered = [...FALLBACK_MENU];
        if (activeCategory !== 'All') {
          filtered = filtered.filter((i) => i.category === activeCategory);
        }
        if (search) {
          filtered = filtered.filter(
            (i) =>
              i.name.toLowerCase().includes(search.toLowerCase()) ||
              i.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (dietFilter === 'veg') {
          filtered = filtered.filter((i) => i.isVeg);
        } else if (dietFilter === 'non-veg') {
          filtered = filtered.filter((i) => !i.isVeg);
        }
        setItems(filtered);
      };

      try {
        const queryParams = new URLSearchParams();
        if (activeCategory !== 'All') queryParams.append('category', activeCategory);
        if (search) queryParams.append('search', search);
        if (dietFilter === 'veg') queryParams.append('isVeg', 'true');
        if (dietFilter === 'non-veg') queryParams.append('isVeg', 'false');

        const res = await api.get(`/menu?${queryParams.toString()}`);
        if (res.success && res.data && res.data.length > 0) {
          setItems(res.data);
        } else {
          applyFallbackFilter();
        }
      } catch {
        applyFallbackFilter();
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [activeCategory, search, dietFilter]);

  const handleAddToCart = (item) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: {
          from: location,
          message: 'Please sign in or create an account to curate your luxury dining order.',
        },
      });
      return;
    }
    addToCart(item, 1);
    setNotification(`Added "${item.name}" to cart`);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 bg-primary text-on-primary px-6 py-3 shadow-2xl font-label-caps text-xs tracking-wider flex items-center gap-2 border border-black animate-fadeIn">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {notification}
        </div>
      )}

      {/* Hero / Header Section */}
      <section className="pt-36 pb-16 px-6 lg:px-margin-desktop bg-surface-container-lowest border-b border-primary/20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Our Specialties
          </span>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface mt-3 mb-6">
            The Dining Menu
          </h1>
          <p className="font-body text-base text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
            Each composition represents an uncompromised dialogue between authentic Indian spices, time-honored traditional recipes, and culinary excellence.
          </p>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="py-8 px-6 lg:px-margin-desktop bg-surface border-b border-primary/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-label-caps text-xs px-4 py-2 uppercase tracking-wider transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Veg Filter */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full bg-surface-container-low border-b border-primary/40 text-on-surface px-3 py-2 text-xs focus:outline-none focus:border-primary placeholder-on-surface-variant/40"
              />
              <span className="material-symbols-outlined absolute right-2 top-2 text-primary/60 text-sm">
                search
              </span>
            </div>

            {/* Dietary Preference Filter Pills */}
            <div className="flex items-center border border-white/10 bg-surface-container-low p-0.5">
              <button
                id="diet-filter-all"
                onClick={() => setDietFilter('all')}
                className={`font-label-caps text-xs px-3 py-1.5 transition-all uppercase tracking-wider ${
                  dietFilter === 'all'
                    ? 'bg-primary text-on-primary font-bold shadow'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                All
              </button>
              <button
                id="diet-filter-veg"
                onClick={() => setDietFilter('veg')}
                className={`font-label-caps text-xs px-3 py-1.5 transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                  dietFilter === 'veg'
                    ? 'bg-emerald-900/90 text-emerald-300 border border-emerald-500/60 font-bold shadow'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Veg
              </button>
              <button
                id="diet-filter-nonveg"
                onClick={() => setDietFilter('non-veg')}
                className={`font-label-caps text-xs px-3 py-1.5 transition-all uppercase tracking-wider flex items-center gap-1.5 ${
                  dietFilter === 'non-veg'
                    ? 'bg-red-900/90 text-red-300 border border-red-500/60 font-bold shadow'
                    : 'text-red-400/80 hover:text-red-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                Non-Veg
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <main className="py-16 px-6 lg:px-margin-desktop max-w-7xl mx-auto">
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            PRESENTING THE CUISINE...
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center text-on-surface-variant font-body">
            No dishes found matching your current selection.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="glass-panel group flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-primary/50"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 bg-surface-container-lowest/90 text-primary px-3 py-1 text-sm font-semibold border border-primary/30">
                    ₹{item.price}
                  </div>
                  {item.isVeg ? (
                    <span className="absolute top-3 left-3 bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 text-[10px] font-label-caps px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      Vegetarian
                    </span>
                  ) : (
                    <span className="absolute top-3 left-3 bg-red-950/90 text-red-300 border border-red-700/60 text-[10px] font-label-caps px-2.5 py-0.5 uppercase tracking-wider flex items-center gap-1.5 shadow-md backdrop-blur-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                      Non-Vegetarian
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
                      {item.category}
                    </span>
                    <h3 className="font-headline text-xl text-on-surface mt-1 mb-2 group-hover:text-primary transition-colors">
                      <Link to={`/menu/${item._id}`}>{item.name}</Link>
                    </h3>
                    <p className="font-body text-xs text-on-surface-variant line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between gap-3">
                    <Link
                      to={`/menu/${item._id}`}
                      className="font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider flex items-center gap-1"
                    >
                      Details <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </Link>

                    <button
                      id={`add-to-cart-${item._id}`}
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      className="font-label-caps text-xs bg-primary text-on-primary px-4 py-2.5 hover:bg-primary-fixed disabled:opacity-40 disabled:cursor-not-allowed transition-colors uppercase tracking-wider font-semibold flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Menu;
