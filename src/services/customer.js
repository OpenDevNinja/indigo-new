// src/services/customer.js
import { BaseApiService } from './api';

export const CustomerService = {
  async getAll() {
    try {
      return await BaseApiService.get('/panel/customer/');
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      return await BaseApiService.get(`/panel/customer/${id}/`);
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  async create(data) {
    try {
      return await BaseApiService.post('/panel/customer/', data);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  async update(id, data) {
    try {
      return await BaseApiService.put(`/panel/customer/${id}/`, data);
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  async delete(id) {
    try {
      return await BaseApiService.delete(`/panel/customer/${id}/`);
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  }
};
