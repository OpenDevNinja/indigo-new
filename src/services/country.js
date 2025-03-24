// src/services/country.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des pays
 */
export const CountryService = {
  /**
   * Récupère la liste des pays
   * @returns {Promise<Array>} Liste des pays
   */
  async getAll() {
    try {
      return await BaseApiService.get('/panel/country/');
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  },

  /**
   * Récupère un pays par son ID
   * @param {string} id - ID du pays
   * @returns {Promise<Object>} Données du pays
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/country/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du pays ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau pays
   * @param {Object} data - Données du pays à créer
   * @returns {Promise<Object>} Pays créé
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/country/', data);
    } catch (error) {
      console.error('Erreur lors de la création du pays:', error);
      throw error;
    }
  },

  /**
   * Met à jour un pays existant
   * @param {string} id - ID du pays
   * @param {Object} data - Nouvelles données du pays
   * @returns {Promise<Object>} Pays mis à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/country/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du pays ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un pays
   * @param {string} id - ID du pays à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/country/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du pays ${id}:`, error);
      throw error;
    }
  }
};
