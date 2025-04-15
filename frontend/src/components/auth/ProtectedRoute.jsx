// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div>Chargement...</div>;
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si un rôle spécifique est requis
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si tout est OK, afficher le contenu de la route
  return <Outlet />;
};

export default ProtectedRoute;