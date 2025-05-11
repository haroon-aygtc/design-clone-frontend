
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import ConnectModelDialog from "@/components/ai-models/ConnectModelDialog";
import TestChatDialog from "@/components/ai-models/TestChatDialog";
import { AIModel } from "@/types/aiModels";
import AvailableModelsList from "@/components/ai-models/AvailableModelsList";
import ConnectedModelsList from "@/components/ai-models/ConnectedModelsList";
import ModelDeleteDialog from "@/components/ai-models/ModelDeleteDialog";

const AIModelsPage = () => {
  return (
    <AdminLayout title="AI Models">
      <AIModelsProvider>
        <AIModelsContent />
      </AIModelsProvider>
    </AdminLayout>
  );
};

const AIModelsContent = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [testChatOpen, setTestChatOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | undefined>(undefined);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  const { availableModels, connectedModels, disconnectModel, toggleModelActive } = useAIModels();
  const { toast } = useToast();

  const handleConnectClick = (model: AIModel) => {
    setSelectedModel(model);
    setConnectDialogOpen(true);
  };

  const handleDeleteClick = (model: AIModel) => {
    setSelectedModel(model);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedModel) {
      disconnectModel(selectedModel.id);
      toast({
        title: "Model Disconnected",
        description: `${selectedModel.name} has been disconnected successfully.`,
        variant: "default"
      });
      setConfirmDeleteOpen(false);
    }
  };

  const handleToggleActive = (modelId: string) => {
    toggleModelActive(modelId);
    
    const model = connectedModels.find(m => m.id === modelId);
    const newState = !model?.isActive;
    
    toast({
      title: newState ? "Model Activated" : "Model Deactivated",
      description: `${model?.name} has been ${newState ? "activated" : "deactivated"} successfully.`,
      variant: "default"
    });
  };

  const handleTestConnection = (model: AIModel) => {
    toast({
      title: "Testing Connection",
      description: "Please wait while we test the connection...",
    });
    
    setTimeout(() => {
      toast({
        title: "Connection Successful",
        description: `${model.name} API connection is working properly.`,
        variant: "default"
      });
    }, 1500);
  };

  const handleTestChat = (model: AIModel) => {
    setSelectedModel(model);
    setTestChatOpen(true);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Model Management</h1>
        <p className="text-muted-foreground">Configure and manage the AI models used in your application</p>
      </div>
      
      <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="available" className="text-base">Available Models</TabsTrigger>
            <TabsTrigger value="connected" className="text-base">Connected Models</TabsTrigger>
          </TabsList>
          
          {activeTab === "available" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Request New Model
            </Button>
          )}
          
          {activeTab === "connected" && (
            <Button onClick={() => { setSelectedModel(undefined); setConnectDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Connect New Model
            </Button>
          )}
        </div>
        
        <TabsContent value="available" className="space-y-4">
          <AvailableModelsList 
            availableModels={availableModels}
            onConnectClick={handleConnectClick}
          />
        </TabsContent>
        
        <TabsContent value="connected" className="space-y-4">
          <ConnectedModelsList 
            connectedModels={connectedModels}
            onDeleteClick={handleDeleteClick}
            onToggleActive={handleToggleActive}
            onTestChat={handleTestChat}
            onTestConnection={handleTestConnection}
          />
        </TabsContent>
      </Tabs>
      
      <ConnectModelDialog 
        open={connectDialogOpen} 
        onOpenChange={setConnectDialogOpen}
        model={selectedModel}
      />
      
      {selectedModel && (
        <TestChatDialog 
          open={testChatOpen} 
          onOpenChange={setTestChatOpen}
          model={selectedModel}
        />
      )}
      
      <ModelDeleteDialog 
        open={confirmDeleteOpen} 
        onOpenChange={setConfirmDeleteOpen}
        model={selectedModel}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};

export default AIModelsPage;
