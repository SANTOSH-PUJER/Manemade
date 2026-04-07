import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import Navbar from './Navbar';

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,_rgba(255,107,0,0.15),_transparent_70%)] blur-3xl" />
        <div className="absolute right-[-10%] top-[20%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,_rgba(255,160,0,0.1),_transparent_70%)] blur-3xl" />
      </div>
      <Navbar />
      <main className="mx-auto min-h-[calc(100vh-12rem)] max-w-7xl px-4 pb-32 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-32 bg-white dark:bg-gray-900 transition-colors duration-500">
        {children}
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default AppShell;
