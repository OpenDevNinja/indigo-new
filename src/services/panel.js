// src/services/panel.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des panneaux
 */
export const PanelService = {
  
  async getAll() {
    try {
      return await BaseApiService.get('/panel/panel/');
    } catch (error) {
      console.error('Erreur lors de la récupération des panneaux:', error);
      throw error;
    }
  },


  /**
   * Récupère un panneau par son ID
   * @param {string} id - ID du panneau
   * @returns {Promise<Object>} Données du panneau
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du panneau ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau panneau
   * @param {Object} data - Données du panneau à créer
   * @returns {Promise<Object>} Panneau créé
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/panel/', data);
    } catch (error) {
      console.error('Erreur lors de la création du panneau:', error);
      throw error;
    }
  },

  /**
   * Met à jour un panneau existant
   * @param {string} id - ID du panneau
   * @param {Object} data - Nouvelles données du panneau
   * @returns {Promise<Object>} Panneau mis à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/panel/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du panneau ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un panneau
   * @param {string} id - ID du panneau à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du panneau ${id}:`, error);
      throw error;
    }
  }
};