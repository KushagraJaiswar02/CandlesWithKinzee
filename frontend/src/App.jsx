import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Header'; // Your Navbar
import Footer from './components/Footer';

// Page Imports (You need to create these files in src/pages)
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListing';
import ProductDetailPage from './pages/ProductDetails';
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegistrationPage';
import ProfilePage from './pages/AccountPage';
import AdminDashboard from './pages/AdminPage';
import CheckoutPage from './pages/CheckOutpage';
import NotFound from './pages/NotFound';

function App() {
  return (
    // Wrap the entire app with the Router
    <Router>
      <div className="flex flex-col min-h-screen bg-beige font-sans">
        
        
        <Navbar />

        {/* Main content area - flex-grow ensures it takes available space */}
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shop" element={<ProductListingPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;