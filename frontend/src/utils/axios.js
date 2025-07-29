import axios from 'axios';

// Créer une instance axios avec la configuration de base
const axiosInstance = axios.create({
    baseURL: 'http://149.202.43.206', // URL de votre backend Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour ajouter le token d'authentification si disponible
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
