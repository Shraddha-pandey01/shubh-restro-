import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import api from '../services/api.js';

export const Home = () => {
  const [highlights, setHighlights] = useState([]);

  const FALLBACK_HIGHLIGHTS = [
    {
      _id: 'hl_demo_1',
      name: 'Paneer Tikka',
      category: 'Starters',
      price: 280,
      description: 'Char-grilled cottage cheese cubes marinated in spiced hung yogurt, mustard oil, and carom seeds.',
      imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      _id: 'hl_demo_2',
      name: 'Butter Chicken (Murgh Makhani)',
      category: 'Main Course',
      price: 380,
      description: 'Charred tandoori chicken medallions steeped in a velvet tomato, cashew, and churned butter gravy.',
      imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    },
    {
      _id: 'hl_demo_3',
      name: 'Awadhi Mutton Biryani',
      category: 'Biryani & Rice',
      price: 440,
      description: 'Lucknowi-style kacchi dum basmati layered with succulent cuts of marinated young lamb and saffron.',
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await api.get('/menu');
        if (res.success && res.data && res.data.length > 0) {
          setHighlights(res.data.slice(0, 3));
        } else {
          setHighlights(FALLBACK_HIGHLIGHTS);
        }
      } catch {
        setHighlights(FALLBACK_HIGHLIGHTS);
      }
    };
    fetchHighlights();
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="bg-cover bg-center w-full h-full opacity-50 scale-105 transition-transform duration-1000"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-8 mt-24">
          <h1 className="font-display-lg text-4xl md:text-7xl lg:text-8xl text-on-surface max-w-5xl mx-auto leading-tight">
            A Symphony of <span className="text-primary italic font-light">Taste</span> and Shadow
          </h1>
          <p className="font-body text-base md:text-xl text-on-surface-variant max-w-2xl mx-auto font-light leading-relaxed">
            Experience culinary artistry in an atmosphere designed for the discerning. ShubhRestro offers an exclusive journey through authentic Indian gastronomy, featuring both exquisite vegetarian delicacies and royal non-vegetarian preparations.
          </p>
          <div className="flex flex-wrap gap-5 justify-center mt-4">
            <Link
              to="/book-a-table"
              className="inline-block font-label-caps text-xs md:text-sm bg-primary text-on-primary px-10 py-4 rounded-none hover:bg-secondary-fixed transition-colors uppercase tracking-widest font-semibold"
            >
              Reserve Now
            </Link>
            <Link
              to="/menu"
              className="inline-block font-label-caps text-xs md:text-sm border border-primary/40 text-primary px-10 py-4 rounded-none hover:bg-primary/10 transition-colors uppercase tracking-widest"
            >
              View Tasting Menu
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-primary/50">
          <span className="material-symbols-outlined text-3xl">keyboard_arrow_down</span>
        </div>
      </section>

      {/* The Art of Dining Section */}
      <section className="py-24 md:py-section-gap px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="col-span-1 md:col-span-6 flex flex-col gap-6 order-2 md:order-1">
              <h2 className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
                The Art of Dining
              </h2>
              <h3 className="font-headline text-3xl md:text-5xl text-on-surface leading-tight">
                Where Every Detail <br />
                <span className="italic text-on-surface-variant font-light">Tells a Story</span>
              </h3>
              <p className="font-body text-base text-on-surface-variant leading-relaxed mb-4">
                Our philosophy is rooted in the interplay of light and dark, both in our ambiance and our ingredients. We source the rarest provisions to construct dishes that challenge expectations while comforting the soul.
              </p>
              <div>
                <Link
                  to="/menu"
                  className="inline-block font-label-caps text-xs text-primary border border-primary/50 px-8 py-3 hover:bg-primary/10 transition-colors uppercase tracking-wider"
                >
                  Explore Philosophy & Menu
                </Link>
              </div>
            </div>

            <div className="col-span-1 md:col-span-6 order-1 md:order-2">
              <div className="relative w-full aspect-[4/5] glass-panel p-3">
                <div
                  className="bg-cover bg-center w-full h-full grayscale-[15%] hover:grayscale-0 transition-all duration-700"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80')",
                  }}
                ></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 border border-primary/20 pointer-events-none hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Epicurean Highlights */}
      {highlights.length > 0 && (
        <section className="py-24 px-margin-mobile md:px-margin-desktop bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
                Epicurean Highlights
              </span>
              <h2 className="font-headline text-3xl md:text-5xl text-on-surface mt-3">
                Signature Creations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {highlights.map((item) => (
                <div key={item._id} className="glass-panel group overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-4 right-4 bg-background/90 text-primary text-xs font-semibold px-3 py-1 border border-primary/30">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="font-label-caps text-[10px] text-primary uppercase tracking-widest">
                        {item.category}
                      </span>
                      <h3 className="font-headline text-xl text-on-surface mt-1 mb-2">
                        {item.name}
                      </h3>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between">
                      <Link
                        to={`/menu/${item._id}`}
                        className="text-xs font-label-caps text-primary hover:underline uppercase tracking-wider flex items-center gap-1"
                      >
                        View Notes <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reservation Invitation CTA */}
      <section className="relative py-28 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest text-center overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center gap-6">
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase">
            An Unforgettable Evening
          </span>
          <h2 className="font-headline text-3xl md:text-5xl text-on-surface">
            Secure Your Table at <span className="font-brand text-primary">ShubhRestro</span>
          </h2>
          <p className="font-body text-base text-on-surface-variant max-w-xl font-light">
            Due to our intimate setting and bespoke culinary preparation, we recommend reserving your dining experience in advance.
          </p>
          <Link
            to="/book-a-table"
            className="mt-4 font-label-caps text-sm bg-primary text-on-primary px-10 py-4 rounded-none hover:bg-primary-fixed transition-colors uppercase tracking-widest font-semibold"
          >
            Reserve Table
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
