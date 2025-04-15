// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Composants d'authentification
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Autres composants
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import VendeurDashboard from './components/vendeur/Dashboard';
import AdminDashboard from './components/admin/Dashboard';
import NotFound from './components/NotFound';
import Unauthorized from './components/Unauthorized';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Routes protégées pour tous les utilisateurs authentifiés */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Routes spécifiques aux vendeurs */}
          <Route element={<ProtectedRoute requiredRole="vendeur" />}>
            <Route path="/vendeur/dashboard" element={<VendeurDashboard />} />
          </Route>

          {/* Routes spécifiques aux administrateurs */}
          <Route element={<ProtectedRoute requiredRole="administrateur" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Route 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;