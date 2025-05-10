
import { useState, useEffect } from "react";
import { useAIModels } from "@/context/AIModelsContext";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bot, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div>
        <h3 className="text-base font-medium mb-2">AI Model Selection</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select which AI model will power your chat widget interactions
        </p>
      </div>

      {availableModels.length === 0 ? (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">No Active AI Models</h4>
                <p className="text-xs text-gray-600 mt-1">
                  You need to connect and activate at least one AI model before you can use the chat widget.
                </p>
                <a href="/admin/ai-models" className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Go to AI Models page
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <RadioGroup value={selectedModelId} onValueChange={handleModelChange}>
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-start space-x-3 p-4 border rounded-md">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))
            ) : (
              availableModels.map(model => (
                <div key={model.id} className={`flex items-start space-x-3 p-4 border rounded-md ${selectedModelId === model.id ? 'bg-blue-50 border-blue-200' : ''}`}>
                  <RadioGroupItem value={model.id} id={`model-${model.id}`} />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`model-${model.id}`} className="font-medium">
                        {model.name}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          Active
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{model.description}</p>
                    
                    {model.usageCount !== undefined && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Bot className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {model.usageCount.toLocaleString()} conversations
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </RadioGroup>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">Model Performance</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Chat performance depends on the selected model. Higher-capability models may provide better responses
                    but could have higher usage costs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
