import apiClient from './api';
import { AIProviderConfig } from '@/types/aiProviderConfig';

export const aiProviderConfigService = {
  // Get all provider configurations
  getProviderConfigs: async (): Promise<AIProviderConfig[]> => {
    try {
      const response = await apiClient.get('/ai-provider-configs');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch AI provider configurations', error);
      throw error;
    }
  },

  // Get a specific provider configuration
  getProviderConfig: async (id: number): Promise<AIProviderConfig> => {
    try {
      const response = await apiClient.get(`/ai-provider-configs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch AI provider configuration with ID ${id}`, error);
      throw error;
    }
  },

  // Create a new provider configuration
  createProviderConfig: async (config: Partial<AIProviderConfig>): Promise<AIProviderConfig> => {
    try {
      const response = await apiClient.post('/ai-provider-configs', config);
      return response.data;
    } catch (error) {
      console.error('Failed to create AI provider configuration', error);
      throw error;
    }
  },

  // Update a provider configuration
  updateProviderConfig: async (id: number, config: Partial<AIProviderConfig>): Promise<AIProviderConfig> => {
    try {
      const response = await apiClient.put(`/ai-provider-configs/${id}`, config);
      return response.data;
    } catch (error) {
      console.error(`Failed to update AI provider configuration with ID ${id}`, error);
      throw error;
    }
  },

  // Delete a provider configuration
  deleteProviderConfig: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/ai-provider-configs/${id}`);
    } catch (error) {
      console.error(`Failed to delete AI provider configuration with ID ${id}`, error);
      throw error;
    }
  },

  // Test connection to a provider
  testConnection: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.post(`/ai-provider-configs/${id}/test-connection`);
      return response.data;
    } catch (error) {
      console.error(`Failed to test connection for AI provider configuration with ID ${id}`, error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};

export default aiProviderConfigService;
