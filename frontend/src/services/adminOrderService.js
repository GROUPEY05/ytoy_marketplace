import { apiClient } from './api';

const adminOrderService = {
  // Gestion des commandes administrateur
  getOrders: (page = 1) => {
    return apiClient.get(`/administrateur/commandes?page=${page}`);
  },

  getOrderDetails: (orderId) => {
    return apiClient.get(`/administrateur/commandes/${orderId}`);
  },

  createOrder: (orderData) => {
    return apiClient.post('/administrateur/commandes', orderData);
  },

  cancelOrder: (orderId) => {
    return apiClient.delete(`/administrateur/commandes/${orderId}`);
  },

  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/administrateur/commandes/${orderId}/status`, { status });
  }
};

export default adminOrderService;
