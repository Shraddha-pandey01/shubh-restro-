import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const navLinks = [
    { label: 'Menu', path: '/menu' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Reservations', path: '/book-a-table' },
    { label: 'Reviews', path: '/reviews' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-primary/20 shadow-2xl transition-all duration-500 ease-in-out hidden md:flex justify-between items-center px-6 lg:px-margin-desktop py-5">
        <Link
          to="/"
          className="font-['Playfair_Display'] text-3xl lg:text-4xl text-primary tracking-wide hover:opacity-90 transition-opacity"
        >
          ShubhRestro
        </Link>

        <nav className="flex gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-label-caps text-label-caps uppercase transition-colors duration-300 ${isActive(link.path)
                ? 'text-primary border-b border-primary pb-1'
                : 'text-on-surface hover:text-primary'
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-6 items-center">
          {/* Cart Icon & Badge */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            className="relative text-on-surface hover:text-primary transition-colors flex items-center"
            title="Shopping Cart"
          >
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Status / Auth Actions */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/account"
                className="font-label-caps text-xs text-primary border border-primary/40 px-4 py-2 hover:bg-primary/10 transition-colors uppercase tracking-wider"
              >
                Account
              </Link>
              <button
                onClick={logout}
                className="font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-wider"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="font-label-caps text-xs bg-primary text-on-primary px-6 py-2.5 hover:bg-primary-fixed transition-colors uppercase tracking-wider font-semibold"
            >
              Sign In
            </Link>
          )}

          {/* Book a Table CTA */}
          <Link
            to="/book-a-table"
            className="font-label-caps text-label-caps bg-primary text-on-primary px-6 py-3 rounded-none hover:bg-primary-fixed transition-colors font-semibold uppercase tracking-wider"
          >
            Book a Table
          </Link>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-xl border-b border-primary/20 flex md:hidden justify-between items-center px-margin-mobile py-4">
        <Link to="/" className="font-brand text-xl text-primary tracking-widest uppercase">
          ShubhRestro
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-primary">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-on-primary text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-primary focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-surface/98 backdrop-blur-2xl md:hidden flex flex-col p-6 space-y-6 border-b border-primary/20 animate-fadeIn">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`font-label-caps text-sm uppercase py-2 border-b border-white/5 ${isActive(link.path) ? 'text-primary' : 'text-on-surface'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  onClick={() => setMobileOpen(false)}
                  className="font-label-caps text-sm uppercase py-2 text-on-surface hover:text-primary"
                >
                  My Account ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="text-left font-label-caps text-sm uppercase py-2 text-error"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="font-label-caps text-sm uppercase py-2 text-on-surface"
              >
                Login / Register
              </Link>
            )}
          </nav>
          <Link
            to="/book-a-table"
            onClick={() => setMobileOpen(false)}
            className="w-full text-center font-label-caps text-sm bg-primary text-on-primary py-3 rounded-none font-semibold uppercase"
          >
            Book a Table
          </Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
