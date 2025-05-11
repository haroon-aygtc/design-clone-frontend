
import { Card, CardContent } from "@/components/ui/card";
import { Info, Bot, Cpu } from "lucide-react";
import { useAIModels } from "@/context/AIModelsContext";

interface ModelInfoCardProps {
  selectedModelId: string;
}

export function ModelInfoCard({ selectedModelId }: ModelInfoCardProps) {
  const { connectedModels } = useAIModels();
  const selectedModel = connectedModels.find(model => model.id === selectedModelId);

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Model Information</h4>
            
            {selectedModel ? (
              <div className="mt-2 space-y-3">
                <div className="flex items-center text-xs text-gray-600 space-x-2">
                  <Bot className="h-4 w-4 text-gray-500" />
                  <span>
                    <span className="font-medium">Provider:</span> {selectedModel.provider}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-600 space-x-2">
                  <Cpu className="h-4 w-4 text-gray-500" />
                  <span>
                    <span className="font-medium">Model Type:</span> {selectedModel.type}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1">
                  {selectedModel.description || "Chat performance depends on the selected model. Higher-capability models may provide better responses but could have higher usage costs."}
                </p>

                {selectedModel.configuration && (
                  <div className="text-xs text-gray-600 pt-1">
                    <div className="font-medium mb-1">Configuration:</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {selectedModel.configuration.temperature !== undefined && (
                        <div><span className="opacity-75">Temperature:</span> {selectedModel.configuration.temperature}</div>
                      )}
                      {selectedModel.configuration.maxTokens !== undefined && (
                        <div><span className="opacity-75">Max Tokens:</span> {selectedModel.configuration.maxTokens}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-gray-600 mt-1">
                Chat performance depends on the selected model. Higher-capability models may provide better responses
                but could have higher usage costs.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
