import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  isHoverable = true,
  isInteractive = false,
  ...props
}) {
  const Component = isInteractive ? motion.button : motion.div;

  return (
    <Component
      whileHover={isHoverable ? { y: -6, transition: { duration: 0.3, ease: 'easeOut' } } : {}}
      className={`
        overflow-hidden rounded-[var(--radius-lg)] border border-black/8 bg-gray-100 text-gray-900 shadow-[var(--shadow-soft)] transition-all duration-300 dark:border-white/8 dark:bg-gray-800 dark:text-white
        ${isHoverable ? 'hover:shadow-[var(--shadow-strong)]' : ''}
        ${isInteractive ? 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-[var(--accent-strong)]/10' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  );
}

Card.Header = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

Card.Content = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-black/8 p-6 dark:border-white/8 ${className}`}>
    {children}
  </div>
);
