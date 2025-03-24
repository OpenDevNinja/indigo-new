import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Définir l'URL de base correctement - le problème vient probablement d'ici
const API_URL = '/api';
// Création du client API
const apiClient = axios.create({
  baseURL: API_URL, // Utiliser baseURL au lieu de API_URL comme propriété
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Enregistre le token d'authentification dans le localStorage
 * @param {string} token - Token JWT d'authentification
 */
const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Récupère le token d'authentification depuis le localStorage
 * @returns {string|null} Token JWT ou null si non disponible
 */
const getToken = () => {
  return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
};

/**
 * Supprime le token d'authentification du localStorage
 */
const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

/**
 * Vérifie si l'utilisateur actuel a le rôle d'administrateur
 * @returns {boolean} True si l'utilisateur est admin, sinon false
 */
const isAdmin = () => {
  const token = getToken();
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.role === 'admin';
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return false;
    }
  }
  
  return false;
};

/**
 * Traite et enrichit les erreurs API
 * @param {Error} error - Erreur d'origine
 * @returns {Error} Erreur enrichie avec détails supplémentaires
 */
const handleError = (error) => {
  console.error('Erreur API détaillée:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  
  // Créer un objet d'erreur enrichi
  const enhancedError = new Error(error.message);
  
  // Ajouter des propriétés supplémentaires à l'erreur
  if (error.response?.data) {
    enhancedError.detail = error.response.data.detail || error.response.data.message || error.message;
    enhancedError.statusCode = error.response.status;
    enhancedError.responseData = error.response.data;
  }
  
  return enhancedError;
};

// Configuration des intercepteurs
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    // Exclure les routes d'authentification de l'ajout du header Authorization
    if (token && !config.url?.includes('/auth/user/login/')) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response.data, // Retourner directement les données de la réponse
  (error) => {
    // Gérer l'expiration du token
    if (error.response?.status === 401 && !error.config.url.includes('/auth/user/login/')) {
      // Le token a expiré ou est invalide, déconnexion de l'utilisateur
      removeToken();
      
      // Redirection vers la page de connexion si nécessaire
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(handleError(error));
  }
);

/**
 * Effectue une requête GET
 * @param {string} url - URL de la requête
 * @param {Object} config - Configuration Axios optionnelle
 * @returns {Promise<any>} Données de réponse
 */
const get = async (url, config = {}) => {
  try {
    return await apiClient.get(url, config);
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Effectue une requête POST
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} config - Configuration Axios optionnelle
 * @returns {Promise<any>} Données de réponse
 */
const post = async (url, data = {}, config = {}) => {
  try {
    return await apiClient.post(url, data, config);
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Effectue une requête PUT
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} config - Configuration Axios optionnelle
 * @returns {Promise<any>} Données de réponse
 */
const put = async (url, data = {}, config = {}) => {
  try {
    return await apiClient.put(url, data, config);
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Effectue une requête DELETE
 * @param {string} url - URL de la requête
 * @param {Object} config - Configuration Axios optionnelle
 * @returns {Promise<any>} Données de réponse
 */
const deleteRequest = async (url, config = {}) => {
  try {
    return await apiClient.delete(url, config);
  } catch (error) {
    throw handleError(error);
  }
};

// Exportation du service API avec toutes les fonctions nécessaires
export const BaseApiService = {
  setToken,
  getToken,
  removeToken,
  isAdmin,
  apiClient,
  handleError,
  get,
  post,
  put,
  delete: deleteRequest
};