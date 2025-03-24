
// src/services/commune.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des communes
 */
export const CommuneService = {
  /**
   * Récupère la liste des communes
   * @returns {Promise<Array>} Liste des communes
   */
  async getAll() {
    try {
      return await BaseApiService.get('/panel/commune/');
    } catch (error) {
      console.error('Erreur lors de la récupération des communes:', error);
      throw error;
    }
  },

  /**
   * Récupère les communes par pays
   * @param {string} countryId - ID du pays
   * @returns {Promise<Array>} Liste des communes du pays
   */
  async getByCountry(countryId) {
    try {
      return await BaseApiService.get(`/panel/commune/?country_id=${countryId}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des communes du pays ${countryId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère une commune par son ID
   * @param {string} id - ID de la commune
   * @returns {Promise<Object>} Données de la commune
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/commune/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la commune ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle commune
   * @param {Object} data - Données de la commune à créer
   * @returns {Promise<Object>} Commune créée
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/commune/', data);
    } catch (error) {
      console.error('Erreur lors de la création de la commune:', error);
      throw error;
    }
  },

  /**
   * Met à jour une commune existante
   * @param {string} id - ID de la commune
   * @param {Object} data - Nouvelles données de la commune
   * @returns {Promise<Object>} Commune mise à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/commune/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la commune ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une commune
   * @param {string} id - ID de la commune à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/commune/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la commune ${id}:`, error);
      throw error;
    }
  }
};