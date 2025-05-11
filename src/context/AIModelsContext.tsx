
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';
import aiModelService from '@/services/aiModelService';

interface AIModelsContextType {
  availableModels: AIModel[];
  connectedModels: AIModel[];
  connectModel: (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => void;
  disconnectModel: (modelId: string) => void;
  updateModelConfig: (modelId: string, config: Partial<AIModelConfiguration>) => void;
  toggleModelActive: (modelId: string) => void;
  loading: boolean;
  error: string | null;
}

const AIModelsContext = createContext<AIModelsContextType | undefined>(undefined);

export function AIModelsProvider({ children }: { children: ReactNode }) {
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [connectedModels, setConnectedModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a production environment, these would call the real API
        const availableModelsData = await aiModelService.getAvailableModels();
        const connectedModelsData = await aiModelService.getConnectedModels();
        
        setAvailableModels(availableModelsData);
        setConnectedModels(connectedModelsData);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to load AI models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const connectModel = async (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => {
    // Check if model is already connected
    if (connectedModels.some(m => m.id === model.id)) {
      console.warn('Model is already connected');
      return;
    }

    try {
      setLoading(true);
      // In production, this would call the real API
      await aiModelService.connectModel(model.id, apiKey, configuration);
      
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
    } catch (err) {
      console.error("Error connecting model:", err);
      setError("Failed to connect model. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const disconnectModel = (modelId: string) => {
    setConnectedModels(connectedModels.filter(model => model.id !== modelId));
  };

  const updateModelConfig = async (modelId: string, config: Partial<AIModelConfiguration>) => {
    try {
      setLoading(true);
      // In production, this would call the real API
      await aiModelService.updateModelConfig(modelId, config);
      
      setConnectedModels(
        connectedModels.map(model => 
          model.id === modelId
            ? { ...model, configuration: { ...model.configuration, ...config } }
            : model
        )
      );
    } catch (err) {
      console.error("Error updating model config:", err);
      setError("Failed to update model configuration.");
    } finally {
      setLoading(false);
    }
  };

  const toggleModelActive = async (modelId: string) => {
    try {
      setLoading(true);
      // In production, this would call the real API
      await aiModelService.toggleModelActive(modelId);
      
      setConnectedModels(
        connectedModels.map(model => 
          model.id === modelId
            ? { ...model, isActive: !model.isActive }
            : model
        )
      );
    } catch (err) {
      console.error("Error toggling model active state:", err);
      setError("Failed to update model status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIModelsContext.Provider value={{
      availableModels,
      connectedModels,
      connectModel,
      disconnectModel,
      updateModelConfig,
      toggleModelActive,
      loading,
      error
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
