import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import Navbar from './Navbar';

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-5%] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(255,120,76,0.22),_transparent_70%)] blur-2xl" />
        <div className="absolute right-[-10%] top-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(255,198,116,0.18),_transparent_72%)] blur-2xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,87,34,0.14),_transparent_68%)] blur-2xl" />
      </div>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-12rem)] max-w-7xl px-4 pb-28 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-28">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default AppShell;
