// 

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';



// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import RegisterVendeur from './components/auth/RegisterVendeur';

// Composants principaux
import Home from './components/Home';
import About from './components/About';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
import HomePage from './pages/HomePage';

// Composants produits
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import ProduitsByCategorie from './components/products/ProduitsByCategorie';
import HomeProducts from './components/products/HomeProducts';
import HomeCategoryPreview from './components/products/HomeCategoryPreview'


import PaymentForm from './components/payment/PaymentForm';

// Composants acheteur
import Dashboard from './components/acheteur/Dashboard';
import Profile from './components/acheteur/Profile';
import Orders from './components/acheteur/Orders';
import Wishlist from './components/acheteur/Wishlist';
import Addresses from './components/acheteur/Addresses';
import Invoice from './components/acheteur/Invoice';
import PromotionSection from './components/acheteur/PromotionSection';


import OrderHistory from './components/orders/OrderHistory';
import Checkout from './components/checkout/Checkout';

// Composants vendeur
import VendeurDashboard from './components/vendeur/Dashboard';
import VendorProducts from './components/vendeur/VendorProducts';
import ProductForm from './components/vendeur/AddProduct';
import VendorOrders from './components/vendeur/VendorOrders';
import VendorCustomers from './components/vendeur/VendorCustomers';
import VendorReviews from './components/vendeur/VendorReviews';
import VendorAnalytics from './components/vendeur/VendorAnalytics';
import VendorSettings from './components/vendeur/VendorSettings';
import VendorPromotions from './components/vendeur/VendorPromotions';
import CampaignCreatePage from './components/vendeur/CampaignCreatePage';
import VendorCampaignsPage from './components/vendeur/VendorCampaignsPage';

// Composants admin
import AdminDashboard from './components/admin/Dashboard';
import CategorieAdmin from './components/admin/CategoryAdmin';
import OrderDetail from './components/admin/OrderDetail';
import OrderList from './components/admin/OrderList';
import UserList from './components/admin/UserList';
import ProductManagement from './components/admin/ProductManagement';
import AdminProductList from './components/admin/AdminProductList';
import VendorManagement from './components/admin/VendorManagement';
import AdminStatistics from './components/admin/AdminStatistics';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        
        <main className="min-vh-100">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/produit-par-categorie" element={<HomeCategoryPreview />} />
            <Route path="/promotions-page" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registervendeur" element={<RegisterVendeur />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/about" element={<About />} />
            
             <Route path="/categorie/:nom" element={<ProduitsByCategorie />} />
            <Route path="/produits/:id" element={<ProductDetail />} />
             <Route path="/produits" element={<HomeProducts />} />
            <Route path="/promotions/:type" element={<ProductList />} />

            {/* Routes protégées pour les acheteurs */}
            <Route element={<ProtectedRoute requiredRole="acheteur" />}>
              
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/acheteur/dashboard" element={<Dashboard />} />
              <Route path="/acheteur/promotion-liste" element={<PromotionSection />} />
              <Route path="/acheteur/profile" element={<Profile />} />
              <Route path="/acheteur/orders" element={<Orders />} />
              <Route path="/acheteur/orders/:orderId/invoice" element={<Invoice />} />
              <Route path="/acheteur/wishlist" element={<Wishlist />} />
              <Route path="/acheteur/orders/:orderId/payment" element={<PaymentForm />} />
              <Route path="/acheteur/addresses" element={<Addresses />} />
              <Route path="/payment" element={<PaymentForm />} />
            </Route>

            {/* Routes spécifiques aux vendeurs */}
            <Route element={<ProtectedRoute requiredRole="vendeur" />}>
              <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
              <Route path="/vendeur/products" element={<VendorProducts />} />
              <Route path="/vendeur/products/add" element={<ProductForm />} />
              <Route path="/vendeur/products/edit/:productId" element={<ProductForm />} />
              <Route path="/vendeur/orders" element={<VendorOrders />} />
              <Route path="/vendeur/orders/:orderId" element={<VendorOrders />} />
              <Route path="/vendeur/customers" element={<VendorCustomers />} />
              <Route path="/vendeur/reviews" element={<VendorReviews />} />
              <Route path="/vendeur/analytics" element={<VendorAnalytics />} />
              <Route path="/vendeur/settings" element={<VendorSettings />} />
              <Route path="/vendeur/campaigns_form" element={<CampaignCreatePage />} />
              <Route path="/vendeur/campaigns_list" element={<VendorCampaignsPage />} />
              <Route path="/vendeur/promotions" element={<VendorPromotions />} />
            </Route>

            {/* Routes spécifiques aux administrateurs */}
            <Route element={<ProtectedRoute requiredRole="administrateur" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategorieAdmin />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/products" element={<AdminProductList />} />
              <Route path="/admin/products-management" element={<ProductManagement />} />
              <Route path="/admin/vendors" element={<VendorManagement />} />
              <Route path="/admin/statistics" element={<AdminStatistics />} />
            </Route>

            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <ToastContainer position="bottom-right" />
      </Router>
    </AuthProvider>
  );
};

export default App;