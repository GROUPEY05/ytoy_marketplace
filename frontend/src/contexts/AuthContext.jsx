// Importation de React et des hooks nécessaires
import React, { createContext, useState, useEffect } from 'react';

// Importation du service d'authentification (gère les appels API comme login, logout, register)
import authService from '../services/api';

// Création d'un contexte d'authentification (permet de partager des données entre composants)
export const AuthContext = createContext();

// Composant Provider qui englobe toute l'application pour fournir les infos d'authentification
export const AuthProvider = ({ children }) => {
  // État local pour stocker l'utilisateur connecté
  const [currentUser, setCurrentUser] = useState(null);

  // État pour gérer le chargement initial (utile quand on vérifie si un utilisateur est déjà connecté)
  const [loading, setLoading] = useState(true);

  // useEffect qui s'exécute une seule fois au démarrage
  useEffect(() => {
    // On essaie de récupérer l'utilisateur stocké (dans localStorage ou cookies)
    const user = authService.getCurrentUser();
    setCurrentUser(user); // On met à jour l'état avec l'utilisateur récupéré
    setLoading(false);    // Fin du chargement
  }, []);

  // Fonction de connexion
  const login = async (credentials) => {
    const response = await authService.login(credentials); // Appel API de connexion
    setCurrentUser(response.utilisateur); // Mise à jour de l'utilisateur connecté
    return response;
  };

  // Fonction d'inscription
  const register = async (userData) => {
    const response = await authService.register(userData); // Appel API d'enregistrement
    setCurrentUser(response.utilisateur); // Mise à jour de l'utilisateur une fois inscrit
    return response;
  };

  // Fonction de déconnexion
  const logout = async () => {
    await authService.logout(); // Appel API pour se déconnecter côté backend
    setCurrentUser(null); // Suppression de l'utilisateur du state
  };

  // Objet que tous les composants enfants pourront utiliser via le contexte
  const value = {
    currentUser,                        // Données de l'utilisateur connecté
    isAuthenticated: !!currentUser,    // Boolean pour savoir si un utilisateur est connecté
    login,                              // Méthode de connexion
    register,                           // Méthode d'inscription
    logout,                             // Méthode de déconnexion
    loading                             // Booléen pour indiquer le chargement
  };

  // On fournit le contexte à tous les composants enfants
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour accéder plus facilement au contexte d'auth depuis n'importe quel composant
export const useAuth = () => {
  const context = React.useContext(AuthContext); // Récupère le contexte

  // Si le contexte n'est pas trouvé, on affiche une erreur (bonne pratique)
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context; // On retourne le contexte pour être utilisé dans le composant
};
