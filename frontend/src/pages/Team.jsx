import { motion } from 'framer-motion';
import Badge from '../components/ui/Badge';

const team = [
  {
    name: 'Santosh Pujer',
    role: 'Lead Frontend Engineer',
    bio: 'Expert in React, Framer Motion, and crafting premium, high-performance web experiences.',
    initials: 'SP',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    name: 'Anusha Angadi',
    role: 'Lead Backend Engineer',
    bio: 'Architecture specialist focused on Spring Boot scalability, security, and database optimization.',
    initials: 'AA',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    name: 'Rajeshwari Hiremath',
    role: 'Lead Backend Engineer',
    bio: 'Performance enthusiast dedicated to high-availability APIs and seamless system integrations.',
    initials: 'RH',
    color: 'from-emerald-500 to-teal-600'
  },

  {
    name: 'Shambhavi Kandagal',
    role: 'Lead UI/UX Designer',
    bio: 'Creator of the ManeMade design language, balancing elegance with user-centric functionality.',
    initials: 'SK',
    color: 'from-fuchsia-500 to-rose-600'
  },
  {
    name: 'Rajeshwari Jeeragal',
    role: 'Lead UI/UX Designer',
    bio: 'Visual artist dedicated to perfecting the artisan aesthetic and cross-platform consistency.',
    initials: 'RJ',
    color: 'from-orange-500 to-amber-600'
  }
];

export default function Team() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="text-center space-y-4 mb-20">
          <Badge variant="primary">The Craftspersons</Badge>
          <h1 className="font-display text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight">
            Meet the <span className="text-[var(--accent-strong)] text-gradient">ManeMade Team.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium">
            A specialized group of engineers and designers dedicated to bringing the artisan flavors of North Karnataka to the digital age.
          </p>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative flex flex-col items-center"
            >
              {/* Avatar placeholder with initials and gradient */}
              <div className={`h-40 w-40 rounded-[var(--radius-2xl)] bg-gradient-to-br ${member.color} flex items-center justify-center text-4xl font-black text-white shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                {member.initials}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[var(--radius-2xl)]" />
              </div>

              <div className="mt-8 text-center space-y-2">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{member.name}</h3>
                <p className="text-sm font-black text-[var(--accent-strong)] uppercase tracking-[0.2em]">{member.role}</p>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs font-medium italic">
                  "{member.bio}"
                </p>
              </div>

            </motion.div>
          ))}
        </div>

        {/* Culture Section */}
        <div className="mt-32 p-12 rounded-[var(--radius-3xl)] bg-black text-white relative overflow-hidden">
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="primary">Our Culture</Badge>
              <h2 className="font-display text-4xl font-black leading-tight">Authenticity in every line of <span className="text-[var(--accent-strong)]">Code & Design.</span></h2>
              <p className="text-gray-400 leading-relaxed font-medium">
                We believe that building a food platform requires the same care as preparing a meal. We focus on details, performance, and user delight to ensure every interaction with ManeMade feels as warm as home.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-40 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] border border-white/10">Precision</div>
              <div className="h-40 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] border border-white/10">Heritage</div>
              <div className="h-40 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] border border-white/10">Scale</div>
              <div className="h-40 rounded-2xl bg-white/5 flex items-center justify-center text-xs font-black uppercase tracking-widest text-[var(--accent-strong)] border border-white/10">Emotion</div>
            </div>
          </div>

          {/* Abstract background decorative element */}
          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-[var(--accent-strong)]/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
