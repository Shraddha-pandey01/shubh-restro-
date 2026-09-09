import { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import api from '../../services/api.js';

export const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('Dishes');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await api.get('/gallery');
      if (res.success) {
        setImages(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photograph from the gallery archive?')) {
      return;
    }
    try {
      const res = await api.delete(`/gallery/${id}`);
      if (res.success) {
        setImages((prev) => prev.filter((img) => img._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete image:', err);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const res = await api.post('/gallery', {
        imageUrl,
        caption,
        category,
      });

      if (res.success && res.data) {
        setImages((prev) => [res.data, ...prev]);
        setImageUrl('');
        setCaption('');
        setModalOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Gallery Management">
      <div className="space-y-6">
        {/* Actions bar */}
        <div className="glass-panel p-4 flex justify-between items-center">
          <div className="font-label-caps text-xs text-primary font-semibold">
            {images.length} {images.length === 1 ? 'Photograph' : 'Photographs'} in Anthology
          </div>
          <button
            onClick={() => {
              setError('');
              setModalOpen(true);
            }}
            className="font-label-caps text-xs bg-primary text-on-primary px-5 py-2.5 uppercase tracking-wider font-semibold hover:bg-primary-fixed flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">add_photo_alternate</span>
            Add Photograph
          </button>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            LOADING PHOTOGRAPHY ARCHIVE...
          </div>
        ) : images.length === 0 ? (
          <div className="glass-panel p-12 text-center text-on-surface-variant text-xs">
            No photographs found in gallery.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img._id} className="glass-panel overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-[4/3]">
                  <img
                    src={img.imageUrl}
                    alt={img.caption || 'Gallery item'}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-surface-container-lowest/80 text-primary text-[10px] font-label-caps px-2 py-0.5 uppercase tracking-wider">
                    {img.category}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="font-body text-xs text-on-surface line-clamp-2 mb-3">
                    {img.caption || 'No caption entered'}
                  </p>
                  <div className="pt-3 border-t border-white/5 flex justify-end">
                    <button
                      onClick={() => handleDelete(img._id)}
                      className="font-label-caps text-[11px] text-error hover:underline uppercase flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Photograph Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-panel p-8 relative border-primary animate-fadeIn">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <span className="font-label-caps text-xs text-primary tracking-widest uppercase block mb-1">
              Visual Archive
            </span>
            <h2 className="font-headline text-2xl text-on-surface mb-6">
              Add Photograph
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-error/10 border border-error text-error text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleAddImage} className="space-y-4">
              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                >
                  {['Ambiance', 'Dishes', 'Beverages', 'Private Dining', 'Events'].map((cat) => (
                    <option key={cat} value={cat} className="bg-surface text-on-surface">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-label-caps text-[11px] text-primary uppercase tracking-wider mb-1">
                  Caption / Title
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Ambient lighting in the Main Dining Hall"
                  className="w-full bg-surface-container-low border-b border-primary/40 px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="font-label-caps text-xs border border-white/20 text-on-surface px-5 py-2 uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="font-label-caps text-xs bg-primary text-on-primary px-6 py-2 uppercase font-semibold hover:bg-primary-fixed disabled:opacity-50"
                >
                  {isSaving ? 'ARCHIVING...' : 'SAVE PHOTOGRAPH'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default GalleryManagement;
