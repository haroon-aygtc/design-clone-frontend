
import apiClient from './api';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';

export const aiModelService = {
  // Get all available models
  getAvailableModels: async (): Promise<AIModel[]> => {
    try {
      const response = await apiClient.get('/ai-models');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch AI models', error);
      throw error;
    }
  },

  // Get connected/active models
  getConnectedModels: async (): Promise<AIModel[]> => {
    try {
      const response = await apiClient.get('/ai-models/widget/available');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch connected models', error);
      throw error;
    }
  },

  // Connect a new model
  connectModel: async (modelId: string, apiKey: string, configuration?: AIModelConfiguration): Promise<AIModel> => {
    try {
      const response = await apiClient.post('/ai-models/widget/assign', {
        modelId,
        apiKey,
        configuration
      });
      return response.data;
    } catch (error) {
      console.error('Failed to connect model', error);
      throw error;
    }
  },

  // Update model configuration
  updateModelConfig: async (modelId: string, config: Partial<AIModelConfiguration>): Promise<AIModel> => {
    try {
      const response = await apiClient.put(`/ai-models/${modelId}/configuration`, config);
      return response.data;
    } catch (error) {
      console.error('Failed to update model configuration', error);
      throw error;
    }
  },

  // Toggle model active status
  toggleModelActive: async (modelId: string): Promise<AIModel> => {
    try {
      const response = await apiClient.put(`/ai-models/${modelId}/toggle-active`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle model status', error);
      throw error;
    }
  }
};

export default aiModelService;
