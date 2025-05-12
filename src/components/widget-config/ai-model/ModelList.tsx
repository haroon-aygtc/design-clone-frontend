
import { useState } from "react";
import { useAIModels } from "@/context/AIModelsContext";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bot, Star, Sparkles, Zap, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ModelListProps {
  selectedModelId: string;
  handleModelChange: (modelId: string) => void;
  loading: boolean;
}

export function ModelList({ selectedModelId, handleModelChange, loading }: ModelListProps) {
  const { connectedModels } = useAIModels();
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  
  // Filter only active models
  const availableModels = connectedModels.filter(model => model.isActive);

  if (loading) {
    return <ModelListSkeleton />;
  }

  if (availableModels.length === 0) {
    return <EmptyModelList />;
  }

  // Group models by provider
  const modelsByProvider = groupModelsByProvider(availableModels);

  return (
    <TooltipProvider delayDuration={300}>
      <RadioGroup value={selectedModelId} onValueChange={handleModelChange} className="space-y-6">
        {Object.entries(modelsByProvider).map(([provider, models]) => (
          <ProviderModelGroup 
            key={provider} 
            provider={provider}
            models={models}
            selectedModelId={selectedModelId}
            hoveredModelId={hoveredModelId}
            setHoveredModelId={setHoveredModelId}
            handleModelChange={handleModelChange}
          />
        ))}
      </RadioGroup>
    </TooltipProvider>
  );
}

// Group models by their provider
function groupModelsByProvider(models) {
  const grouped = {};
  models.forEach(model => {
    if (!grouped[model.provider]) {
      grouped[model.provider] = [];
    }
    grouped[model.provider].push(model);
  });
  return grouped;
}

// Provider group component
function ProviderModelGroup({ 
  provider, 
  models, 
  selectedModelId, 
  hoveredModelId, 
  setHoveredModelId, 
  handleModelChange 
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        {getModelIcon(provider)}
        {provider} Models
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {models.map(model => (
          <ModelCard
            key={model.id}
            model={model}
            isSelected={selectedModelId === model.id}
            isHovered={hoveredModelId === model.id}
            onMouseEnter={() => setHoveredModelId(model.id)}
            onMouseLeave={() => setHoveredModelId(null)}
            onClick={() => handleModelChange(model.id)}
          />
        ))}
      </div>
    </div>
  );
}

// Model card component
function ModelCard({ model, isSelected, isHovered, onMouseEnter, onMouseLeave, onClick }) {
  return (
    <div
      className={cn(
        "relative cursor-pointer rounded-lg border p-4 transition-all duration-200",
        isSelected 
          ? "border-primary bg-primary/5 shadow-sm" 
          : "hover:border-primary/50 hover:bg-primary/2"
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <RadioGroupItem 
        value={model.id} 
        id={`model-${model.id}`} 
        className="absolute right-4 top-4"
      />
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label 
            htmlFor={`model-${model.id}`} 
            className="font-medium cursor-pointer"
          >
            {model.name}
          </Label>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
        
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Badge variant="outline" className="text-xs">
            {model.type}
          </Badge>
          
          {model.usageCount !== undefined && (
            <ModelUsageTooltip usageCount={model.usageCount} />
          )}
          
          {(isHovered || isSelected) && (
            <ModelInfoTooltip />
          )}
        </div>
      </div>
    </div>
  );
}

function ModelUsageTooltip({ usageCount }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center text-xs text-gray-500 gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
          <Bot className="h-3 w-3 text-gray-400" />
          <span>{usageCount.toLocaleString()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Used in {usageCount.toLocaleString()} conversations</p>
      </TooltipContent>
    </Tooltip>
  );
}

function ModelInfoTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center ml-auto">
          <Info className="h-3.5 w-3.5 text-blue-500" />
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to select this model</p>
      </TooltipContent>
    </Tooltip>
  );
}

// Loading skeleton component
function ModelListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Empty state component
function EmptyModelList() {
  return (
    <Card className="p-6 text-center border-dashed">
      <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="font-medium text-lg mb-2">No Active Models Available</h3>
      <p className="text-sm text-muted-foreground mb-4">
        You need to connect and activate an AI model before you can use it in your widget.
      </p>
    </Card>
  );
}

// Helper function to get appropriate icon based on provider
function getModelIcon(provider: string) {
  switch (provider.toLowerCase()) {
    case 'openai':
      return <Sparkles className="h-4 w-4" />;
    case 'anthropic':
      return <Star className="h-4 w-4" />;
    case 'google':
      return <Zap className="h-4 w-4" />;
    default:
      return <Bot className="h-4 w-4" />;
  }
}
