
import { useState, useEffect } from "react";
import { useAIModels } from "@/context/AIModelsContext";
import { ModelList } from "./ai-model/ModelList";
import { ModelInfoCard } from "./ai-model/ModelInfoCard";
import { NoModelsAlert } from "./ai-model/NoModelsAlert";

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
        <NoModelsAlert />
      ) : (
        <div className="space-y-4">
          <ModelList
            selectedModelId={selectedModelId}
            handleModelChange={handleModelChange}
            loading={loading}
          />
          <ModelInfoCard />
        </div>
      )}
    </div>
  );
}
