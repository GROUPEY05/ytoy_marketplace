import apiClient from './apiClient';
import { getCsrfToken } from './authService';

const adminService = {
  async getStatistics() {
    await getCsrfToken();
    return apiClient.get('/api/administrateur/statistiques');
  },

  async getUsers(page = 1, role = '', searchTerm = '') {
    await getCsrfToken();
    return apiClient.get(`/api/administrateur/users?page=${page}&role=${role}&search=${searchTerm}`);
  },

  async getPendingVendors() {
    await getCsrfToken();
    return apiClient.get('/api/administrateur/vendeurs/pending');
  }
};

export default adminService;
