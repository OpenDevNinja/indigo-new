import { BaseApiService } from './api';

/**
 * Service pour la gestion du panel
 */
export const PanelService = {
 

  async getAll() {
    try {
      return await BaseApiService.get('/panel/panel/');
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getById(id) {
    return await BaseApiService.get(`/panel/panel/${id}/`);
  },

  async create(data) {
    return await BaseApiService.post('/panel/panel/', data);
  },

  async update(id, data) {
    return await BaseApiService.put(`/panel/panel/${id}/`, data);
  },

  async delete(id) {
    return await BaseApiService.delete(`/panel/panel/${id}/`);
  }
};
