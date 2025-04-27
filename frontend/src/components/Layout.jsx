// src/components/Layout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const getNavLinks = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return [{ to: '/admin/orders', label: 'Commandes' }];
      case 'acheteur':
        return [
          { to: '/acheteur/orders', label: 'Mes Commandes' },
          { to: '/acheteur/orders/new', label: 'Nouvelle Commande' }
        ];
      case 'vendeur':
        return [{ to: '/vendeur/orders', label: 'Commandes' }];
      default:
        return [];
    }
  };
  
  const navLinks = getNavLinks();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link to="/" className="text-white font-bold text-xl">
                  Gestion des Commandes
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {user && (
              <div className="flex items-center">
                <span className="text-white mr-4">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;