import { Clock3, MapPin, PackageCheck, Star } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { dishes } from '../data/catalog';

const recentOrders = [
  { id: 'MM1024', item: 'Jolada Rotti Signature Meal', date: 'Mar 30', status: 'Delivered', total: 'Rs. 237' },
  { id: 'MM1021', item: 'Dharwad Peda Premium Box', date: 'Mar 28', status: 'Delivered', total: 'Rs. 249' },
  { id: 'MM1018', item: 'Ennegayi Curry Bowl', date: 'Mar 27', status: 'On the way', total: 'Rs. 169' },
];

const savedAddresses = [
  { label: 'Home', address: '1st Block, Rajajinagar, Bengaluru 560010', note: 'Primary delivery address' },
  { label: 'Work', address: 'MG Road, Ashok Nagar, Bengaluru 560001', note: 'Use for lunch-hour deliveries' },
];

function Profile() {
  const { user } = useAuth();
  const profileName = user ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Guest user';

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] border border-white/10 bg-[var(--accent-gradient)] p-8 text-white shadow-[var(--shadow-strong)]">
          <p className="text-xs uppercase tracking-[0.24em] text-white/70">Profile overview</p>
          <h1 className="mt-4 font-display text-4xl font-semibold">{profileName}</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-white/85">The profile page is redesigned into a calm account hub with premium cards, address management space, and a clear order history overview.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur"><PackageCheck size={18} /><p className="mt-3 text-2xl font-semibold">12</p><p className="text-sm text-white/75">Orders placed</p></div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur"><Clock3 size={18} /><p className="mt-3 text-2xl font-semibold">24 min</p><p className="text-sm text-white/75">Avg delivery</p></div>
            <div className="rounded-[24px] bg-white/12 p-4 backdrop-blur"><Star size={18} /><p className="mt-3 text-2xl font-semibold">4.9</p><p className="text-sm text-white/75">Satisfaction</p></div>
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <SectionHeading eyebrow="Favorite picks" title="Recommended from your taste history" description="This side panel can later be fed from real order analytics, but the UI is already structured to support it cleanly." />
          <div className="mt-6 grid gap-4">
            {dishes.slice(0, 3).map((dish) => (
              <div key={dish.id} className="flex items-center gap-4 rounded-[24px] bg-[var(--surface-muted)] p-4">
                <img src={dish.image} alt={dish.name} className="h-20 w-20 rounded-[18px] object-cover" />
                <div>
                  <p className="font-semibold">{dish.name}</p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{dish.category}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">Rs. {dish.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[36px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <SectionHeading eyebrow="Orders" title="Order history" description="Recent orders now use clearer status chips, spacing, and aligned values for an easier account experience." />
          <div className="mt-6 space-y-4">
            {recentOrders.map((order) => (
              <article key={order.id} className="rounded-[26px] bg-[var(--surface-muted)] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{order.id}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{order.item}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{order.date}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{order.status}</span>
                    <p className="mt-3 text-xl font-semibold">{order.total}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[36px] border border-white/10 bg-white/70 p-8 shadow-[var(--shadow-soft)] dark:bg-white/5">
          <SectionHeading eyebrow="Addresses" title="Saved delivery locations" description="The address cards are structured for future edit, delete, and default-state actions." />
          <div className="mt-6 space-y-4">
            {savedAddresses.map((address) => (
              <article key={address.label} className="rounded-[26px] bg-[var(--surface-muted)] p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white/75 p-3 dark:bg-white/10"><MapPin size={18} className="text-[var(--accent-strong)]" /></div>
                  <div>
                    <p className="font-semibold">{address.label}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{address.address}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{address.note}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
