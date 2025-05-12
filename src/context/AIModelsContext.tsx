
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIModel, AIModelConfiguration } from '@/types/aiModels';
import aiModelService from '@/services/aiModelService';
import { useToast } from '@/components/ui/use-toast';

interface AIModelsContextType {
  availableModels: AIModel[];
  connectedModels: AIModel[];
  connectModel: (model: AIModel, apiKey: string, configuration?: AIModelConfiguration) => Promise<void>;
  addModel: (modelData: Partial<AIModel>) => Promise<void>;
  disconnectModel: (modelId: string) => void;
  updateModelConfig: (modelId: string, config: Partial<AIModelConfiguration>) => Promise<void>;
  toggleModelActive: (modelId: string) => Promise<void>;
  testConnection: (modelId: string) => Promise<boolean>;
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

  const addModel = async (modelData: Partial<AIModel>) => {
    try {
      setLoading(true);
      const newModel = await aiModelService.addModel(modelData);

      // Update both available and connected models
      setAvailableModels([...availableModels, newModel]);
      setConnectedModels([...connectedModels, newModel]);

      toast({
        title: "Model Added",
        description: `${newModel.name} has been successfully added.`,
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error adding model:", errorMessage);

      // Extract error message from the response if available
      let displayMessage = "Failed to add model. Please check your inputs and try again.";
      if (err.response?.data) {
        console.error("Error response data:", err.response.data);

        // Handle validation errors
        if (err.response.data.api_key) {
          displayMessage = `API Key Error: ${err.response.data.api_key}`;
        } else if (typeof err.response.data === 'string') {
          displayMessage = err.response.data;
        } else if (err.response.data.message) {
          displayMessage = err.response.data.message;
        }
      }

      setError(displayMessage);
      toast({
        title: "Error",
        description: displayMessage,
        variant: "destructive",
      });

      // Re-throw the error so the component can handle it
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (modelId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await aiModelService.testConnection(modelId);

      if (result.success) {
        toast({
          title: "Connection Successful",
          description: result.message || "Successfully connected to the AI provider.",
          variant: "default",
        });
        return true;
      } else {
        toast({
          title: "Connection Failed",
          description: result.message || "Failed to connect to the AI provider.",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error testing connection:", errorMessage);
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AIModelsContext.Provider value={{
      availableModels,
      connectedModels,
      connectModel,
      addModel,
      disconnectModel,
      updateModelConfig,
      toggleModelActive,
      testConnection,
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
