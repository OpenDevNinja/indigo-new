
// src/services/panelGroup.js
import { BaseApiService } from './api';

/**
 * Service pour la gestion des groupes de panneaux
 */
export const PanelGroupService = {
  /**
   * Récupère la liste des groupes de panneaux
   * @returns {Promise<Array>} Liste des groupes de panneaux
   */
  async getAll() {
    try {
      return await BaseApiService.get('/panel/group/panel/');
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes de panneaux:', error);
      throw error;
    }
  },

  /**
   * Récupère un groupe de panneaux par son ID
   * @param {string} id - ID du groupe de panneaux
   * @returns {Promise<Object>} Données du groupe de panneaux
   */
  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/group/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du groupe de panneaux ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crée un nouveau groupe de panneaux
   * @param {Object} data - Données du groupe de panneaux à créer
   * @returns {Promise<Object>} Groupe de panneaux créé
   */
  async create(data) {
    try {
      return await BaseApiService.post('/panel/group/panel/', data);
    } catch (error) {
      console.error('Erreur lors de la création du groupe de panneaux:', error);
      throw error;
    }
  },

  /**
   * Met à jour un groupe de panneaux existant
   * @param {string} id - ID du groupe de panneaux
   * @param {Object} data - Nouvelles données du groupe de panneaux
   * @returns {Promise<Object>} Groupe de panneaux mis à jour
   */
  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/group/panel/${id}/`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du groupe de panneaux ${id}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un groupe de panneaux
   * @param {string} id - ID du groupe de panneaux à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/group/panel/${id}/`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du groupe de panneaux ${id}:`, error);
      throw error;
    }
  }
};

