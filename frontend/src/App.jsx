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
//acheteur
import Dashboard from './components/Acheteur/Dashboard';
//vendeur
import VendeurDashboard from './components/vendeur/Dashboard';
import ProductForm from './components/vendeur/AddProduct';
//admin 
import AdminDashboard from './components/admin/Dashboard';
import CategorieAdmin from './components/admin/CategoryAdmin';
import OrderDetail from './components/admin/OrderDetail';
import OrderList from './components/admin/OrderList';
//autre
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';
import Cart from './components/Cart';

// Nouveaux composants à ajouter
import Products from './components/products/ProduitsByCategorie';
import ProduitsByCategorie from './components/products/ProduitsByCategorie';
import ProductDetail from './components/products/ProductDetail';
import AddToCartButton from './components/products/AddToCartButton';  
import ProductManagement from './components/vendeur/ManagementProduct';
import About from './components/About';

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
            <Route path="/categories/:categorieId" element={<ProduitsByCategorie />} />
            <Route path="/product/:produitId" element={<ProductDetail />} />
            <Route path="/add-to-cart/:produitId" element={<AddToCartButton />} />
           
        
        
           
            <Route path="/about" element={<About />} />
            {/* Routes protégées pour tous les utilisateurs authentifiés */}
            <Route element={<ProtectedRoute />}>
              <Route path="/acheteur/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Routes spécifiques aux vendeurs */}
            <Route element={<ProtectedRoute requiredRole="vendeur" />}>
              <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
              <Route path="/vendeur/addproduct" element={<ProductForm />} />
              <Route path="/vendeur/addproduct/edit/:produitId" element={<ProductForm produitId=":produitId" />} />
              <Route path="/vendeur/managementproduct" element={<ProductManagement />} />
              {/* Autres routes vendeur */}
            </Route>

            {/* Routes spécifiques aux administrateurs */}
            <Route element={<ProtectedRoute requiredRole="administrateur" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              {/* Autres routes admin */}
              <Route path="/admin/category" element={<CategorieAdmin />} />
              <Route path="/admin/commandes/:orderId" element={<OrderDetail />} />
              <Route path="/admin/commandes" element={<OrderList />} />
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