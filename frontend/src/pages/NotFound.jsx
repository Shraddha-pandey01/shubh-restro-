import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';

export const NotFound = () => {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-48 pb-24 px-6 flex items-center justify-center text-center">
        <div className="max-w-lg glass-panel p-12 border-primary/30">
          <span className="font-mono text-5xl md:text-7xl text-primary font-bold tracking-widest block mb-4">
            404
          </span>
          <span className="font-label-caps text-xs text-primary tracking-[0.3em] uppercase block mb-2">
            Lost in Shadow
          </span>
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface mb-4">
            Sanctuary Not Found
          </h1>
          <p className="font-body text-sm text-on-surface-variant mb-8 font-light leading-relaxed">
            The vintage, composition, or private alcove you seek has retreated into the ether.
          </p>

          <Link
            to="/"
            className="inline-block font-label-caps text-xs bg-primary text-on-primary px-8 py-3.5 rounded-none uppercase tracking-widest font-semibold hover:bg-primary-fixed transition-colors"
          >
            Return to ShubhRestro
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
