import { motion } from 'framer-motion';
import { ChefHat, History, Target, Users } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function About() {
  const features = [
    {
      icon: History,
      title: 'Our Heritage',
      description: 'Born from the rich culinary traditions of North Karnataka, ManeMade brings generations-old recipes to the modern table.'
    },
    {
      icon: ChefHat,
      title: 'Artisan Quality',
      description: 'Every dish is crafted by local experts using traditional methods and hand-picked local spices.'
    },
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To preserve regional food culture and provide the comfort of homemade meals to everyone, everywhere.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We empower local cooks and artisans, creating a sustainable ecosystem for traditional food craft.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] bg-black h-[500px]">
          <img 
            src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" 
            alt="ManeMade Story" 
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <Badge variant="primary" className="mb-6">The ManeMade Story</Badge>
            <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-tight max-w-4xl">
              Authentic Flavors, <br /> <span className="text-[var(--accent-strong)] text-gradient">Homemade Heart.</span>
            </h1>
          </div>
        </div>

        {/* Story Section */}
        <div className="mt-24 grid gap-16 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <h2 className="font-display text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Preserving the Soul of <span className="text-[var(--accent-strong)]">North Karnataka.</span>
            </h2>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              North Karnataka is legendary for its bold, spicy, and soul-satisfying cuisine. At ManeMade, we realized that these authentic flavors were becoming harder to find in the fast-paced modern world.
            </p>
            <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              We started as a small community initiative to connect busy professionals with local home-cooks who excel at regional classics like Jowar Roti, Enne Gai, and various authentic masalas. Today, we are a premium food delivery platform that stands for quality, heritage, and the unmatched warmth of a homemade meal.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1596797038530-2c39bb05057a?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-64 w-full object-cover shadow-xl" />
                <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-48 w-full object-cover shadow-xl" />
             </div>
             <div className="pt-8 space-y-4">
                <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-48 w-full object-cover shadow-xl" />
                <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" className="rounded-2xl h-64 w-full object-cover shadow-xl" />
             </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[var(--radius-xl)] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5 transition-all"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--accent-gradient)] flex items-center justify-center text-white mb-6 shadow-lg">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-black mb-3 text-gray-900 dark:text-white uppercase tracking-tight">{feature.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
