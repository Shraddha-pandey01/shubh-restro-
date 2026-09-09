import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';

export const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const categories = ['All', 'Ambiance', 'Dishes', 'Beverages', 'Private Dining', 'Events'];

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const query = selectedCategory !== 'All' ? `?category=${selectedCategory}` : '';
        const res = await api.get(`/gallery${query}`);
        if (res.success) {
          setImages(res.data);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedCategory]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="pt-36 pb-12 px-6 lg:px-margin-desktop text-center bg-surface-container-lowest border-b border-primary/20">
        <div className="max-w-3xl mx-auto">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            Visual Anthology
          </span>
          <h1 className="font-headline text-4xl md:text-6xl text-on-surface mt-2 mb-4">
            The Gallery
          </h1>
          <p className="font-body text-sm md:text-base text-on-surface-variant font-light leading-relaxed">
            Moments captured in amber light and deep charcoal shadow. Explore the culinary theatre and architecture of ShubhRestro.
          </p>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`font-label-caps text-xs px-5 py-2 uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container border border-primary/20 text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="flex-1 py-16 px-6 lg:px-margin-desktop max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="py-24 text-center text-primary font-headline text-lg animate-pulse">
            DEVELOPING VISUAL ARCHIVE...
          </div>
        ) : images.length === 0 ? (
          <div className="py-24 text-center text-on-surface-variant font-body">
            No photographs available under this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img._id}
                onClick={() => setActiveImage(img)}
                className="glass-panel group overflow-hidden cursor-pointer relative aspect-[4/3] transition-all hover:border-primary/50"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'ShubhRestro Dining'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest mb-1">
                    {img.category}
                  </span>
                  <p className="font-headline text-sm text-on-surface">
                    {img.caption || 'ShubhRestro Gastronomy'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="max-w-4xl w-full bg-surface border border-primary/30 p-2 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 text-on-surface hover:text-primary p-2 bg-black/70"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            <img
              src={activeImage.imageUrl}
              alt={activeImage.caption}
              className="w-full max-h-[75vh] object-contain"
            />
            {activeImage.caption && (
              <div className="p-4 text-center">
                <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest block mb-1">
                  {activeImage.category}
                </span>
                <p className="font-headline text-base text-on-surface">
                  {activeImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
