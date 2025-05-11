
import { useState, useEffect } from "react";
import { useAIModels } from "@/context/AIModelsContext";
import { ModelList } from "./ai-model/ModelList";
import { ModelInfoCard } from "./ai-model/ModelInfoCard";
import { NoModelsAlert } from "./ai-model/NoModelsAlert";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Info } from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface AIModelTabProps {
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  updatePreview: () => void;
}

export function AIModelTab({ selectedModelId, setSelectedModelId, updatePreview }: AIModelTabProps) {
  const { connectedModels } = useAIModels();
  const [loading, setLoading] = useState(false);

  // Filter only active models
  const availableModels = connectedModels.filter(model => model.isActive);

  const handleModelChange = (modelId: string) => {
    setLoading(true);
    setSelectedModelId(modelId);
    updatePreview();
    
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    // If no model selected and we have available models, select the first one
    if (!selectedModelId && availableModels.length > 0) {
      setSelectedModelId(availableModels[0].id);
    }
  }, [selectedModelId, availableModels, setSelectedModelId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium">AI Model Selection</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {availableModels.length} Available
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Select which AI model will power your chat widget
          </p>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configure Models</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Manage your AI models in the AI Models section</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      {availableModels.length === 0 ? (
        <div className="space-y-4">
          <NoModelsAlert />
          
          <div className="flex justify-center">
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Connect Your First Model
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50/50 rounded-md border border-blue-100 p-3 flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5" />
            <p className="text-xs text-blue-700">
              Select the model that best fits your needs. More advanced models provide better responses but may have higher usage costs.
            </p>
          </div>
          
          <ModelList
            selectedModelId={selectedModelId}
            handleModelChange={handleModelChange}
            loading={loading}
          />
          
          <ModelInfoCard selectedModelId={selectedModelId} />
        </div>
      )}
    </div>
  );
}
