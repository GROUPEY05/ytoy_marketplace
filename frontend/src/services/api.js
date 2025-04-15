// src/services/api.js
import axios from 'axios';

// Configuration de l'URL de base pour les requêtes API
const API_URL = 'http://localhost:8000/api';
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await apiClient.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Récupérer le token depuis le localStorage
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;