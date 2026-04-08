import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import ProtectedRoute from './components/routes/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import FoodDetails from './pages/FoodDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Profile from './pages/Profile';
import Shop from './pages/Shop';
import CategoryManagement from './pages/CategoryManagement';
import ItemManagement from './pages/ItemManagement';
import OrderManagement from './pages/OrderManagement';
import UserManagement from './pages/UserManagement';
import AdminSettings from './pages/AdminSettings';
import PaymentManagement from './pages/PaymentManagement';

import useAnalytics from './hooks/useAnalytics';
import { useEffect } from 'react';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: 'easeOut' },
};

function wrap(element) {
  return <motion.div {...pageTransition}>{element}</motion.div>;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent('PAGE_VIEW', { path: location.pathname });
  }, [location.pathname, trackEvent]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrap(<LandingPage />)} />
        <Route path="/shop" element={wrap(<Shop />)} />
        <Route path="/categories" element={wrap(<Shop />)} />
        <Route path="/dish/:slug" element={wrap(<FoodDetails />)} />
        <Route path="/checkout" element={wrap(<ProtectedRoute><Checkout /></ProtectedRoute>)} />
        <Route path="/orders" element={wrap(<ProtectedRoute><Orders /></ProtectedRoute>)} />
        <Route path="/order-success" element={wrap(<ProtectedRoute><OrderSuccess /></ProtectedRoute>)} />
        <Route path="/login" element={wrap(<Auth mode="login" />)} />
        <Route path="/register" element={wrap(<Auth mode="register" />)} />
        <Route path="/profile" element={wrap(<ProtectedRoute><Profile /></ProtectedRoute>)} />
        <Route path="/forgot-password" element={wrap(<ForgotPassword />)} />
        <Route path="/reset-password" element={wrap(<ResetPassword />)} />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            {wrap(<AdminDashboard />)}
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={wrap(<Auth adminOnly />)} />
        <Route path="/admin/categories" element={wrap(<ProtectedRoute adminOnly><CategoryManagement /></ProtectedRoute>)} />
        <Route path="/admin/items" element={wrap(<ProtectedRoute adminOnly><ItemManagement /></ProtectedRoute>)} />
        <Route path="/admin/orders" element={wrap(<ProtectedRoute adminOnly><OrderManagement /></ProtectedRoute>)} />
        <Route path="/admin/users" element={wrap(<ProtectedRoute adminOnly><UserManagement /></ProtectedRoute>)} />
        <Route path="/admin/settings" element={wrap(<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>)} />
        <Route path="/admin/payments" element={wrap(<ProtectedRoute adminOnly><PaymentManagement /></ProtectedRoute>)} />
        <Route path="*" element={wrap(<NotFound />)} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AppShell>
      <AnimatedRoutes />
    </AppShell>
  );
}

export default App;
