
// src/services/panel.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des types de panneaux
 */
export const PanelTypeService = {
  /**
   * Récupère la liste des types de panneaux
   * @returns {Promise<Array>} Liste des types de panneaux
   */
  async getAll() {
    try {
      return await BaseApiService.get('/panel/type/panel/');
    } catch (error) {
      console.error('Erreur lors de la récupération des types de panneaux:', error);
      throw error;
    }
  },

  /**
   * Récupère un type de panneau par son ID
   * @param {string} id - ID du type de panneau
   * @returns {Promise<Object>} Données du type de panneau
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/type/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du type de panneau ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau type de panneau
   * @param {Object} data - Données du type de panneau à créer
   * @returns {Promise<Object>} Type de panneau créé
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/type/panel/', data);
    } catch (error) {
      console.error('Erreur lors de la création du type de panneau:', error);
      throw error;
    }
  },

  /**
   * Met à jour un type de panneau existant
   * @param {string} id - ID du type de panneau
   * @param {Object} data - Nouvelles données du type de panneau
   * @returns {Promise<Object>} Type de panneau mis à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/type/panel/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du type de panneau ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un type de panneau
   * @param {string} id - ID du type de panneau à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/type/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du type de panneau ${id}:`, error);
      throw error;
    }
  }
};