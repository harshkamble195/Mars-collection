import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Route Guards
const CustomerRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest text-gray-400">Authenticating...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest text-gray-400">Authenticating...</div>;
  return isAuthenticated && isAdmin ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-beige-50 text-luxury-charcoal dark:bg-luxury-black dark:text-white transition-colors duration-300">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductDetailsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Customer Protected Routes */}
                    <Route
                      path="/checkout"
                      element={
                        <CustomerRoute>
                          <CheckoutPage />
                        </CustomerRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <CustomerRoute>
                          <DashboardPage />
                        </CustomerRoute>
                      }
                    />

                    {/* Admin Protected Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
