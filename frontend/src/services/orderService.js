// 

// 

import { apiClient } from './api';

// Dictionnaire des chemins selon le rôle
const roleBasePaths = {
  acheteur: '/acheteur/commandes',
  vendeur: '/vendor/orders',
  admin: '/administrateur/orders'
};

export const orderService = {
  getOrders: async (role = 'acheteur', page = 1) => {
    try {
      // Déterminer le chemin selon le rôle
      const path = roleBasePaths[role] || '/orders';
      // Utiliser l'instance apiClient configurée avec la bonne URL de base
      const response = await apiClient.get(path, { 
        params: { 
          page,
          per_page: 10
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes', error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId, status, role = 'vendor') => {
    try {
      const path = roleBasePaths[role] || '/vendor/orders';
      const response = await apiClient.put(`${path}/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de la commande', error);
      throw error;
    }
  },

  getOrder: async (orderId, role = 'acheteur', role2 = 'vendeur') => {
    try {
      const path = roleBasePaths[role] || '/orders';
      const response = await apiClient.get(`${path}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande', error);
      throw error;
    }
  },

  createOrder: async (orderData, role = 'acheteur') => {
    try {
      const path = roleBasePaths[role];
      if (!path) {
        throw new Error('Rôle invalide pour la création de la commande');
      }
      const response = await apiClient.post(path, orderData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la commande', error);
      throw error;
    }
  },

  cancelOrder: async (orderId, role = 'acheteur') => {
    try {
      const path = roleBasePaths[role];
      if (!path) {
        throw new Error('Rôle invalide pour l\'annulation de la commande');
      }
      const response = await apiClient.delete(`${path}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la commande', error);
      throw error;
    }
  }
};