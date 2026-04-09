import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Company',
    links: [
      { label: 'Our Story', to: '/about' },
      { label: 'Meet the Team', to: '/team' },
      { label: 'Careers', to: '/careers' },
    ],
  },
  {
    title: 'Community Help',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Support Center', to: '/support' },
      { label: 'Common FAQs', to: '/faq' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-[var(--surface)] pt-20 pb-32 sm:pb-12 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-3 lg:gap-24 text-center lg:text-left">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-gradient)] text-lg font-bold text-white shadow-xl">
                M
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">Manemade</span>
            </Link>
            <p className="text-sm leading-8 text-[var(--text-muted)] max-w-sm mx-auto lg:mx-0 font-medium">
              We are on a mission to preserve the authentic soul of North Karnataka cuisine, delivering homemade artisan quality right to your doorstep.
            </p>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-strong)]">
                {section.title}
              </h4>
              <ul className="space-y-5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm font-bold text-[var(--text-secondary)] transition-all hover:text-[var(--accent-strong)] hover:pl-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-black/5 pt-10 dark:border-white/5 sm:flex-row">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
            © {new Date().getFullYear()} Manemade artisan food. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              <Phone size={14} className="text-[var(--accent-strong)]" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">
              <Mail size={14} className="text-[var(--accent-strong)]" />
              help@manemade.in
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
