import { BaseApiService } from './api';

/**
 * Service pour la gestion des alertes (alerts)
 */
export const AlertService = {
  async getAll() {
    return await BaseApiService.get('/panel/alert/');
  },

  async getById(id) {
    return await BaseApiService.get(`/panel/alert/${id}/`);
  },

  async create(data) {
    return await BaseApiService.post('/panel/alert/', data);
  },

  async update(id, data) {
    return await BaseApiService.put(`/panel/alert/${id}/`, data);
  },

  async delete(id) {
    return await BaseApiService.delete(`/panel/alert/${id}/`);
  }
};
