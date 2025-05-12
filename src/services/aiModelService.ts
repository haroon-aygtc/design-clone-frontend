
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

  // Add a new model
  addModel: async (modelData: Partial<AIModel>): Promise<AIModel> => {
    try {
      // Ensure the API key is properly included
      const payload = {
        ...modelData,
        api_key: modelData.apiKey // Add this in case the backend expects snake_case
      };

      console.log('Sending model data:', payload);
      const response = await apiClient.post('/ai-models', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to add AI model', error);
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
      }
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
  },

  // Test connection to model API
  testConnection: async (modelId: string): Promise<{success: boolean, message: string}> => {
    try {
      // Changed from POST to GET as per the API requirements
      const response = await apiClient.get(`/ai-models/${modelId}/test-connection`);
      return response.data;
    } catch (error) {
      console.error('Failed to test connection', error);
      if (error.response?.data) {
        console.error('Error response data:', error.response.data);
      }
      return {
        success: false,
        message: error.response?.data?.message || (error instanceof Error ? error.message : 'Unknown error occurred')
      };
    }
  },

  // Generate text with the model
  generateText: async (
    modelId: string,
    messages: Array<{role: string, content: string}>,
    options: {
      temperature?: number,
      max_tokens?: number,
      stream?: boolean
    } = {}
  ) => {
    try {
      const response = await apiClient.post(`/ai-models/${modelId}/generate`, {
        messages,
        temperature: options.temperature,
        max_tokens: options.max_tokens,
        stream: options.stream
      });
      return response.data;
    } catch (error) {
      console.error('Failed to generate text', error);
      throw error;
    }
  }
};

export default aiModelService;
