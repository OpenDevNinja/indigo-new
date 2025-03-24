  import { BaseApiService } from './api';

  /**
   * Service pour la gestion des campagnes (campaigns)
   */
  export const CampaignService = {
    async getAll() {
      return await BaseApiService.get('/panel/campaign/');
    },

    async getById(id) {
      return await BaseApiService.get(`/panel/campaign/${id}/`);
    },

    async create(data) {
      return await BaseApiService.post('/panel/campaign/', data);
    },

    async update(id, data) {
      return await BaseApiService.put(`/panel/campaign/${id}/`, data);
    },

    async delete(id) {
      return await BaseApiService.delete(`/panel/campaign/${id}/`);
    }
  };
