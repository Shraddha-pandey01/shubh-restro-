import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export const GuestReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    guestName: user?.name || '',
    rating: 5,
    text: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews');
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setIsSubmitting(true);

    try {
      const res = await api.post('/reviews', {
        ...formData,
        rating: Number(formData.rating),
      });

      if (res.success) {
        setSubmitSuccess(res.message);
        setFormData({ guestName: user?.name || '', rating: 5, text: '' });
        setTimeout(() => {
          setShowFormModal(false);
          setSubmitSuccess('');
        }, 3000);
      } else {
        setSubmitError(res.message || 'Review submission failed.');
      }
    } catch (err) {
      setSubmitError(err.message || 'Error occurred while submitting review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-12 px-6 lg:px-margin-desktop text-center bg-surface-container-lowest border-b border-primary/20">
        <div className="max-w-3xl mx-auto">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Customer Stories
          </span>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface mt-2 mb-4">
            Guest Reflections
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant font-light leading-relaxed mb-6">
            Read what our customers have to say about their dining experience at ShubhRestro.
          </p>

          <button
            onClick={() => setShowFormModal(true)}
            className="font-label-caps text-xs bg-primary text-on-primary px-8 py-3.5 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors"
          >
            Share Your Experience
          </button>
        </div>
      </section>

      {/* Review Cards Grid */}
      <main className="flex-1 py-16 px-6 lg:px-margin-desktop max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            LOADING GUEST CRITIQUES...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-24 text-center text-on-surface-variant font-body">
            No public reviews published yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="glass-panel p-8 flex flex-col justify-between border-primary/20 hover:border-primary/50 transition-colors"
              >
                <div>
                  <div className="flex gap-1 text-primary mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-base">
                        star
                      </span>
                    ))}
                  </div>

                  <blockquote className="font-headline italic text-lg text-on-surface leading-relaxed mb-6">
                    "{rev.text}"
                  </blockquote>
                </div>

                <div className="pt-4 border-t border-primary/10 flex items-center justify-between">
                  <div className="font-label-caps text-xs text-primary uppercase tracking-widest font-semibold">
                    {rev.guestName}
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Write Review Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-xl w-full glass-panel p-8 relative border-primary animate-fadeIn">
            <button
              onClick={() => setShowFormModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <span className="font-label-caps text-xs text-primary uppercase tracking-widest block mb-1">
              Testimonial
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-6">
              Inscribe Your Reflection
            </h2>

            {submitSuccess ? (
              <div className="p-6 bg-surface-container border border-primary text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-2">
                  verified
                </span>
                <p className="font-body text-sm text-on-surface">{submitSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3 bg-error/10 border border-error text-error text-xs">
                    {submitError}
                  </div>
                )}

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) =>
                      setFormData({ ...formData, guestName: e.target.value })
                    }
                    placeholder="e.g. Lady Genevieve"
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Rating *
                  </label>
                  <select
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number(e.target.value) })
                    }
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value={5} className="bg-surface text-on-surface">5 Stars - Transcendental</option>
                    <option value={4} className="bg-surface text-on-surface">4 Stars - Exceptional</option>
                    <option value={3} className="bg-surface text-on-surface">3 Stars - Memorable</option>
                    <option value={2} className="bg-surface text-on-surface">2 Stars - Satisfactory</option>
                    <option value={1} className="bg-surface text-on-surface">1 Star - Requires Refinement</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                    Your Thoughts & Impressions *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.text}
                    onChange={(e) =>
                      setFormData({ ...formData, text: e.target.value })
                    }
                    placeholder="Describe the dishes, ambiance, service, and standout details..."
                    className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
                  ></textarea>
                </div>

                <div className="text-[11px] text-on-surface-variant/60">
                  Reviews are reviewed by management prior to public display to preserve discretion.
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-label-caps text-xs bg-primary text-on-primary py-3.5 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REFLECTION'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default GuestReviews;
