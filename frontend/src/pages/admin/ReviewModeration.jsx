import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';

export const ReviewModeration = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reviews/admin/all?status=${statusFilter}`);
      if (res.success) {
        setReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews for moderation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/reviews/${id}/status`, { status: newStatus });
      if (res.success && res.data) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? res.data : r))
        );
      }
    } catch (err) {
      console.error('Failed to moderate review:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this review critique?')) {
      return;
    }
    try {
      const res = await api.delete(`/reviews/${id}`);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  };

  return (
    <AdminLayout title="Review Moderation">
      <div className="space-y-6">
        {/* Filters */}
        <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'hidden'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`font-label-caps text-xs px-4 py-2 uppercase tracking-wider transition-colors ${
                  statusFilter === st
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <span className="font-label-caps text-xs text-primary font-semibold">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'} in Registry
          </span>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            AUDITING GUEST CRITIQUES...
          </div>
        ) : reviews.length === 0 ? (
          <div className="glass-panel p-12 text-center text-on-surface-variant text-xs">
            No reviews found under "{statusFilter}".
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="glass-panel p-6 flex flex-col md:flex-row justify-between items-start gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-label-caps text-xs text-primary font-semibold uppercase">
                      {rev.guestName}
                    </span>
                    <span className="text-[11px] text-on-surface-variant/50">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`font-label-caps text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                        rev.status === 'approved'
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : rev.status === 'hidden'
                          ? 'bg-surface-container text-on-surface-variant/40'
                          : 'bg-amber-900/30 text-amber-300 border border-amber-600/40'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </div>

                  <div className="flex text-primary">
                    {[...Array(rev.rating)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm">
                        star
                      </span>
                    ))}
                  </div>

                  <p className="font-body text-xs text-on-surface italic leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                {/* Moderation Actions */}
                <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
                  {rev.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev._id, 'approved')}
                      className="font-label-caps text-[10px] bg-primary text-on-primary px-3 py-1.5 uppercase font-semibold hover:bg-primary-fixed"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'hidden' && (
                    <button
                      onClick={() => handleUpdateStatus(rev._id, 'hidden')}
                      className="font-label-caps text-[10px] border border-white/20 text-on-surface px-3 py-1.5 uppercase hover:border-primary"
                    >
                      Hide
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(rev._id)}
                    className="font-label-caps text-[10px] text-error hover:underline px-2 uppercase"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReviewModeration;
