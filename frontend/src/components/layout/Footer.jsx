import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Team', to: '/team' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
      { label: 'Privacy Policy', to: '/privacy' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Support', to: '/support' },
      { label: 'FAQs', to: '/faq' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-[var(--surface)] pt-20 pb-12 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent-gradient)] text-sm font-bold text-white shadow-md">
                M
              </div>
              <span className="font-display text-2xl font-bold tracking-tight text-[var(--text-primary)]">Manemade</span>
            </Link>
            <p className="text-sm leading-7 text-[var(--text-muted)] max-w-xs">
              Delivering the authentic soul of North Karnataka cuisine right to your doorstep with premium packaging and artisan quality.
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-black/5 text-[var(--text-secondary)] transition-all hover:bg-[var(--accent-strong)] hover:text-white hover:shadow-lg dark:border-white/5">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {sections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-[var(--text-primary)]">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--accent-strong)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-black/5 pt-8 dark:border-white/5 sm:flex-row">
          <p className="text-xs font-medium text-[var(--text-muted)]">
            © {new Date().getFullYear()} Manemade Food Delivery. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Phone size={14} className="text-[var(--accent-strong)]" />
              +91 98765 43210
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Mail size={14} className="text-[var(--accent-strong)]" />
              help@manemade.in
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
