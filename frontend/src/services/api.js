import axios from 'axios';

// Configuration de l'URL de base pour les requêtes API
const API_URL = 'http://localhost:8000';

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Important pour la gestion des cookies CSRF
});

// Ajout d'un intercepteur pour gérer les erreurs CORS et autres
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log détaillé des erreurs
    console.error('Erreur API:', error);
    if (error.message === 'Network Error') {
      console.warn('Erreur réseau possible - Vérifiez la configuration CORS');
    }
    return Promise.reject(error);
  }
);

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
      const response = await apiClient.post('/api/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'inscription' };
    }
  },

  registervendeur: async (userData) => {
    try {
      const response = await apiClient.post('/api/registervendeur', userData);
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
      const response = await apiClient.post('/api/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
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
    const token = localStorage.getItem('token');  // Récupérer le jeton pour la déconnexion

    try {
      const response = await apiClient.post('/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${token}`  // Ajouter le jeton dans l'en-tête Authorization
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
  verifyEmail: async (utilisateurId, token) => {
    try {
      const response = await apiClient.get(`/api/verify-email/${utilisateurId}/${token}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification de l\'email' };
    }
  },

  // Vérification du numéro de téléphone
  verifyPhone: async (code) => {
    try {
      const response = await apiClient.post('/api/verify-phone', { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification du téléphone' };
    }
  },

  // Demande de réinitialisation de mot de passe
  requestPasswordReset: async (email) => {
    try {
      const response = await apiClient.post('/api/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la demande de réinitialisation' };
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;  // Vérifie la présence du token
  },

  // Récupérer l'utilisateur courant depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Récupérer le token depuis le localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // ====== FONCTIONNALITÉS ADMIN ======
  
  // Dashboard
  getDashboardData: () => {
    return apiClient.get('/api/admin/dashboard');
  },
  
  // Utilisateurs
  getUsers: (page = 1) => {
    return apiClient.get(`/api/admin/utilisateurs?page=${page}`);
  },
  
  getUserById: (utilisateurId) => {
    return apiClient.get(`/api/admin/utilisateurs/${utilisateurId}`);
  },
  
  updateUser: (utilisateurId, data) => {
    return apiClient.put(`/api/admin/utilisateurs/${utilisateurId}`, data);
  },
  
  banUser: (utilisateurId) => {
    return apiClient.post(`/api/admin/utilisateurs/${utilisateurId}/ban`);
  },
  
  deleteUser: (utilisateurId) => {
    return apiClient.delete(`/api/admin/utilisateurs/${utilisateurId}`);
  },
  
  // Vendeurs
  getPendingVendors: () => {
    return apiClient.get('/api/admin/vendeurs/en-attente');
  },
  
  approveVendor: (vendorId) => {
    return apiClient.post(`/api/admin/vendeurs/${vendorId}/approuver`);
  },
  
  rejectVendor: (vendorId) => {
    return apiClient.post(`/api/admin/vendeurs/${vendorId}/rejeter`);
  },
  
  // Avis
  getReviews: (page = 1) => {
    return apiClient.get(`/api/admin/reviews?page=${page}`);
  },
  
  approveReview: (reviewId) => {
    return apiClient.post(`/api/admin/reviews/${reviewId}/approve`);
  },
  
  deleteReview: (reviewId) => {
    return apiClient.delete(`/api/admin/reviews/${reviewId}`);
  },
  
  // Commandes
  getOrders: (page = 1) => {
    return apiClient.get(`/api/admin/commandes?page=${page}`);
  },
  
  getOrderDetails: (orderId) => {
    return apiClient.get(`/api/admin/commandes/${orderId}`);
  },
  
  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/api/admin/commandes/${orderId}`, { status });
  },
  
  // Statistiques
  getStatistics: (period = 'month') => {
    return apiClient.get(`/api/admin/statistics?period=${period}`);
  },

  // Service de paiement
  processPaiement: async (orderData) => {
    try {
      const response = await apiClient.post('/api/payment/process', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du traitement du paiement' };
    }
  },

  verifyPaiement: async (paymentId) => {
    try {
      const response = await apiClient.post('/api/payment/verify', { paymentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la vérification du paiement' };
    }
  },

  getPaiementStatus: async (orderId) => {
    try {
      const response = await apiClient.get(`/api/payment/status/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du statut du paiement' };
    }
  },

  // Service de recherche
  searchProduits: async (query) => {
    try {
      const response = await apiClient.get(`/api/search/produits?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la recherche de produits' };
    }
  },

  searchCategories: async (query) => {
    try {
      const response = await apiClient.get(`/api/search/categories?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la recherche de catégories' };
    }
  },

  // Service des avis
  createReview: async (productId, reviewData) => {
    try {
      const response = await apiClient.post(`/api/reviews/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'avis' };
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/api/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'avis' };
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/api/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'avis' };
    }
  },

  // Service du profil utilisateur
  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du profil' };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/api/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du profil' };
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await apiClient.put('/api/profile/password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du mot de passe' };
    }
  },

  updateAvatar: async (avatarFile) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);
      const response = await apiClient.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'avatar' };
    }
  },
};

export { apiClient }; // pour les appels simples sans wrapper
export default authService;
