// src/services/api.js
import axios from 'axios';

// Configuration de l'URL de base pour les requêtes API
const API_URL = 'http://localhost:8000/api';

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Pour gérer les cookies CSRF
});



// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification
const authService = {

  
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Inscription d'un nouvel vendeur
  registervendeur: async (userData) => {
    try {
      const response = await apiClient.post('/registervendeur', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
        localStorage.setItem('userRole', response.data.utilisateur.role);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  // Déconnexion
  logout: async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await apiClient.post('/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Nettoyage localStorage après réponse réussie
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');

      return response.data;
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error.response?.data || { message: 'Erreur lors de la déconnexion' };
    }
  },
  

  // Vérification d'email
  verifyEmail: async (userId, token) => {
    try {
      const response = await apiClient.get(`/verify-email/${userId}/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification de l\'email' };
    }
  },

  // Vérification du numéro de téléphone
  verifyPhone: async (code) => {
    try {
      const response = await apiClient.post('/verify-phone', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification du téléphone' };
    }
  },

  // Demande de réinitialisation de mot de passe
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la demande de réinitialisation' };
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  // Récupérer l'utilisateur courant depuis le localStorage
  getCurrentUser: () => {
    const Utilisateur = localStorage.getItem('Utilisateur');
    return Utilisateur ? JSON.parse(Utilisateur) : null;
  },

  // Récupérer le token depuis le localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // ====== FONCTIONNALITÉS ADMIN ======
  
  // Dashboard
  getDashboardData: () => {
    return apiClient.get('/admin/dashboard');
  },
  
  // Utilisateurs
  getUsers: (page = 1) => {
    return apiClient.get(`/admin/utilisateurs?page=${page}`);
  },
  
  getUserById: (utilisateurId) => {
    return apiClient.get(`/admin/utilisateurs/${utilisateurId}`);
  },
  
  updateUser: (utilisateurId, data) => {
    return apiClient.put(`/admin/utilisateurs/${utilisateurId}`, data);
  },
  
  banUser: (utilisateurId) => {
    return apiClient.post(`/admin/utilisateurs/${utilisateurId}/ban`);
  },
  
  deleteUser: (utilisateurId) => {
    return apiClient.delete(`/admin/utilisateurs/${utilisateurId}`);
  },
  
  // Vendeurs
  getPendingVendors: () => {
    return apiClient.get('/admin/vendeurs/en-attente');
  },
  
  approveVendor: (vendorId) => {
    return apiClient.post(`/admin/vendeurs/${vendorId}/approuver`);
  },
  
  rejectVendor: (vendorId) => {
    return apiClient.post(`/admin/vendeurs/${vendorId}/rejeter`);
  },
  
  // Avis
  getReviews: (page = 1) => {
    return apiClient.get(`/admin/reviews?page=${page}`);
  },
  
  approveReview: (reviewId) => {
    return apiClient.post(`/admin/reviews/${reviewId}/approve`);
  },
  
  deleteReview: (reviewId) => {
    return apiClient.delete(`/admin/reviews/${reviewId}`);
  },
  
  // Commandes
  getOrders: (page = 1) => {
    return apiClient.get(`/admin/commandes?page=${page}`);
  },
  
  getOrderDetails: (orderId) => {
    return apiClient.get(`/admin/commandes/${orderId}`);
  },
  
  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/admin/commandes/${orderId}`, { status });
  },
  
  // Statistiques
  getStatistics: (period = 'month') => {
    return apiClient.get(`/admin/statistics?period=${period}`);
  }
};
export { apiClient }; // pour les appels simples sans wrapper
export default authService;