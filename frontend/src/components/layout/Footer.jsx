import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="relative w-full bg-surface-container-lowest border-t border-primary/20 flex flex-col items-center gap-6 px-6 lg:px-margin-desktop py-16 text-center">
      <div className="font-['Playfair_Display'] text-3xl md:text-4xl text-primary tracking-[0.08em]">
        ShubhRestro
      </div>
      <div className="font-label-caps text-xs text-primary tracking-[0.25em] uppercase font-semibold">
        Resturant by Shraddha pandey
      </div>
      <p className="font-body text-sm text-on-surface-variant max-w-md">
        An authentic celebration of royal Indian gastronomy. Crafted for the discerning epicurean.
      </p>
      <div className="flex flex-wrap justify-center gap-6 my-4">
        <Link to="/menu" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors">
          Menu
        </Link>
        <Link to="/book-a-table" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors">
          Reservations
        </Link>
        <Link to="/gallery" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors">
          Gallery
        </Link>
        <Link to="/reviews" className="font-body-md text-sm text-on-surface-variant hover:text-primary transition-colors">
          Guest Reviews
        </Link>
        <Link to="/admin/login" className="font-body-md text-sm text-outline hover:text-primary transition-colors">
          Admin Portal
        </Link>
      </div>
      <div className="flex flex-col items-center gap-1 font-body text-xs text-on-surface-variant/60 tracking-widest uppercase mt-4">
        <span className="text-primary/80">Resturant by Shraddha pandey</span>
        <span>© 2026 ShubhRestro. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
};

export default Footer;
