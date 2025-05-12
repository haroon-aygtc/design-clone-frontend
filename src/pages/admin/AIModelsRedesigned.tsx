import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import { AIModel } from "@/types/aiModels";
import {
  Bot,
  Plus,
  Search,
  Filter,
  Settings,
  Trash2,
  Code,
  Activity,
  TestTube,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  RefreshCw,
  Save,
  HelpCircle,
  Sparkles,
  Sliders,
  MessageSquare,
  FileText,
  Layers,
  LayoutGrid,
  List as ListIcon,
  Star,
  StarOff,
  PlusCircle,
  Palette,
  Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ConnectModelDialog from "@/components/ai-models/ConnectModelDialog";

const AIModelsRedesigned = () => {
  return (
    <AdminLayout title="AI Models">
      <AIModelsProvider>
        <AIModelsContent />
      </AIModelsProvider>
    </AdminLayout>
  );
};

const AIModelsContent = () => {
  const navigate = useNavigate();

  // State for UI controls
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [favoriteModels, setFavoriteModels] = useState<string[]>([]);

  // State for dialogs and popovers
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel | undefined>(undefined);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});

  // Get models and toast from context
  const { connectedModels, disconnectModel, toggleModelActive, loading } = useAIModels();
  const { toast } = useToast();

  // Filter and sort models
  const filteredConnectedModels = connectedModels
    .filter(model => {
      const matchesSearch = searchTerm === "" ||
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.provider.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProvider = filterProvider === "all" ||
        model.provider.toLowerCase() === filterProvider.toLowerCase();

      const matchesType = filterType === "all" ||
        model.type.toLowerCase().includes(filterType.toLowerCase());

      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "active" && model.isActive) ||
        (filterStatus === "inactive" && !model.isActive);

      return matchesSearch && matchesProvider && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      // First sort by favorites
      const aIsFavorite = favoriteModels.includes(a.id);
      const bIsFavorite = favoriteModels.includes(b.id);

      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;

      // Then sort by the selected field
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "provider":
          comparison = a.provider.localeCompare(b.provider);
          break;
        case "type":
          comparison = a.type.localeCompare(b.type);
          break;
        case "usage":
          comparison = (a.usageCount || 0) - (b.usageCount || 0);
          break;
        case "lastUsed":
          const dateA = a.lastUsed ? new Date(a.lastUsed).getTime() : 0;
          const dateB = b.lastUsed ? new Date(b.lastUsed).getTime() : 0;
          comparison = dateA - dateB;
          break;
        default:
          comparison = a.name.localeCompare(b.name);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  // Handle model actions
  const handleConnectClick = (model?: AIModel) => {
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
    });
  };

  const handleTestConnection = async (modelId: string) => {
    // Navigate to the AI Model Tester page
    navigate(`/admin/ai-models/test/${modelId}`);
  };

  const toggleApiKeyVisibility = (modelId: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const toggleModelExpanded = (modelId: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const toggleFavorite = (modelId: string) => {
    setFavoriteModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const selectAllModels = () => {
    if (selectedModels.length === filteredConnectedModels.length) {
      setSelectedModels([]);
    } else {
      setSelectedModels(filteredConnectedModels.map(model => model.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedModels.length === 0) return;

    switch (action) {
      case "activate":
        selectedModels.forEach(id => {
          if (!connectedModels.find(m => m.id === id)?.isActive) {
            toggleModelActive(id);
          }
        });
        toast({
          title: "Models Activated",
          description: `${selectedModels.length} models have been activated.`,
        });
        break;
      case "deactivate":
        selectedModels.forEach(id => {
          if (connectedModels.find(m => m.id === id)?.isActive) {
            toggleModelActive(id);
          }
        });
        toast({
          title: "Models Deactivated",
          description: `${selectedModels.length} models have been deactivated.`,
        });
        break;
      case "delete":
        selectedModels.forEach(id => {
          disconnectModel(id);
        });
        toast({
          title: "Models Disconnected",
          description: `${selectedModels.length} models have been disconnected.`,
        });
        setSelectedModels([]);
        break;
    }

    setBulkActionOpen(false);
  };

  // Get unique providers for filter
  const providers = [...new Set(connectedModels.map(model => model.provider))];
  const types = [...new Set(connectedModels.map(model => model.type))];

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Models</h1>
          <p className="text-muted-foreground">Connect and manage AI models for your applications</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
            {viewMode === "grid" ? <ListIcon className="h-4 w-4 mr-1" /> : <LayoutGrid className="h-4 w-4 mr-1" />}
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>

          <div className="flex gap-2">
            <Button onClick={() => navigate("/admin/ai-models/add")}>
              <Plus className="mr-2 h-4 w-4" /> Add New Model
            </Button>
            <Button variant="outline" onClick={() => handleConnectClick()}>
              Connect Existing
            </Button>
          </div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models by name or provider..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={filterProvider} onValueChange={setFilterProvider}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              {providers.map(provider => (
                <SelectItem key={provider} value={provider.toLowerCase()}>{provider}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <Layers className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <Activity className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedModels.length > 0 && (
        <div className="flex items-center justify-between bg-muted/50 dark:bg-muted/20 p-2 rounded-md">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedModels.length === filteredConnectedModels.length && filteredConnectedModels.length > 0}
              onCheckedChange={selectAllModels}
              id="select-all"
            />
            <Label htmlFor="select-all">{selectedModels.length} models selected</Label>
          </div>

          <div className="flex items-center gap-2">
            <Popover open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Bulk Actions <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleBulkAction("activate")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Activate All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleBulkAction("deactivate")}
                  >
                    <AlertCircle className="mr-2 h-4 w-4" /> Deactivate All
                  </Button>
                  <Separator className="my-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start text-destructive hover:text-destructive"
                    onClick={() => handleBulkAction("delete")}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Disconnect All
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="sm" onClick={() => setSelectedModels([])}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Models display */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        </div>
      ) : filteredConnectedModels.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-muted/20 dark:bg-muted/10">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium mb-2">No Models Found</h3>
          <p className="text-muted-foreground mb-4">
            {connectedModels.length === 0
              ? "Connect your first AI model to get started."
              : "No models match your current filters."}
          </p>
          {connectedModels.length === 0 && (
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate("/admin/ai-models/add")}>
                <Plus className="mr-2 h-4 w-4" /> Add New Model
              </Button>
              <Button variant="outline" onClick={() => handleConnectClick()}>
                Connect Existing
              </Button>
            </div>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredConnectedModels.map((model) => (
            <ModelGridCard
              key={model.id}
              model={model}
              isSelected={selectedModels.includes(model.id)}
              isFavorite={favoriteModels.includes(model.id)}
              isExpanded={expandedModels[model.id] || false}
              showApiKey={showApiKey[model.id] || false}
              onToggleSelection={() => toggleModelSelection(model.id)}
              onToggleFavorite={() => toggleFavorite(model.id)}
              onToggleExpanded={() => toggleModelExpanded(model.id)}
              onToggleActive={() => handleToggleActive(model.id)}
              onToggleApiKey={() => toggleApiKeyVisibility(model.id)}
              onDelete={() => handleDeleteClick(model)}
              onTest={() => handleTestConnection(model.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 dark:bg-muted/20 rounded-md font-medium text-sm">
            <div className="col-span-1 flex items-center">
              <Checkbox
                checked={selectedModels.length === filteredConnectedModels.length && filteredConnectedModels.length > 0}
                onCheckedChange={selectAllModels}
                id="select-all-header"
              />
            </div>
            <div className="col-span-3 flex items-center gap-1 cursor-pointer" onClick={() => {
              setSortBy("name");
              setSortOrder(sortBy === "name" && sortOrder === "asc" ? "desc" : "asc");
            }}>
              Name
              {sortBy === "name" && (
                sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => {
              setSortBy("provider");
              setSortOrder(sortBy === "provider" && sortOrder === "asc" ? "desc" : "asc");
            }}>
              Provider
              {sortBy === "provider" && (
                sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => {
              setSortBy("type");
              setSortOrder(sortBy === "type" && sortOrder === "asc" ? "desc" : "asc");
            }}>
              Type
              {sortBy === "type" && (
                sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer" onClick={() => {
              setSortBy("usage");
              setSortOrder(sortBy === "usage" && sortOrder === "asc" ? "desc" : "asc");
            }}>
              Usage
              {sortBy === "usage" && (
                sortOrder === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
              )}
            </div>
            <div className="col-span-1 flex items-center">Status</div>
            <div className="col-span-1 flex items-center justify-end">Actions</div>
          </div>

          {/* Table rows */}
          {filteredConnectedModels.map((model) => (
            <ModelListRow
              key={model.id}
              model={model}
              isSelected={selectedModels.includes(model.id)}
              isFavorite={favoriteModels.includes(model.id)}
              isExpanded={expandedModels[model.id] || false}
              showApiKey={showApiKey[model.id] || false}
              onToggleSelection={() => toggleModelSelection(model.id)}
              onToggleFavorite={() => toggleFavorite(model.id)}
              onToggleExpanded={() => toggleModelExpanded(model.id)}
              onToggleActive={() => handleToggleActive(model.id)}
              onToggleApiKey={() => toggleApiKeyVisibility(model.id)}
              onDelete={() => handleDeleteClick(model)}
              onTest={() => handleTestConnection(model.id)}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
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
    </div>
  );
};

// Grid Card Component
interface ModelCardProps {
  model: AIModel;
  isSelected: boolean;
  isFavorite: boolean;
  isExpanded: boolean;
  showApiKey: boolean;
  onToggleSelection: () => void;
  onToggleFavorite: () => void;
  onToggleExpanded: () => void;
  onToggleActive: () => void;
  onToggleApiKey: () => void;
  onDelete: () => void;
  onTest?: () => void;
}

const ModelGridCard = ({
  model,
  isSelected,
  isFavorite,
  isExpanded,
  showApiKey,
  onToggleSelection,
  onToggleFavorite,
  onToggleExpanded,
  onToggleActive,
  onToggleApiKey,
  onDelete,
  onTest
}: ModelCardProps) => {
  return (
    <Card className={cn(
      "overflow-hidden border-gray-200 transition-all duration-200 hover:shadow-md",
      isSelected && "ring-2 ring-primary"
    )}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{model.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-yellow-500"
                  onClick={onToggleFavorite}
                >
                  {isFavorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
                </Button>
              </div>
              <CardDescription>{model.provider}</CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Switch checked={model.isActive} onCheckedChange={onToggleActive} />
                </TooltipTrigger>
                <TooltipContent>
                  {model.isActive ? "Deactivate Model" : "Activate Model"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onToggleExpanded}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={model.isActive ? "default" : "outline"}>
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
          <Badge variant="outline">{model.type}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Usage</span>
            <span className="font-medium">{model.usageCount?.toLocaleString() || 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Last Used</span>
            <span className="font-medium">{model.lastUsed || 'Never'}</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`api-key-${model.id}`}>API Key</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onToggleApiKey}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                id={`api-key-${model.id}`}
                value={showApiKey ? model.apiKey : model.apiKey?.replace(/./g, '•')}
                type={showApiKey ? "text" : "password"}
                readOnly
                className="text-sm font-mono h-8"
              />
            </div>

            <div className="space-y-2">
              <Label>Configuration</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">{model.configuration?.temperature || 0.7}</span>
                </div>
                <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">Max Tokens</span>
                  <span className="font-medium">{model.configuration?.maxTokens || 2000}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>System Prompt</Label>
              <div className="bg-muted/50 p-2 rounded text-sm">
                {model.configuration?.systemPrompt || "Default system prompt"}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className={cn("flex justify-between pt-3", isExpanded && "border-t")}>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Disconnect
        </Button>

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" /> Configure
          </Button>
          <Button variant="default" size="sm" onClick={onTest}>
            <Zap className="h-4 w-4 mr-1" /> Test
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// List Row Component
const ModelListRow = ({
  model,
  isSelected,
  isFavorite,
  isExpanded,
  showApiKey,
  onToggleSelection,
  onToggleFavorite,
  onToggleExpanded,
  onToggleActive,
  onToggleApiKey,
  onDelete,
  onTest
}: ModelCardProps) => {
  return (
    <div className={cn(
      "border rounded-md overflow-hidden mb-2 transition-all duration-200",
      isSelected && "ring-2 ring-primary"
    )}>
      <div className="grid grid-cols-12 gap-4 px-4 py-3 items-center">
        <div className="col-span-1 flex items-center gap-2">
          <Checkbox checked={isSelected} onCheckedChange={onToggleSelection} />
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-yellow-500"
            onClick={onToggleFavorite}
          >
            {isFavorite ? <Star className="h-4 w-4 text-yellow-500" /> : <StarOff className="h-4 w-4" />}
          </Button>
        </div>

        <div className="col-span-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{model.name}</div>
            <div className="text-xs text-muted-foreground">{model.apiKey ? "Connected" : "Not Connected"}</div>
          </div>
        </div>

        <div className="col-span-2">{model.provider}</div>
        <div className="col-span-2">{model.type}</div>
        <div className="col-span-2">{model.usageCount?.toLocaleString() || 0} calls</div>

        <div className="col-span-1">
          <Badge variant={model.isActive ? "default" : "outline"} className="whitespace-nowrap">
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="col-span-1 flex items-center justify-end gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch checked={model.isActive} onCheckedChange={onToggleActive} />
              </TooltipTrigger>
              <TooltipContent>
                {model.isActive ? "Deactivate Model" : "Activate Model"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleExpanded}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 py-3 border-t bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor={`list-api-key-${model.id}`}>API Key</Label>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={onToggleApiKey}
                >
                  {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                id={`list-api-key-${model.id}`}
                value={showApiKey ? model.apiKey : model.apiKey?.replace(/./g, '•')}
                type={showApiKey ? "text" : "password"}
                readOnly
                className="text-sm font-mono h-8"
              />
            </div>

            <div className="space-y-2">
              <Label>Configuration</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className="font-medium">{model.configuration?.temperature || 0.7}</span>
                </div>
                <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                  <span className="text-muted-foreground">Max Tokens</span>
                  <span className="font-medium">{model.configuration?.maxTokens || 2000}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>System Prompt</Label>
              <div className="bg-muted/50 p-2 rounded text-sm h-[60px] overflow-auto">
                {model.configuration?.systemPrompt || "Default system prompt"}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Disconnect
            </Button>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" /> Configure
              </Button>
              <Button variant="default" size="sm" onClick={onTest}>
                <Zap className="h-4 w-4 mr-1" /> Test
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIModelsRedesigned;
