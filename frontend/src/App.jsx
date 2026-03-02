import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Imports
import MainLayout from './components/MainLayout';
import AdminLayout from './components/admin/AdminLayout';

// Page Imports
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListing';
import ProductDetailPage from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import ProfilePage from './pages/AccountPage';
import CheckoutPage from './pages/CheckOutpage';
import NotFound from './pages/NotFound';

// Admin Page Imports
import DashboardOverview from './pages/admin/DashboardOverview';
import AnalyticsView from './pages/admin/AnalyticsView';
import OrdersManager from './pages/admin/OrdersManager';
import ProductsManager from './pages/admin/ProductsManager';
import LandingPageManager from './pages/admin/LandingPageManager';

// Providers & Protections
import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>

              {/* Public & Customer Routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shop" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Panel Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }>
                <Route index element={<DashboardOverview />} />
                <Route path="analytics" element={<AnalyticsView />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="products" element={<ProductsManager />} />

                {/* Additional Placeholder Routes */}
                <Route path="collections" element={<div className="text-white p-4">Collections (WIP)</div>} />
                <Route path="inventory" element={<div className="text-white p-4">Inventory (WIP)</div>} />
                <Route path="customers" element={<div className="text-white p-4">Customers (WIP)</div>} />
                <Route path="promotions" element={<div className="text-white p-4">Promotions (WIP)</div>} />
                <Route path="landing-page" element={<LandingPageManager />} />
                <Route path="settings" element={<div className="text-white p-4">Settings (WIP)</div>} />
              </Route>

            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;