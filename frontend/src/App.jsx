import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));

function PublicLayout({ children }) {
  const { loading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner text="Loading..." />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
            <Route path="/products" element={<PublicLayout><ProductList /></PublicLayout>} />
            <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />


            {/* Policy Pages */}
            <Route path="/shipping-policy" element={<PublicLayout><PolicyPage type="shipping" /></PublicLayout>} />
            <Route path="/return-policy" element={<PublicLayout><PolicyPage type="returns" /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><PolicyPage type="faq" /></PublicLayout>} />
            <Route path="/privacy-policy" element={<PublicLayout><PolicyPage type="privacy" /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><PolicyPage type="terms" /></PublicLayout>} />

            {/* Protected Routes */}
            <Route path="/cart" element={<PublicLayout><ProtectedRoute><Cart /></ProtectedRoute></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><ProtectedRoute><Checkout /></ProtectedRoute></PublicLayout>} />
            <Route path="/profile" element={<PublicLayout><ProtectedRoute><Profile /></ProtectedRoute></PublicLayout>} />
            <Route path="/orders" element={<PublicLayout><ProtectedRoute><OrderHistory /></ProtectedRoute></PublicLayout>} />
            <Route path="/orders/:id" element={<PublicLayout><ProtectedRoute><OrderDetail /></ProtectedRoute></PublicLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
