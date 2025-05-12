import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { AIProviderConfigProvider, useAIProviderConfig } from "@/context/AIProviderConfigContext";
import { useToast } from "@/components/ui/use-toast";
import { AIProviderConfig } from "@/types/aiProviderConfig";
import {
  Plus,
  Search,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Zap,
  RefreshCw,
  Save,
  X,
  Edit,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AIProviderConfigsPage = () => {
  return (
    <AdminLayout title="AI Provider Configurations">
      <AIProviderConfigProvider>
        <AIProviderConfigsContent />
      </AIProviderConfigProvider>
    </AdminLayout>
  );
};

const AIProviderConfigsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<AIProviderConfig | null>(null);
  const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({});

  const { providerConfigs, deleteProviderConfig, testConnection, loading } = useAIProviderConfig();
  const { toast } = useToast();

  const filteredConfigs = providerConfigs.filter(config => {
    const matchesSearch = searchTerm === "" ||
      config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      config.display_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = showInactive || config.is_active;

    return matchesSearch && matchesStatus;
  });

  const handleCreateClick = () => {
    setSelectedConfig(null);
    setCreateDialogOpen(true);
  };

  const handleEditClick = (config: AIProviderConfig) => {
    setSelectedConfig(config);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (config: AIProviderConfig) => {
    setSelectedConfig(config);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedConfig) {
      try {
        await deleteProviderConfig(selectedConfig.id);
        setConfirmDeleteOpen(false);
      } catch (error) {
        console.error("Error deleting provider config:", error);
      }
    }
  };

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleTestConnection = async (id: number) => {
    await testConnection(id);
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Provider Configurations</h1>
          <p className="text-muted-foreground">Manage dynamic AI provider configurations</p>
        </div>

        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Provider
        </Button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers by name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="show-inactive"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <Label htmlFor="show-inactive">Show Inactive</Label>
        </div>
      </div>

      {/* Provider list */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading providers...</p>
          </div>
        </div>
      ) : filteredConfigs.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20 dark:bg-muted/10">
          <div className="mx-auto h-12 w-12 text-muted-foreground mb-3">
            <Settings className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Providers Found</h3>
          <p className="text-muted-foreground mb-4">
            {providerConfigs.length === 0
              ? "Add your first AI provider configuration to get started."
              : "No providers match your current filters."}
          </p>
          {providerConfigs.length === 0 && (
            <Button onClick={handleCreateClick}>
              <Plus className="mr-2 h-4 w-4" /> Add Provider
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredConfigs.map((config) => (
            <Card key={config.id} className={cn(
              "overflow-hidden border-gray-200 transition-all duration-200 hover:shadow-md",
              !config.is_active && "opacity-70"
            )}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{config.display_name}</CardTitle>
                      <Badge variant={config.is_active ? "default" : "outline"}>
                        {config.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {config.is_dynamic && (
                        <Badge variant="secondary">Dynamic</Badge>
                      )}
                    </div>
                    <CardDescription>{config.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(config)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">API URL</p>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded overflow-x-auto">
                      {config.api_url}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">API Key</p>
                    <div className="flex items-center">
                      <Input
                        value={showApiKey[config.id] ? config.api_key : '••••••••••••••••'}
                        type={showApiKey[config.id] ? "text" : "password"}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={() => toggleApiKeyVisibility(config.id)}
                      >
                        {showApiKey[config.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {config.description && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-1">Description</p>
                    <p className="text-sm">{config.description}</p>
                  </div>
                )}

                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="headers">
                    <AccordionTrigger>Headers</AccordionTrigger>
                    <AccordionContent>
                      {config.headers && Object.keys(config.headers).length > 0 ? (
                        <div className="bg-muted/50 p-2 rounded overflow-x-auto">
                          <pre className="text-xs">{JSON.stringify(config.headers, null, 2)}</pre>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No custom headers configured.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="default-params">
                    <AccordionTrigger>Default Parameters</AccordionTrigger>
                    <AccordionContent>
                      {config.default_params && Object.keys(config.default_params).length > 0 ? (
                        <div className="bg-muted/50 p-2 rounded overflow-x-auto">
                          <pre className="text-xs">{JSON.stringify(config.default_params, null, 2)}</pre>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No default parameters configured.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="endpoints">
                    <AccordionTrigger>Endpoints</AccordionTrigger>
                    <AccordionContent>
                      {config.endpoints && Object.keys(config.endpoints).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(config.endpoints).map(([name, endpoint]) => (
                            <div key={name} className="border p-2 rounded">
                              <p className="text-sm font-medium">{name}</p>
                              <p className="text-xs text-muted-foreground">
                                {endpoint.method} {endpoint.path}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No endpoints configured.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>

              <CardFooter className="border-t pt-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleTestConnection(config.id)}
                >
                  <Zap className="h-4 w-4 mr-1" /> Test Connection
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ProviderConfigDialog
        config={selectedConfig}
        open={createDialogOpen || editDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }
        }}
        isEditing={editDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider Configuration</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{selectedConfig?.display_name}" provider configuration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProviderConfigDialogProps {
  config: AIProviderConfig | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
}

const ProviderConfigDialog = ({ config, open, onOpenChange, isEditing }: ProviderConfigDialogProps) => {
  const { createProviderConfig, updateProviderConfig } = useAIProviderConfig();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<AIProviderConfig>>({
    name: '',
    display_name: '',
    description: '',
    api_url: '',
    api_key: '',
    headers: {},
    default_params: {},
    endpoints: {},
    is_dynamic: true,
    is_active: true
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [headersJson, setHeadersJson] = useState('{}');
  const [defaultParamsJson, setDefaultParamsJson] = useState('{}');
  const [endpointsJson, setEndpointsJson] = useState('{}');
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      if (isEditing && config) {
        setFormData({
          name: config.name,
          display_name: config.display_name,
          description: config.description || '',
          api_url: config.api_url,
          api_key: config.api_key || '',
          headers: config.headers || {},
          default_params: config.default_params || {},
          endpoints: config.endpoints || {},
          is_dynamic: config.is_dynamic,
          is_active: config.is_active
        });
        setHeadersJson(JSON.stringify(config.headers || {}, null, 2));
        setDefaultParamsJson(JSON.stringify(config.default_params || {}, null, 2));
        setEndpointsJson(JSON.stringify(config.endpoints || {}, null, 2));
      } else {
        setFormData({
          name: '',
          display_name: '',
          description: '',
          api_url: '',
          api_key: '',
          headers: {},
          default_params: {},
          endpoints: {},
          is_dynamic: true,
          is_active: true
        });
        setHeadersJson('{}');
        setDefaultParamsJson('{}');
        setEndpointsJson('{}');
      }
      setActiveTab('basic');
      setJsonErrors({});
    }
  }, [open, isEditing, config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const validateJson = (json: string, field: string): boolean => {
    try {
      JSON.parse(json);
      setJsonErrors(prev => ({
        ...prev,
        [field]: ''
      }));
      return true;
    } catch (error) {
      setJsonErrors(prev => ({
        ...prev,
        [field]: `Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
      return false;
    }
  };

  const handleJsonChange = (value: string, field: string, setter: (value: string) => void) => {
    setter(value);
    validateJson(value, field);
  };

  const handleSubmit = async () => {
    // Validate JSON fields
    const headersValid = validateJson(headersJson, 'headers');
    const defaultParamsValid = validateJson(defaultParamsJson, 'defaultParams');
    const endpointsValid = validateJson(endpointsJson, 'endpoints');

    if (!headersValid || !defaultParamsValid || !endpointsValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the JSON errors before submitting.",
        variant: "destructive",
      });
      return;
    }

    // Update form data with parsed JSON
    const updatedFormData = {
      ...formData,
      headers: JSON.parse(headersJson),
      default_params: JSON.parse(defaultParamsJson),
      endpoints: JSON.parse(endpointsJson)
    };

    try {
      if (isEditing && config) {
        await updateProviderConfig(config.id, updatedFormData);
      } else {
        await createProviderConfig(updatedFormData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving provider config:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit' : 'Add'} Provider Configuration</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the configuration for this AI provider.'
              : 'Configure a new AI provider to use with your application.'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <div className="p-1">
              <TabsContent value="basic" className="space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Provider ID</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., openai, anthropic"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Unique identifier used in code and API calls.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      name="display_name"
                      placeholder="e.g., OpenAI, Anthropic"
                      value={formData.display_name}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Human-readable name shown in the UI.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe this provider..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_url">API URL</Label>
                  <Input
                    id="api_url"
                    name="api_url"
                    placeholder="e.g., https://api.openai.com/v1"
                    value={formData.api_url}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Base URL for the provider's API.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api_key">API Key</Label>
                  <Input
                    id="api_key"
                    name="api_key"
                    type="password"
                    placeholder="Enter API key"
                    value={formData.api_key}
                    onChange={handleInputChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Authentication key for the provider's API. Will be stored encrypted.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_dynamic"
                    checked={formData.is_dynamic}
                    onCheckedChange={(checked) => handleSwitchChange('is_dynamic', checked)}
                  />
                  <Label htmlFor="is_dynamic">Dynamic Provider</Label>
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="headers">Headers</Label>
                  <Textarea
                    id="headers"
                    value={headersJson}
                    onChange={(e) => handleJsonChange(e.target.value, 'headers', setHeadersJson)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  {jsonErrors.headers && (
                    <p className="text-xs text-destructive">{jsonErrors.headers}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Custom HTTP headers to include in API requests (JSON format).
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_params">Default Parameters</Label>
                  <Textarea
                    id="default_params"
                    value={defaultParamsJson}
                    onChange={(e) => handleJsonChange(e.target.value, 'defaultParams', setDefaultParamsJson)}
                    rows={6}
                    className="font-mono text-sm"
                  />
                  {jsonErrors.defaultParams && (
                    <p className="text-xs text-destructive">{jsonErrors.defaultParams}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Default parameters to include in API requests (JSON format).
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="endpoints" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="endpoints">Endpoints Configuration</Label>
                  <Textarea
                    id="endpoints"
                    value={endpointsJson}
                    onChange={(e) => handleJsonChange(e.target.value, 'endpoints', setEndpointsJson)}
                    rows={15}
                    className="font-mono text-sm"
                  />
                  {jsonErrors.endpoints && (
                    <p className="text-xs text-destructive">{jsonErrors.endpoints}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Configure API endpoints for chat, completions, models, etc. (JSON format).
                  </p>
                </div>

                <div className="bg-muted/50 p-3 rounded">
                  <h4 className="text-sm font-medium mb-2">Example Endpoint Configuration</h4>
                  <pre className="text-xs overflow-x-auto">
{`{
  "chat": {
    "path": "chat/completions",
    "method": "POST",
    "request_template": {
      "model": "{{params.model}}",
      "messages": "{{messages}}",
      "temperature": "{{params.temperature}}"
    }
  },
  "models": {
    "path": "models",
    "method": "GET",
    "models_path": "data"
  }
}`}
                  </pre>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update' : 'Create'} Provider
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIProviderConfigsPage;
