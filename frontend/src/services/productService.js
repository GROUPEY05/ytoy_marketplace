import { apiClient } from './api';

const productService = {
  // Produits - Acheteur
  getAllProducts: async (page = 1, search = '') => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    return apiClient.get(`/produits?${params.toString()}`);
  },

  getProductsByCategory: async (categoryId, page = 1) => {
    return apiClient.get(`/categories/${categoryId}/produits?page=${page}`);
  },

  getProductDetails: async (productId) => {
    return apiClient.get(`/produits/${productId}`);
  },

  // Produits - Vendeur
  getVendorProducts: async () => {
    return apiClient.get('/vendor/produits');
  },

  createProduct: async (productData) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(productData)) {
      if (key === 'images') {
        for (const image of value) {
          formData.append('images[]', image);
        }
      } else {
        formData.append(key, value);
      }
    }
    return apiClient.post('/vendor/produits', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateProduct: async (productId, productData) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(productData)) {
      if (key === 'images') {
        for (const image of value) {
          formData.append('images[]', image);
        }
      } else if (key === 'deletedImages') {
        formData.append('deleted_images', JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    }
    formData.append('_method', 'PUT'); // Pour Laravel
    return apiClient.post(`/vendor/produits/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteProduct: async (productId) => {
    return apiClient.delete(`/vendor/produits/${productId}`);
  },

  // Panier
  getCart: async () => {
    return apiClient.get('/cart');
  },

  addToCart: async (productId, quantity = 1) => {
    return apiClient.post('/cart/add', { product_id: productId, quantity });
  },

  updateCartItem: async (productId, quantity) => {
    return apiClient.put('/cart/update', { product_id: productId, quantity });
  },

  removeFromCart: async (productId) => {
    return apiClient.delete(`/cart/remove/${productId}`);
  },

  // Commandes
  createOrder: async (orderData) => {
    // Transformation des données pour correspondre au format attendu par le backend
    const formattedData = {
      adresse_livraison: orderData.address || '',
      phone: orderData.phone || '',
      notes: orderData.notes || '',
      panier_id: orderData.cartId,
      items: orderData.items.map(item => ({
        produit_id: item.productId || item.produit_id,
        quantite: item.quantity || item.quantite
      }))
    };
    return apiClient.post('/orders/create', formattedData);
  },

  getOrders: async () => {
    return apiClient.get('/orders');
  },

  getOrderDetails: async (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
  },

  // Catégories
  getCategories: async () => {
    return apiClient.get('/categories');
  }
};

export default productService;
