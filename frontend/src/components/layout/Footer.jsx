import { Instagram, MapPin, Phone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-gradient)] text-white shadow-[var(--shadow-soft)]">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">Manemade</p>
              <p className="text-sm text-[var(--text-muted)]">North Karnataka cuisine, delivered beautifully.</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-7 text-[var(--text-secondary)]">
            A premium food delivery experience for regional comfort dishes, crafted with the warmth of home kitchens and the polish of a modern product.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Explore</p>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <Link className="block transition hover:text-[var(--text-primary)]" to="/">Home</Link>
            <Link className="block transition hover:text-[var(--text-primary)]" to="/shop">Menu</Link>
            <Link className="block transition hover:text-[var(--text-primary)]" to="/cart">Cart</Link>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">Contact</p>
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p className="flex items-center gap-2"><MapPin size={16} />Hubballi, Karnataka</p>
            <p className="flex items-center gap-2"><Phone size={16} />+91 98765 43210</p>
            <p className="flex items-center gap-2"><Instagram size={16} />@manemade.kitchen</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
