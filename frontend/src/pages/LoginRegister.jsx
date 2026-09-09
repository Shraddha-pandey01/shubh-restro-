import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: 'Test User',
    email: 'Testuser@gmail.com',
    password: '12345678',
    phone: '+91 9876543299',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (typeof location.state?.from === 'string' ? location.state.from : '/account');
  const redirectMessage = location.state?.message;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-36 pb-24 px-6 flex items-center justify-center">
        <div className="w-full max-w-md glass-panel p-8 md:p-10 border-primary/30">
          <div className="text-center mb-8">
            <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
              Patron Membership
            </span>
            <h1 className="font-headline text-3xl text-on-surface mt-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h1>
            <p className="font-body text-xs text-on-surface-variant mt-2">
              {isLogin
                ? 'Access your private reservation records and order timeline.'
                : 'Join the ShubhRestro registry for bespoke dining invitations.'}
            </p>
          </div>

          {redirectMessage && (
            <div className="mb-6 p-3 bg-primary/10 border border-primary/40 text-primary text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>{redirectMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-error/10 border border-error text-error text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="reg-name-input"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <div>
              <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                id="auth-email-input"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul.sharma@gmail.com"
                className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                id="auth-password-input"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="reg-phone-input"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            )}

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={loading}
              className="w-full mt-4 font-label-caps text-xs bg-primary text-on-primary py-3.5 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50"
            >
              {loading
                ? 'AUTHENTICATING...'
                : isLogin
                ? 'SIGN IN TO PROFILE'
                : 'CREATE MEMBERSHIP'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="font-label-caps text-xs text-primary hover:underline uppercase tracking-wider"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : 'Already a member? Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link to="/admin/login" className="text-[11px] text-outline hover:text-primary">
              Management Portal Access →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginRegister;
