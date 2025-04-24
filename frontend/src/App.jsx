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
import Dashboard from './components/Dashboard';
import VendeurDashboard from './components/vendeur/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
import Cart from './components/Cart';

// Nouveaux composants à ajouter
import Products from './components/products/Products';
import ProductDetail from './components/products/ProductDetail';
import Checkout from './components/checkout/Checkout';

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Routes protégées pour tous les utilisateurs authentifiés */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Routes spécifiques aux vendeurs */}
            <Route element={<ProtectedRoute requiredRole="vendeur" />}>
              <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
              {/* Autres routes vendeur */}
            </Route>

            {/* Routes spécifiques aux administrateurs */}
            <Route element={<ProtectedRoute requiredRole="administrateur" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Autres routes admin */}
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