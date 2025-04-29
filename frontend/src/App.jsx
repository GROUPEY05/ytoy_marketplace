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

// Composants produits
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import ProduitsByCategorie from './components/products/ProduitsByCategorie';

// Composants acheteur
import Dashboard from './components/Acheteur/Dashboard';
import Cart from './components/cart/Cart';
import OrderHistory from './components/orders/OrderHistory';
import Checkout from './components/checkout/Checkout';

// Composants vendeur
import VendeurDashboard from './components/vendeur/Dashboard';
import VendorProducts from './components/vendeur/VendorProducts';
import ProductForm from './components/vendeur/AddProduct';

// Composants admin
import AdminDashboard from './components/admin/Dashboard';
import CategorieAdmin from './components/admin/CategoryAdmin';
import OrderDetail from './components/admin/OrderDetail';
import OrderList from './components/admin/OrderList';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        
        <main className="min-vh-100">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registervendeur" element={<RegisterVendeur />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/categories/:categorieId" element={<ProduitsByCategorie />} />
            <Route path="/product/:productId" element={<ProductDetail />} />

            {/* Routes protégées pour les acheteurs */}
            <Route element={<ProtectedRoute requiredRole="acheteur" />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/acheteur/dashboard" element={<Dashboard />} />
            </Route>

            {/* Routes spécifiques aux vendeurs */}
            <Route element={<ProtectedRoute requiredRole="vendeur" />}>
              <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
              <Route path="/vendeur/products" element={<VendorProducts />} />
              <Route path="/vendeur/products/add" element={<ProductForm />} />
              <Route path="/vendeur/products/edit/:productId" element={<ProductForm />} />
            </Route>

            {/* Routes spécifiques aux administrateurs */}
            <Route element={<ProtectedRoute requiredRole="administrateur" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<CategorieAdmin />} />
              <Route path="/admin/orders" element={<OrderList />} />
              <Route path="/admin/orders/:orderId" element={<OrderDetail />} />
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