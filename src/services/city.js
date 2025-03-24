// src/services/city.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des villes
 */
export const CityService = {
  /**
   * Récupère la liste des villes
   * @returns {Promise<Array>} Liste des villes
   */
  async getAll() {
    try {
      return await BaseApiService.get('/panel/city/');
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error);
      throw error;
    }
  },

  /**
   * Récupère les villes par commune
   * @param {string} communeId - ID de la commune
   * @returns {Promise<Array>} Liste des villes de la commune
   */
  async getByCommune(communeId) {
    try {
      return await BaseApiService.get(`/panel/city/?commune_id=${communeId}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération des villes de la commune ${communeId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère une ville par son ID
   * @param {string} id - ID de la ville
   * @returns {Promise<Object>} Données de la ville
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/city/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ville ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle ville
   * @param {Object} data - Données de la ville à créer
   * @returns {Promise<Object>} Ville créée
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/city/', data);
    } catch (error) {
      console.error('Erreur lors de la création de la ville:', error);
      throw error;
    }
  },

  /**
   * Met à jour une ville existante
   * @param {string} id - ID de la ville
   * @param {Object} data - Nouvelles données de la ville
   * @returns {Promise<Object>} Ville mise à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/city/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ville ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une ville
   * @param {string} id - ID de la ville à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/city/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ville ${id}:`, error);
      throw error;
    }
  }
};