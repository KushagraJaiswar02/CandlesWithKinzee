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
import CollectionPage from './pages/CollectionPage';
import CollectionsPage from './pages/CollectionsPage';
import ProfilePage from './pages/AccountPage';
import CheckoutPage from './pages/CheckOutpage';
import NotFound from './pages/NotFound';
import EditProductPage from './pages/EditProductPage';

// Admin Page Imports
import DashboardOverview from './pages/admin/DashboardOverview';
import AnalyticsView from './pages/admin/AnalyticsView';
import OrdersManager from './pages/admin/OrdersManager';
import ProductsManager from './pages/admin/ProductsManager';
import LandingPageManager from './pages/admin/LandingPageManager';
import CollectionsManager from './pages/admin/CollectionsManager';
import CollectionEditor from './pages/admin/CollectionEditor';
import ComingSoon from './pages/admin/ComingSoon';

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
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collection/:slug" element={<CollectionPage />} />
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

                {/* New Collection Routes */}
                <Route path="collections" element={<CollectionsManager />} />
                <Route path="collections/new" element={<CollectionEditor />} />
                <Route path="collections/:id/edit" element={<CollectionEditor />} />

                {/* Unimplemented sidebar stubs */}
                <Route path="inventory" element={<ComingSoon title="Inventory" />} />
                <Route path="customers" element={<ComingSoon title="Customers" />} />
                <Route path="promotions" element={<ComingSoon title="Promotions" />} />
                <Route path="landing-page" element={<LandingPageManager />} />
                <Route path="settings" element={<ComingSoon title="Settings" />} />
              </Route>

              {/* Edit / Create Product — full page, outside admin shell */}
              <Route path="/admin/product/:id/edit" element={<AdminRoute><EditProductPage /></AdminRoute>} />

            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;