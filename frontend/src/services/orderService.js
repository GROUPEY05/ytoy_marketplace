// 

import axios from 'axios';

// Dictionnaire des chemins selon le rôle
const roleBasePaths = {
  admin: '/api/admin/orders',
  vendor: '/api/vendor/orders',
  acheteur: '/api/acheteur/orders',
};

const getApi = (role = 'acheteur') => {
  const baseURL = roleBasePaths[role] || '/api/acheteur/orders';  // défaut: acheteur
  return axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      // Authorization: `Bearer ${token}`,  // ajoute ça si besoin
    },
  });
};

export const orderService = {
  getOrders: async (role = 'acheteur', params = {}) => {
    try {
      const api = getApi(role);
      const response = await api.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status, role = 'vendor') => {
    try {
      const api = getApi(role);
      const response = await api.put(`/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande', error);
      throw error;
    }
  },

  getOrder: async (orderId, role = 'acheteur') => {
    try {
      const api = getApi(role);
      const response = await api.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande', error);
      throw error;
    }
  },
};
