// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  console.log('Protected Route - Current User:', currentUser);
  console.log('Protected Route - Is Authenticated:', isAuthenticated);
  console.log('Protected Route - Required Role:', requiredRole);

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div>Chargement...</div>;
  }


  console.log("ProtectedRoute - currentUser:", currentUser);
  if (currentUser) {
    console.log("ProtectedRoute - currentUser.role:", currentUser.role);
  }
  console.log("ProtectedRoute - requiredRole:", requiredRole);

  // if (!currentUser || currentUser.role !== requiredRole) {
  //   console.log("Redirection vers login car:", !currentUser ? "currentUser est null" : `le rôle ${currentUser.role} ne correspond pas à ${requiredRole}`);
  //   return <Navigate to="/login" />;
  // }

  // if (!currentUser) {
  //   console.log("Redirection vers login car: currentUser est null");
  //   return <Navigate to="/login" />;
  // }
  
  // if (currentUser.role !== requiredRole) {
  //   console.log(`Redirection vers login car: le rôle ${currentUser.role} ne correspond pas à ${requiredRole}`);
  //   return <Navigate to=";/admin/dashboard" />;
  // }
  

  // Si aucun rôle n'est requis, autoriser l'accès
  if (!requiredRole) {
    console.log('Protected Route - No role required, allowing access');
    return <Outlet />;
  }

  // Vérifier le rôle si un rôle spécifique est requis
  const userRole = currentUser.role;
  console.log('Protected Route - User Role:', userRole);

  if (userRole !== requiredRole) {
    console.log('Protected Route - Role mismatch, redirecting to appropriate dashboard');
    // Si l'utilisateur n'a pas le bon rôle, le rediriger vers son propre dashboard
    if (userRole === 'administrateur') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === 'vendeur') {
      return <Navigate to="/vendeur/dashboard" replace />;
    } else if (userRole === 'acheteur') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  console.log('Protected Route - Access granted');
  // Si tout est OK, afficher le contenu de la route
  return <Outlet />;
};

export default ProtectedRoute;