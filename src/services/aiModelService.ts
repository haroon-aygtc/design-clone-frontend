
import apiClient from './api';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';

// These functions will connect to your MySQL backend once deployed
export const aiModelService = {
  // Get all available models
  getAvailableModels: async (): Promise<AIModel[]> => {
    try {
      const response = await apiClient.get('/ai-models');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch AI models', error);
      // Return mock data while in development
      return mockedAvailableModels;
    }
  },

  // Get connected/active models
  getConnectedModels: async (): Promise<AIModel[]> => {
    try {
      const response = await apiClient.get('/ai-models/widget/available');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch connected models', error);
      // Return mock data while in development
      return mockedConnectedModels;
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

// Mock data for development in Lovable
// This will be replaced by real API calls when deployed
const mockedAvailableModels: AIModel[] = [
  { 
    id: '1', 
    name: 'GPT-4', 
    provider: 'OpenAI', 
    type: 'Large Language Model', 
    description: 'Latest GPT model with improved reasoning and instruction following',
    status: 'Available' 
  },
  { 
    id: '2', 
    name: 'Claude 3', 
    provider: 'Anthropic', 
    type: 'Large Language Model', 
    description: 'Advanced conversation model with strong reasoning abilities',
    status: 'Available' 
  },
  { 
    id: '3', 
    name: 'Gemini Pro', 
    provider: 'Google', 
    type: 'Multimodal', 
    description: 'Multimodal model supporting text, images, and video inputs',
    status: 'Available' 
  },
  { 
    id: '4', 
    name: 'DALL-E 3', 
    provider: 'OpenAI', 
    type: 'Image Generation', 
    description: 'Creates high-quality images from textual descriptions',
    status: 'Available' 
  },
  { 
    id: '5', 
    name: 'Whisper', 
    provider: 'OpenAI', 
    type: 'Speech Recognition', 
    description: 'Accurate speech-to-text transcription and translation',
    status: 'Available' 
  },
];

const mockedConnectedModels: AIModel[] = [
  { 
    id: '1', 
    name: 'GPT-4', 
    provider: 'OpenAI', 
    type: 'Large Language Model',
    description: 'Latest GPT model with improved reasoning and instruction following',
    apiKey: 'sk-••••••••••••••••••••••', 
    isActive: true,
    usageCount: 1243,
    lastUsed: '2 hours ago',
    status: 'Connected',
    configuration: {
      temperature: 0.7,
      maxTokens: 8000,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 0,
      systemPrompt: 'You are a helpful assistant.'
    }
  },
  { 
    id: '3', 
    name: 'Gemini Pro', 
    provider: 'Google', 
    type: 'Multimodal',
    description: 'Multimodal model supporting text, images, and video inputs',
    apiKey: 'AIza••••••••••••••••••••', 
    isActive: true,
    usageCount: 867,
    lastUsed: '5 mins ago',
    status: 'Connected',
    configuration: {
      temperature: 0.8,
      maxTokens: 4000,
      topP: 0.9,
      systemPrompt: 'Answer questions concisely and accurately.'
    }
  },
];

export default aiModelService;
