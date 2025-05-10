
import { createContext, useContext, useState, ReactNode } from 'react';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';

// Initial mock data for available models
const initialAvailableModels: AIModel[] = [
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

// Initial mock data for connected models
const initialConnectedModels: AIModel[] = [
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

interface AIModelsContextType {
  availableModels: AIModel[];
  connectedModels: AIModel[];
  connectModel: (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => void;
  disconnectModel: (modelId: string) => void;
  updateModelConfig: (modelId: string, config: Partial<AIModelConfiguration>) => void;
  toggleModelActive: (modelId: string) => void;
}

const AIModelsContext = createContext<AIModelsContextType | undefined>(undefined);

export function AIModelsProvider({ children }: { children: ReactNode }) {
  const [availableModels, setAvailableModels] = useState<AIModel[]>(initialAvailableModels);
  const [connectedModels, setConnectedModels] = useState<AIModel[]>(initialConnectedModels);

  const connectModel = (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => {
    // Check if model is already connected
    if (connectedModels.some(m => m.id === model.id)) {
      console.warn('Model is already connected');
      return;
    }

    const connectedModel: AIModel = {
      ...model,
      apiKey,
      isActive: true,
      usageCount: 0,
      lastUsed: 'Just now',
      status: 'Connected',
      configuration
    };

    setConnectedModels([...connectedModels, connectedModel]);
  };

  const disconnectModel = (modelId: string) => {
    setConnectedModels(connectedModels.filter(model => model.id !== modelId));
  };

  const updateModelConfig = (modelId: string, config: Partial<AIModelConfiguration>) => {
    setConnectedModels(
      connectedModels.map(model => 
        model.id === modelId
          ? { ...model, configuration: { ...model.configuration, ...config } }
          : model
      )
    );
  };

  const toggleModelActive = (modelId: string) => {
    setConnectedModels(
      connectedModels.map(model => 
        model.id === modelId
          ? { ...model, isActive: !model.isActive }
          : model
      )
    );
  };

  return (
    <AIModelsContext.Provider value={{
      availableModels,
      connectedModels,
      connectModel,
      disconnectModel,
      updateModelConfig,
      toggleModelActive
    }}>
      {children}
    </AIModelsContext.Provider>
  );
}

export const useAIModels = () => {
  const context = useContext(AIModelsContext);
  if (context === undefined) {
    throw new Error('useAIModels must be used within an AIModelsProvider');
  }
  return context;
};
