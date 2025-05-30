import { apiClient } from './api';

const adminOrderService = {
  // Gestion des commandes administrateur
  getOrders: (page = 1) => {
    return apiClient.get(`/api/administrateur/commandes?page=${page}`);
  },

  getOrderDetails: (orderId) => {
    return apiClient.get(`/api/administrateur/commandes/${orderId}`);
  },

  createOrder: (orderData) => {
    return apiClient.post('/api/administrateur/commandes', orderData);
  },

  cancelOrder: (orderId) => {
    return apiClient.delete(`/api/administrateur/commandes/${orderId}`);
  },

  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/api/administrateur/commandes/${orderId}/status`, { status });
  }
};

export default adminOrderService;
