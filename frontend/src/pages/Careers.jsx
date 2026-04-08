import { motion } from 'framer-motion';
import { Briefcase, Heart, Rocket, Smile, Star } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function Careers() {
  const values = [
    { icon: Heart, title: 'Passion for Food', desc: 'We love what we do and the flavors we deliver.' },
    { icon: Rocket, title: 'Rapid Growth', desc: 'Opportunities to scale your skills in a fast-paced environment.' },
    { icon: Star, title: 'Excellence', desc: 'We never settle for second best in quality or design.' },
    { icon: Smile, title: 'Work-Life Balance', desc: 'Flexible culture that respects your personal time.' }
  ];

  const jobs = [
    { title: 'Senior Full Stack Engineer', dept: 'Engineering', type: 'Full-time' },
    { title: 'Artisan Chef (North Karnataka Specialty)', dept: 'Culinary', type: 'Contract' },
    { title: 'Growth Marketing Manager', dept: 'Marketing', type: 'Full-time' },
    { title: 'UI/UX Designer', dept: 'Design', type: 'Full-time' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="text-center space-y-6 mb-24">
          <Badge variant="primary">We are Hiring</Badge>
          <h1 className="font-display text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tight">
            Join the <span className="text-[var(--accent-strong)]">Flavor Revolution.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Help us preserve regional heritage while building the future of artisan food delivery. We are looking for dreamers, builders, and food lovers.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-32">
          {values.map((v, i) => (
            <div key={i} className="p-8 rounded-[var(--radius-2xl)] bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-white/5">
              <div className="h-12 w-12 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 mb-6 font-black">
                <v.icon size={22} />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">{v.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-4xl font-black text-gray-900 dark:text-white">Open <span className="text-[var(--accent-strong)]">Positions.</span></h2>
            <div className="h-px flex-1 mx-8 bg-black/5 dark:bg-white/5" />
            <Badge variant="primary">{jobs.length} roles</Badge>
          </div>

          <div className="grid gap-4">
            {jobs.map((job, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="group p-8 rounded-[var(--radius-xl)] bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                   <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <Briefcase size={24} />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-[var(--accent-strong)] transition-colors">{job.title}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400">{job.dept} • {job.type}</p>
                   </div>
                </div>
                <Button variant="outline" className="px-8 rounded-full font-black text-xs uppercase tracking-widest">
                  View Role
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Spontaneous Application */}
        <div className="mt-32 p-12 rounded-[var(--radius-3xl)] border-2 border-dashed border-gray-200 dark:border-white/10 text-center space-y-6">
          <h2 className="font-display text-3xl font-black text-gray-900 dark:text-white">Don't see your role?</h2>
          <p className="text-gray-500 font-medium">We are always looking for great talent. Send us your portfolio or CV and we'll keep you in mind.</p>
          <Button size="lg" className="rounded-full px-12 font-black text-sm uppercase tracking-widest">
            Send Spontaneous Application
          </Button>
        </div>
      </div>
    </div>
  );
}
