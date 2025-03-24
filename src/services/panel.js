import { BaseApiService } from './api';

/**
 * Service pour la gestion du panel
 */
export const PanelService = {
  async getAll() {
    return await BaseApiService.get('/panel/panel/');
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
