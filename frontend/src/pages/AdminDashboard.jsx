import { BarChart3, Package, ShieldCheck, Users } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';

const tiles = [
  { label: 'Orders today', value: '128', icon: Package },
  { label: 'Active chefs', value: '36', icon: Users },
  { label: 'Fulfillment score', value: '98%', icon: ShieldCheck },
  { label: 'Revenue trend', value: '+22%', icon: BarChart3 },
];

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <SectionHeading eyebrow="Admin" title="A cleaner admin overview card system" description="The main redesign target is customer-facing UI, but the admin route now follows the same premium design language." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ label, value, icon: Icon }) => (
          <article key={label} className="rounded-[32px] border border-white/10 bg-white/70 p-6 shadow-[var(--shadow-soft)] dark:bg-white/5">
            <div className="inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]"><Icon size={18} /></div>
            <p className="mt-5 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{label}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
