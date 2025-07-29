import { apiClient } from './api';

// Services pour les promotions publiques
const fetchPromotions = async () => {
  try {
    const response = await apiClient.get('/promotions');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions:', error);
    throw error;
  }
};

const fetchPromotionsByType = async (type) => {
  try {
    const response = await apiClient.get(`/promotions/type/${type}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des promotions de type ${type}:`, error);
    throw error;
  }
};

const fetchPromotionDetails = async (id) => {
  try {
    const response = await apiClient.get(`/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des détails de la promotion ${id}:`, error);
    throw error;
  }
};

// Services pour la gestion des promotions (vendeur)
const fetchVendorPromotions = async (params = {}) => {
  try {
    const response = await apiClient.get('/vendor/promotions', { params });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des promotions du vendeur:', error);
    throw error;
  }
};

const createPromotion = async (promotionData) => {
  try {
    const response = await apiClient.post('/vendor/promotions', promotionData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la promotion:', error);
    throw error;
  }
};

const updatePromotion = async (id, promotionData) => {
  try {
    const response = await apiClient.put(`/vendor/promotions/${id}`, promotionData);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de la promotion ${id}:`, error);
    throw error;
  }
};

const deletePromotion = async (id) => {
  try {
    const response = await apiClient.delete(`/vendor/promotions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la promotion ${id}:`, error);
    throw error;
  }
};

const togglePromotionStatus = async (id) => {
  try {
    const response = await apiClient.put(`/vendor/promotions/${id}/toggle-status`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors du changement de statut de la promotion ${id}:`, error);
    throw error;
  }
};

export {
  fetchPromotions,
  fetchPromotionsByType,
  fetchPromotionDetails,
  fetchVendorPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus
};
