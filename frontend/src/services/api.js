import axios from 'axios'

// Configuration de l'URL de base pour les requêtes API
const API_URL = import.meta.env.VITE_API_URL
const API_URL_AUTH = import.meta.env.VITE_API_URL_AUTH
console.log('API_URL:', API_URL)
// Récupération du token CSRF   import.meta.env.VITE_API_URL ||

// Création d'une instance Axios avec configuration par défaut
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Important pour la gestion des cookies CSRF
})

const apiClient_auth = axios.create({
  baseURL: API_URL_AUTH,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true // Important pour la gestion des cookies CSRF
})
async function getCsrfToken () {
  try {
    await apiClient_auth.get('/sanctum/csrf-cookie')
  } catch (error) {
    console.error('Erreur lors de la récupération du token CSRF:', error)
  }
}

// Ajout d'un intercepteur pour gérer les erreurs CORS et autres
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Log détaillé des erreurs
    console.error('Erreur API:', error)
    if (error.message === 'Network Error') {
      console.warn('Erreur réseau possible - Vérifiez la configuration CORS')
    }
    return Promise.reject(error)
  }
)

// Intercepteur pour ajouter le token d'authentification à chaque requête
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Ajoutez cet intercepteur après la création de apiClient
apiClient.interceptors.request.use(
  config => {
    // Nettoyez les données circulaires si présentes dans le body
    if (config.data) {
      config.data = JSON.parse(
        JSON.stringify(config.data, (key, value) => {
          // Évitez les références circulaires
          if (key.startsWith('_') || key.startsWith('__')) {
            return undefined
          }
          return value
        })
      )
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Service d'authentification
const authService = {
  // Inscription d'un nouvel utilisateur
  register: async userData => {
    try {
      const response = await apiClient.post('/register', userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Erreur lors de l'inscription" }
    }
  },

  registervendeur: async userData => {
    try {
      const response = await apiClient.post('/registervendeur', userData)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur))
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: "Erreur lors de l'inscription" }
    }
  },

  // Connexion d'un utilisateur
  login: async credentials => {
    try {
      const response = await apiClient.post('/login', credentials)
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.utilisateur))
        localStorage.setItem('userRole', response.data.utilisateur.role)
      }
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la connexion' }
    }
  },

  // Déconnexion
  logout: async () => {
    const token = localStorage.getItem('token') // Récupérer le jeton pour la déconnexion

    try {
      const response = await apiClient.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}` // Ajouter le jeton dans l'en-tête Authorization
          }
        }
      )

      // Nettoyage localStorage après réponse réussie
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')

      return response.data
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      throw error.response?.data || { message: 'Erreur lors de la déconnexion' }
    }
  },

  // Vérification d'email
  verifyEmail: async (utilisateurId, token) => {
    try {
      const response = await apiClient.get(
        `/verify-email/${utilisateurId}/${token}`
      )
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la vérification de l'email"
        }
      )
    }
  },

  // Vérification du numéro de téléphone
  verifyPhone: async code => {
    try {
      const response = await apiClient.post('/verify-phone', { code })
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la vérification du téléphone'
        }
      )
    }
  },

  // Demande de réinitialisation de mot de passe
  requestPasswordReset: async email => {
    try {
      const response = await apiClient.post('/reset-password', { email })
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la demande de réinitialisation'
        }
      )
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null // Vérifie la présence du token
  },

  // Récupérer l'utilisateur courant depuis le localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Récupérer le token depuis le localStorage
  getToken: () => {
    return localStorage.getItem('token')
  },

  // ====== FONCTIONNALITÉS ADMIN ======

  // Dashboard
  getDashboardData: () => {
    return apiClient.get('/admin/dashboard')
  },

  // Utilisateurs
  getUsers: (page = 1) => {
    return apiClient.get(`/admin/utilisateurs?page=${page}`)
  },

  getUserById: utilisateurId => {
    return apiClient.get(`/admin/utilisateurs/${utilisateurId}`)
  },

  updateUser: (utilisateurId, data) => {
    return apiClient.put(`/admin/utilisateurs/${utilisateurId}`, data)
  },

  banUser: utilisateurId => {
    return apiClient.post(`/admin/utilisateurs/${utilisateurId}/ban`)
  },

  deleteUser: utilisateurId => {
    return apiClient.delete(`/admin/utilisateurs/${utilisateurId}`)
  },

  // Vendeurs
  getPendingVendors: () => {
    return apiClient.get('/admin/vendeurs/en-attente')
  },

  approveVendor: vendorId => {
    return apiClient.post(`/admin/vendeurs/${vendorId}/approuver`)
  },

  rejectVendor: vendorId => {
    return apiClient.post(`/admin/vendeurs/${vendorId}/rejeter`)
  },

  // Avis
  getReviews: (page = 1) => {
    return apiClient.get(`/admin/reviews?page=${page}`)
  },

  approveReview: reviewId => {
    return apiClient.post(`/admin/reviews/${reviewId}/approve`)
  },

  deleteReview: reviewId => {
    return apiClient.delete(`/admin/reviews/${reviewId}`)
  },

  // Commandes
  getOrders: (page = 1) => {
    return apiClient.get(`/admin/commandes?page=${page}`)
  },

  getOrderDetails: orderId => {
    return apiClient.get(`/admin/commandes/${orderId}`)
  },

  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/admin/commandes/${orderId}`, { status })
  },

  // Statistiques
  getStatistics: (period = 'month') => {
    return apiClient.get(`/admin/statistics?period=${period}`)
  },

  // Service de paiement
  processPaiement: async orderData => {
    try {
      const response = await apiClient.post('/payment/process', orderData)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors du traitement du paiement'
        }
      )
    }
  },

  verifyPaiement: async paymentId => {
    try {
      const response = await apiClient.post('/payment/verify', { paymentId })
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la vérification du paiement'
        }
      )
    }
  },

  getPaiementStatus: async orderId => {
    try {
      const response = await apiClient.get(`/payment/status/${orderId}`)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la récupération du statut du paiement'
        }
      )
    }
  },

  // Service de recherche
  searchProduits: async query => {
    try {
      const response = await apiClient.get(
        `/search/produits?q=${encodeURIComponent(query)}`
      )
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la recherche de produits'
        }
      )
    }
  },

  searchCategories: async query => {
    try {
      const response = await apiClient.get(
        `/search/categories?q=${encodeURIComponent(query)}`
      )
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la recherche de catégories'
        }
      )
    }
  },

  // Service des avis
  createReview: async (productId, reviewData) => {
    try {
      const response = await apiClient.post(`/reviews/${productId}`, reviewData)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la création de l'avis"
        }
      )
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la mise à jour de l'avis"
        }
      )
    }
  },

  deleteReview: async reviewId => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la suppression de l'avis"
        }
      )
    }
  },

  // Service du profil utilisateur
  getProfile: async () => {
    try {
      const response = await apiClient.get('/profile')
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la récupération du profil'
        }
      )
    }
  },

  updateProfile: async profileData => {
    try {
      const response = await apiClient.put('/profile', profileData)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la mise à jour du profil'
        }
      )
    }
  },

  updatePassword: async passwordData => {
    try {
      const response = await apiClient.put('/profile/password', passwordData)
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: 'Erreur lors de la mise à jour du mot de passe'
        }
      )
    }
  },

  updateAvatar: async avatarFile => {
    try {
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      const response = await apiClient.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Erreur lors de la mise à jour de l'avatar"
        }
      )
    }
  }
}

const adminService = {
  // Dashboard et statistiques
  async getStatistics () {
    await getCsrfToken()
    return apiClient.get('/administrateur/stats')
  },

  getRecentOrders: () => {
    return apiClient.get('/administrateur/recent-orders')
  },

  // Gestion des utilisateurs
  getUsers: (page = 1, role = 'all', search = '') => {
    let url = `/administrateur/utilisateurs?page=${page}`
    if (role !== 'all') {
      url += `&role=${role}`
    }
    if (search) {
      url += `&search=${search}`
    }
    return apiClient.get(url)
  },

  getUserById: id => {
    return apiClient.get(`/administrateur/utilisateurs/${id}`)
  },

  updateUser: (id, data) => {
    return apiClient.put(`/administrateur/utilisateurs/${id}`, data)
  },

  deleteUser: id => {
    return apiClient.delete(`/administrateur/utilisateurs/${id}`)
  },

  banUser: id => {
    return apiClient.post(`/administrateur/utilisateurs/${id}/ban`)
  },

  // Gestion des vendeurs
  getPendingVendors: () => {
    return apiClient.get('/administrateur/vendeurs/pending')
  },

  approveVendor: vendorId => {
    return apiClient.post(`/administrateur/vendeurs/${vendorId}/approve`)
  },

  rejectVendor: vendorId => {
    return apiClient.post(`/administrateur/vendeurs/${vendorId}/reject`)
  },
  getAllVendors: () => {
    return apiClient.get('/administrateur/vendors')
  },

  // Gestion des produits
  getProducts: (page = 1) => {
    return apiClient.get(`/administrateur/produits?page=${page}`)
  },

  getProduct: id => {
    return apiClient.get(`/administrateur/produits/${id}`)
  },

  updateProduct: (id, data) => {
    return apiClient.put(`/administrateur/produits/${id}`, data)
  },

  deleteProduct: id => {
    return apiClient.delete(`/administrateur/produits/${id}`)
  },

  // Gestion des catégories
  getCategories: () => {
    return apiClient.get('/administrateur/categories')
  },

  getCategoryById: id => {
    return apiClient.get(`/administrateur/categories/${id}`)
  },

  createCategory: data => {
    const categoryData = {
      nom: data.nom,
      description: data.description
    }
    return apiClient.post('/administrateur/categories', categoryData)
  },

  updateCategory: (id, data) => {
    const categoryData = {
      nom: data.nom,
      description: data.description
    }
    return apiClient.put(`/administrateur/categories/${id}`, categoryData)
  },

  deleteCategory: id => {
    return apiClient.delete(`/administrateur/categories/${id}`)
  },

  // Gestion des avis
  getReviews: () => {
    return apiClient.get('/administrateur/reviews')
  },

  approveReview: reviewId => {
    return apiClient.post(`/administrateur/reviews/${reviewId}/approve`)
  },

  // Gestion des commandes
  getOrders: (page = 1) => {
    return apiClient.get(`/administrateur/commandes?page=${page}`)
  },

  getOrderDetails: orderId => {
    return apiClient.get(`/administrateur/commandes/${orderId}`)
  },

  createOrder: orderData => {
    return apiClient.post('/administrateur/orders', orderData)
  },

  cancelOrder: orderId => {
    return apiClient.delete(`/administrateur/orders/${orderId}`)
  },

  updateOrderStatus: (orderId, status) => {
    return apiClient.put(`/administrateur/orders/${orderId}/status`, { status })
  }
}

// Modification de l'export pour inclure adminService
export { apiClient, adminService, apiClient_auth }
export default authService
