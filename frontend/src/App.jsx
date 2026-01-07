import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Component Imports
import Navbar from './components/Header';
import Footer from './components/Footer';

// Page Imports
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListing';
import ProductDetailPage from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import ProfilePage from './pages/AccountPage';
import AdminDashboard from './pages/AdminPage';
import EditProductPage from './pages/EditProductPage';
import CheckoutPage from './pages/CheckOutpage';
import AdminRoute from './components/AdminRoute';
import NotFound from './pages/NotFound';

// Toast Provider
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen bg-beige font-sans">

              <Navbar />

              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/shop" element={<ProductListingPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/product/:id/edit" element={
                    <AdminRoute>
                      <EditProductPage />
                    </AdminRoute>
                  } />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>

              <Footer />

            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;