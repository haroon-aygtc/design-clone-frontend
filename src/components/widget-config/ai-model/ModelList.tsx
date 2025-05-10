
import { useState } from "react";
import { useAIModels } from "@/context/AIModelsContext";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface ModelListProps {
  selectedModelId: string;
  handleModelChange: (modelId: string) => void;
  loading: boolean;
}

export function ModelList({ selectedModelId, handleModelChange, loading }: ModelListProps) {
  const { connectedModels } = useAIModels();
  
  // Filter only active models
  const availableModels = connectedModels.filter(model => model.isActive);

  return (
    <>
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
        <RadioGroup value={selectedModelId} onValueChange={handleModelChange}>
          {availableModels.map(model => (
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
          ))}
        </RadioGroup>
      )}
    </>
  );
}
