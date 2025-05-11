
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';
import aiModelService from '@/services/aiModelService';
import { useToast } from '@/components/ui/use-toast';

interface AIModelsContextType {
  availableModels: AIModel[];
  connectedModels: AIModel[];
  connectModel: (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => Promise<void>;
  disconnectModel: (modelId: string) => void;
  updateModelConfig: (modelId: string, config: Partial<AIModelConfiguration>) => Promise<void>;
  toggleModelActive: (modelId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AIModelsContext = createContext<AIModelsContextType | undefined>(undefined);

export function AIModelsProvider({ children }: { children: ReactNode }) {
  const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
  const [connectedModels, setConnectedModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch models on component mount
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      setError(null);
      try {
        const [availableModelsData, connectedModelsData] = await Promise.all([
          aiModelService.getAvailableModels(),
          aiModelService.getConnectedModels()
        ]);
        
        setAvailableModels(availableModelsData);
        setConnectedModels(connectedModelsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error("Error fetching models:", errorMessage);
        setError("Failed to load AI models. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load AI models. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [toast]);

  const connectModel = async (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => {
    // Check if model is already connected
    if (connectedModels.some(m => m.id === model.id)) {
      toast({
        title: "Warning",
        description: "This model is already connected.",
        variant: "default",
      });
      return;
    }

    try {
      setLoading(true);
      const connectedModel = await aiModelService.connectModel(model.id, apiKey, configuration);
      setConnectedModels([...connectedModels, connectedModel]);
      toast({
        title: "Success",
        description: `${model.name} has been successfully connected.`,
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error connecting model:", errorMessage);
      setError("Failed to connect model. Please check your API key and try again.");
      toast({
        title: "Error",
        description: "Failed to connect model. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectModel = (modelId: string) => {
    // In a real implementation, this would call an API to disconnect the model
    // For now, we'll just remove it from the local state
    setConnectedModels(connectedModels.filter(model => model.id !== modelId));
    toast({
      title: "Model Disconnected",
      description: "The AI model has been disconnected.",
      variant: "default",
    });
  };

  const updateModelConfig = async (modelId: string, config: Partial<AIModelConfiguration>) => {
    try {
      setLoading(true);
      const updatedModel = await aiModelService.updateModelConfig(modelId, config);
      
      setConnectedModels(
        connectedModels.map(model => 
          model.id === modelId ? updatedModel : model
        )
      );
      
      toast({
        title: "Config Updated",
        description: "Model configuration has been updated successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error updating model config:", errorMessage);
      setError("Failed to update model configuration.");
      toast({
        title: "Error",
        description: "Failed to update model configuration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleModelActive = async (modelId: string) => {
    try {
      setLoading(true);
      const updatedModel = await aiModelService.toggleModelActive(modelId);
      
      setConnectedModels(
        connectedModels.map(model => 
          model.id === modelId ? updatedModel : model
        )
      );
      
      toast({
        title: "Status Updated",
        description: `Model is now ${updatedModel.isActive ? 'active' : 'inactive'}.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error toggling model active state:", errorMessage);
      setError("Failed to update model status.");
      toast({
        title: "Error",
        description: "Failed to update model status.",
        variant: "destructive",
      });
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
