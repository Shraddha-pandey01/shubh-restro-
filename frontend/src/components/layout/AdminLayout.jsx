import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminLayout = ({ children, title = 'Management' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: 'dashboard' },
    { label: 'Menu', path: '/admin/menu', icon: 'restaurant_menu' },
    { label: 'Orders', path: '/admin/orders', icon: 'receipt_long' },
    { label: 'Reservations', path: '/admin/reservations', icon: 'calendar_month' },
    { label: 'Gallery', path: '/admin/gallery', icon: 'photo_library' },
    { label: 'Reviews', path: '/admin/reviews', icon: 'reviews' },
    { label: 'Customers', path: '/admin/customers', icon: 'group' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex">
      {/* SideNavBar */}
      <aside className="bg-surface-container-low text-primary font-label-caps fixed left-0 top-0 h-screen w-64 border-r border-primary/10 shadow-xl flex flex-col py-8 z-50">
        <div className="px-6 mb-8">
          <Link to="/admin" className="block font-headline text-2xl text-primary tracking-widest uppercase mb-4">
            ShubhRestro
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-primary/40 bg-surface-container flex items-center justify-center text-primary font-bold text-sm">
              SP
            </div>
            <div>
              <div className="font-label-caps text-xs text-primary font-bold">{user?.name || 'Shubham Pandey'}</div>
              <div className="font-body text-xs text-on-surface-variant truncate max-w-[130px]">
                {user?.email || 'admin@shubhrestro.com'}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`py-3 px-6 flex items-center gap-4 text-xs font-semibold uppercase tracking-wider transition-all ${
                      active
                        ? 'text-primary bg-primary/10 border-l-2 border-primary'
                        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Logout & public site links */}
        <div className="px-6 pt-4 border-t border-primary/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-xs text-on-surface-variant hover:text-primary py-2 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-xs text-error hover:opacity-80 py-2 w-full text-left transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Exit Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-primary/10 px-8 py-4 flex items-center justify-between">
          <h1 className="font-headline text-xl text-on-surface uppercase tracking-wider">
            {title}
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Live Connected
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
