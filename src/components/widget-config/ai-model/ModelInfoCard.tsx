
import { Card, CardContent } from "@/components/ui/card";
import { Info, Bot, Cpu, MessageSquare, BarChart3, Sparkles, Star } from "lucide-react";
import { useAIModels } from "@/context/AIModelsContext";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ModelInfoCardProps {
  selectedModelId: string;
}

export function ModelInfoCard({ selectedModelId }: ModelInfoCardProps) {
  const { connectedModels } = useAIModels();
  const selectedModel = connectedModels.find(model => model.id === selectedModelId);

  return (
    <Card className={cn(
      "border transition-all duration-200",
      selectedModel ? "bg-blue-50/50 border-blue-200" : "bg-gray-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <CardIconWrapper selectedModel={selectedModel} />
          
          <div className="flex-1">
            <CardHeader selectedModel={selectedModel} />
            
            {selectedModel ? (
              <ModelDetails model={selectedModel} />
            ) : (
              <EmptyModelState />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CardIconWrapper({ selectedModel }) {
  return (
    <div className={cn(
      "rounded-full p-1.5 flex items-center justify-center",
      selectedModel ? "bg-blue-100" : "bg-gray-200"
    )}>
      <Info className={cn(
        "h-4 w-4", 
        selectedModel ? "text-blue-500" : "text-gray-500"
      )} />
    </div>
  );
}

function CardHeader({ selectedModel }) {
  return (
    <h4 className="font-medium text-sm flex items-center gap-1">
      {selectedModel ? (
        <>
          {getModelIcon(selectedModel.provider)}
          {selectedModel.name}
        </>
      ) : (
        "Select a Model"
      )}
    </h4>
  );
}

function ModelDetails({ model }) {
  const capabilityScore = getModelCapabilityScore(model);
  
  return (
    <div className="mt-3 space-y-4">
      <p className="text-xs text-gray-600">
        {model.description || 
          "This model will process all conversations in your chat widget. Its capabilities determine the quality and style of responses."}
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        <CapabilityCard score={capabilityScore} />
        <UsageCard usageCount={model.usageCount} />
      </div>

      {model.configuration && (
        <ConfigurationCard configuration={model.configuration} />
      )}
    </div>
  );
}

function CapabilityCard({ score }) {
  return (
    <div className="bg-white rounded-md p-2 border border-blue-100">
      <div className="flex items-center text-xs text-gray-600 space-x-1.5 mb-1.5">
        <MessageSquare className="h-3 w-3 text-blue-500" />
        <span className="font-medium">Capability</span>
      </div>
      <div className="space-y-1.5">
        <Progress value={score} className="h-1.5" />
        <p className="text-[10px] text-gray-500">
          {score >= 75 ? "High" : 
            score >= 50 ? "Medium" : "Basic"} capability model
        </p>
      </div>
    </div>
  );
}

function UsageCard({ usageCount }) {
  return (
    <div className="bg-white rounded-md p-2 border border-blue-100">
      <div className="flex items-center text-xs text-gray-600 space-x-1.5 mb-1.5">
        <BarChart3 className="h-3 w-3 text-blue-500" />
        <span className="font-medium">Usage</span>
      </div>
      <div className="flex items-baseline">
        <span className="text-sm font-medium">
          {usageCount?.toLocaleString() || 0}
        </span>
        <span className="text-[10px] text-gray-500 ml-1">conversations</span>
      </div>
    </div>
  );
}

function ConfigurationCard({ configuration }) {
  return (
    <div className="bg-white rounded-md p-2 border border-blue-100">
      <div className="flex items-center text-xs text-gray-600 space-x-1.5 mb-1.5">
        <Cpu className="h-3 w-3 text-blue-500" />
        <span className="font-medium">Configuration</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        {configuration.temperature !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Temperature:</span>
            <span className="font-medium">{configuration.temperature}</span>
          </div>
        )}
        {configuration.maxTokens !== undefined && (
          <div className="flex justify-between">
            <span className="text-gray-500">Max Tokens:</span>
            <span className="font-medium">{configuration.maxTokens}</span>
          </div>
        )}
        {configuration.systemPrompt && (
          <div className="col-span-2 mt-1">
            <span className="text-gray-500">System Prompt:</span>
            <p className="font-mono text-[10px] bg-gray-50 p-1 mt-1 rounded border line-clamp-2">
              {configuration.systemPrompt}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyModelState() {
  return (
    <p className="text-xs text-gray-600 mt-1">
      Please select an AI model from the options above to power your chat widget.
      Different models have different capabilities and response styles.
    </p>
  );
}

// Helper functions
function getModelCapabilityScore(model) {
  if (!model) return 50;
  
  // This is a simple heuristic - in a real app you'd have real metrics
  const modelTypeFactor = model.type.toLowerCase().includes('large') ? 80 : 60;
  const configFactor = model.configuration?.temperature ? 
    Math.max(40, 100 - model.configuration.temperature * 50) : 70;
  
  return Math.min(100, Math.round((modelTypeFactor + configFactor) / 2));
}

function getModelIcon(provider: string) {
  switch ((provider || '').toLowerCase()) {
    case 'openai':
      return <Sparkles className="h-4 w-4 text-green-500" />;
    case 'anthropic':
      return <Star className="h-4 w-4 text-purple-500" />;
    default:
      return <Bot className="h-4 w-4 text-blue-500" />;
  }
}
