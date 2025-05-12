import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AIProviderConfig } from '@/types/aiProviderConfig';
import aiProviderConfigService from '@/services/aiProviderConfigService';
import { useToast } from '@/components/ui/use-toast';

interface AIProviderConfigContextType {
  providerConfigs: AIProviderConfig[];
  createProviderConfig: (config: Partial<AIProviderConfig>) => Promise<void>;
  updateProviderConfig: (id: number, config: Partial<AIProviderConfig>) => Promise<void>;
  deleteProviderConfig: (id: number) => Promise<void>;
  testConnection: (id: number) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

const AIProviderConfigContext = createContext<AIProviderConfigContextType | undefined>(undefined);

export function AIProviderConfigProvider({ children }: { children: ReactNode }) {
  const [providerConfigs, setProviderConfigs] = useState<AIProviderConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch provider configurations on component mount
  useEffect(() => {
    const fetchProviderConfigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await aiProviderConfigService.getProviderConfigs();
        setProviderConfigs(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error("Error fetching provider configurations:", errorMessage);
        setError("Failed to load AI provider configurations. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load AI provider configurations. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProviderConfigs();
  }, [toast]);

  const createProviderConfig = async (config: Partial<AIProviderConfig>) => {
    try {
      setLoading(true);
      const newConfig = await aiProviderConfigService.createProviderConfig(config);
      setProviderConfigs([...providerConfigs, newConfig]);
      toast({
        title: "Success",
        description: `${config.display_name} has been successfully created.`,
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error creating provider configuration:", errorMessage);
      setError("Failed to create provider configuration. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create provider configuration. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProviderConfig = async (id: number, config: Partial<AIProviderConfig>) => {
    try {
      setLoading(true);
      const updatedConfig = await aiProviderConfigService.updateProviderConfig(id, config);
      setProviderConfigs(
        providerConfigs.map(config => 
          config.id === id ? updatedConfig : config
        )
      );
      toast({
        title: "Success",
        description: `${updatedConfig.display_name} has been successfully updated.`,
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error updating provider configuration:", errorMessage);
      setError("Failed to update provider configuration. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update provider configuration. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProviderConfig = async (id: number) => {
    try {
      setLoading(true);
      await aiProviderConfigService.deleteProviderConfig(id);
      setProviderConfigs(providerConfigs.filter(config => config.id !== id));
      toast({
        title: "Success",
        description: "Provider configuration has been successfully deleted.",
        variant: "default",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error("Error deleting provider configuration:", errorMessage);
      setError("Failed to delete provider configuration. Please try again.");
      toast({
        title: "Error",
        description: "Failed to delete provider configuration. Please try again.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      const result = await aiProviderConfigService.testConnection(id);
      
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
    <AIProviderConfigContext.Provider value={{
      providerConfigs,
      createProviderConfig,
      updateProviderConfig,
      deleteProviderConfig,
      testConnection,
      loading,
      error
    }}>
      {children}
    </AIProviderConfigContext.Provider>
  );
}

export const useAIProviderConfig = () => {
  const context = useContext(AIProviderConfigContext);
  if (context === undefined) {
    throw new Error('useAIProviderConfig must be used within an AIProviderConfigProvider');
  }
  return context;
};
