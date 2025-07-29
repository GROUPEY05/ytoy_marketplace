// src/utils/constants.js
export const API_URL = 'http://149.202.43.206';

export const ORDER_STATUS = {
  'pending': { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  'processing': { label: 'En traitement', color: 'bg-blue-100 text-blue-800' },
  'shipped': { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800' },
  'delivered': { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  'cancelled': { label: 'Annulée', color: 'bg-red-100 text-red-800' },
  'refunded': { label: 'Remboursée', color: 'bg-gray-100 text-gray-800' }
};

// src/utils/formatUtils.js
export const formatDate = (dateString) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};