import { BaseApiService } from "./api";

/**
 * Service d'authentification gérant les opérations liées à l'authentification des utilisateurs
 */
export const AuthService = {
  /**
   * Connecte un utilisateur
   * @param {Object} loginData - Identifiants de connexion
   * @param {string} loginData.email - Email de l'utilisateur
   * @param {string} loginData.password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} Données de réponse incluant le token d'accès
   * @throws {Error} Erreur avec détails si la connexion échoue
   */
  async login(loginData) {
    try {
      // Utiliser l'URL exacte fournie par Postman
      const response = await BaseApiService.post('/auth/user/login/', loginData);
      
      if (response?.access) {
        BaseApiService.setToken(response.access);
      }
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw new Error(error.message || 'Échec de la connexion');
    }
  },
  
  /**
   * Déconnecte l'utilisateur en supprimant le token d'authentification
   */
  logout() {
    BaseApiService.removeToken();
  },
  
  /**
   * Vérifie si l'utilisateur est actuellement authentifié
   * @returns {boolean} True si l'utilisateur est authentifié, sinon false
   */
  isAuthenticated() {
    return !!BaseApiService.getToken();
  },

  async changePassword(passwordData) {
    try {
      const response = await BaseApiService.post('/auth/user/change_password/', passwordData);
      return response.data;
    } catch (error) {
      return BaseApiService.handleError(error);
    }
  },

  /**
   * Réinitialise le mot de passe de l'utilisateur
   * @param {Object} resetData Données de réinitialisation
   */
  async resetPassword(resetData) {
    try {
      const response = await BaseApiService.post('/auth/user/reset_password/', resetData);
      return response.data;
    } catch (error) {
      return BaseApiService.handleError(error);
    }
  }
};