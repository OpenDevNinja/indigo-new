import { BaseApiService } from './api';

/**
 * Service pour la gestion des utilisateurs (users)
 */
export const UserService = {
  async getAll() {
    return await BaseApiService.get('/panel/user/');
  },

  async getById(id) {
    return await BaseApiService.get(`/panel/user/${id}/`);
  },

  async create(data) {
    return await BaseApiService.post('/panel/user/', data);
  },

  async update(id, data) {
    return await BaseApiService.put(`/panel/user/${id}/`, data);
  },

  async delete(id) {
    return await BaseApiService.delete(`/panel/user/${id}/`);
  }
};
