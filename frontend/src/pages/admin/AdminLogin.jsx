import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export const AdminLogin = () => {
  const [email, setEmail] = useState('Testadmin@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md glass-panel p-8 md:p-10 border-primary/40 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 border border-primary/50 mx-auto flex items-center justify-center text-primary mb-3">
            <span className="material-symbols-outlined text-2xl">shield_lock</span>
          </div>
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase block">
            Executive Access
          </span>
          <h1 className="font-headline text-2xl md:text-3xl text-on-surface mt-2 uppercase tracking-widest">
            ShubhRestro Back Office
          </h1>
          <p className="font-body text-xs text-on-surface-variant mt-2 font-light">
            Authorized management & administrative personnel only.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error text-error text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
              Staff Email
            </label>
            <input
              type="email"
              id="admin-email-input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shubhrestro.com"
              className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
              Security Key (Password)
            </label>
            <input
              type="password"
              id="admin-password-input"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            id="admin-login-submit-btn"
            disabled={loading}
            className="w-full mt-4 font-label-caps text-xs bg-primary text-on-primary py-4 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'ENTER MANAGEMENT PORTAL'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <Link to="/" className="text-xs text-on-surface-variant hover:text-primary flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Public Dining Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
