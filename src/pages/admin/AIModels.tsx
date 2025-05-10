
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Settings, Trash2, Code, Activity, TestTube, Eye, EyeOff } from "lucide-react";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import ConnectModelDialog from "@/components/ai-models/ConnectModelDialog";
import ModelConfigForm from "@/components/ai-models/ModelConfigForm";
import ModelCodeSnippet from "@/components/ai-models/ModelCodeSnippet";
import ModelLogs from "@/components/ai-models/ModelLogs";
import { AIModel } from "@/types/aiModels";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | undefined>(undefined);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  
  const { availableModels, connectedModels, disconnectModel, toggleModelActive } = useAIModels();
  const { toast } = useToast();

  const filteredAvailableModels = availableModels.filter(model => {
    const matchesSearch = searchTerm === "" || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || model.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

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

  const toggleApiKeyVisibility = (modelId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
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
    // Simulating API test
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

  return (
    <>
      <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="available">Available Models</TabsTrigger>
            <TabsTrigger value="connected">Connected Models</TabsTrigger>
          </TabsList>
          
          {activeTab === "available" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Request New Model
            </Button>
          )}
          
          {activeTab === "connected" && (
            <Button onClick={() => setConnectDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Connect New Model
            </Button>
          )}
        </div>
        
        <TabsContent value="available" className="space-y-4">
          <div className="flex justify-between mb-4">
            <Input 
              className="max-w-sm" 
              placeholder="Search models..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select 
              defaultValue="all" 
              value={filterType} 
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="large language model">Language Models</SelectItem>
                <SelectItem value="image">Image Generation</SelectItem>
                <SelectItem value="speech">Speech Processing</SelectItem>
                <SelectItem value="multimodal">Multimodal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAvailableModels.map((model) => (
              <Card key={model.id} className="overflow-hidden border-gray-200">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.provider}</CardDescription>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm">{model.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span>{model.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Status:</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        {model.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button variant="outline" className="mr-2">Learn More</Button>
                  <Button onClick={() => handleConnectClick(model)}>Connect</Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredAvailableModels.length === 0 && (
              <div className="col-span-full text-center py-10">
                <p className="text-muted-foreground">No models found matching your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="connected" className="space-y-4">
          {connectedModels.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-2">No Connected Models</h3>
              <p className="text-muted-foreground mb-4">Connect your first AI model to get started.</p>
              <Button onClick={() => setConnectDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Connect a Model
              </Button>
            </div>
          ) : (
            connectedModels.map((model) => (
              <Card key={model.id} className="overflow-hidden border-gray-200 mb-6">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{model.name}</CardTitle>
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Connected
                        </Badge>
                      </div>
                      <CardDescription>{model.provider} • {model.type}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Switch 
                          id={`model-${model.id}-active`} 
                          checked={model.isActive} 
                          onCheckedChange={() => handleToggleActive(model.id)}
                        />
                        <Label htmlFor={`model-${model.id}-active`}>Active</Label>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500"
                        onClick={() => handleDeleteClick(model)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">API Key</p>
                      <div className="flex items-center">
                        <Input 
                          value={showApiKey[model.id] ? model.apiKey : model.apiKey?.replace(/./g, '•')} 
                          type={showApiKey[model.id] ? "text" : "password"} 
                          readOnly 
                          className="text-sm font-mono" 
                        />
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2"
                          onClick={() => toggleApiKeyVisibility(model.id)}
                        >
                          {showApiKey[model.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Usage Count</p>
                      <p className="text-2xl font-bold">{model.usageCount?.toLocaleString() || 0}</p>
                      <p className="text-xs text-gray-500">Total API calls</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Used</p>
                      <p className="text-2xl font-bold">{model.lastUsed || 'Never'}</p>
                      <p className="text-xs text-gray-500">Recent activity</p>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="config" className="mt-6">
                    <TabsList className="w-full grid grid-cols-3">
                      <TabsTrigger value="config">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuration
                      </TabsTrigger>
                      <TabsTrigger value="code">
                        <Code className="h-4 w-4 mr-2" />
                        Code Example
                      </TabsTrigger>
                      <TabsTrigger value="logs">
                        <Activity className="h-4 w-4 mr-2" />
                        Logs
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="config" className="mt-4">
                      <ModelConfigForm model={model} />
                    </TabsContent>
                    
                    <TabsContent value="code">
                      <ModelCodeSnippet model={model} />
                    </TabsContent>
                    
                    <TabsContent value="logs">
                      <ModelLogs model={model} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
                
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline">Export Logs</Button>
                  <div>
                    <Button variant="outline" className="mr-2" onClick={() => handleTestConnection(model)}>
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      Advanced Settings
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
      
      <ConnectModelDialog 
        open={connectDialogOpen} 
        onOpenChange={setConnectDialogOpen}
        model={selectedModel}
      />
      
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Model</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect {selectedModel?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Disconnect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIModelsPage;
