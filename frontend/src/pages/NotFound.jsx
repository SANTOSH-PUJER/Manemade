import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="rounded-[40px] border border-white/10 bg-white/70 p-12 text-center shadow-[var(--shadow-soft)] dark:bg-white/5">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
        <Compass size={24} />
      </div>
      <h1 className="mt-6 font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">The route you opened does not exist anymore. Use the main navigation to continue browsing.</p>
      <Link to="/" className="mt-8 inline-flex rounded-full bg-[var(--accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)]">Back home</Link>
    </div>
  );
}

export default NotFound;
