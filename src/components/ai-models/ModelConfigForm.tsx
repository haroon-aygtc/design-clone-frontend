
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { AIModel, AIModelConfiguration } from "@/types/aiModels";
import { useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Cog, ChevronDown, ChevronUp } from "lucide-react";

interface ModelConfigFormProps {
  model: AIModel;
}

const ModelConfigForm = ({ model }: ModelConfigFormProps) => {
  const { updateModelConfig } = useAIModels();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const [config, setConfig] = useState<AIModelConfiguration>({
    temperature: model.configuration?.temperature || 0.7,
    maxTokens: model.configuration?.maxTokens || 2000,
    topP: model.configuration?.topP || 1,
    frequencyPenalty: model.configuration?.frequencyPenalty || 0,
    presencePenalty: model.configuration?.presencePenalty || 0,
    systemPrompt: model.configuration?.systemPrompt || "You are a helpful assistant.",
    apiEndpoint: model.configuration?.apiEndpoint || ""
  });

  const handleChange = (field: keyof AIModelConfiguration, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateModelConfig(model.id, config);
    
    toast({
      title: "Configuration Updated",
      description: `${model.name} configuration has been updated successfully.`,
      variant: "default"
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md p-4 mt-4"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cog className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-base font-medium">Advanced Configuration</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="mt-4 space-y-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <Label>Temperature: {config.temperature}</Label>
            </div>
            <Slider 
              value={[config.temperature || 0.7]} 
              min={0} 
              max={1} 
              step={0.01}
              onValueChange={(values) => handleChange('temperature', values[0])} 
            />
            <p className="text-xs text-muted-foreground mt-1">0 = deterministic, 1 = creative</p>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label>Max Tokens</Label>
            </div>
            <Input
              type="number"
              value={config.maxTokens}
              onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
              min={1}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label>Top P: {config.topP}</Label>
            </div>
            <Slider 
              value={[config.topP || 1]} 
              min={0} 
              max={1} 
              step={0.01}
              onValueChange={(values) => handleChange('topP', values[0])} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label>Frequency Penalty: {config.frequencyPenalty}</Label>
            </div>
            <Slider 
              value={[config.frequencyPenalty || 0]} 
              min={0} 
              max={2} 
              step={0.01}
              onValueChange={(values) => handleChange('frequencyPenalty', values[0])} 
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <Label>Presence Penalty: {config.presencePenalty}</Label>
            </div>
            <Slider 
              value={[config.presencePenalty || 0]} 
              min={0} 
              max={2} 
              step={0.01}
              onValueChange={(values) => handleChange('presencePenalty', values[0])} 
            />
          </div>
          
          <div>
            <Label>System Prompt</Label>
            <Textarea
              value={config.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              className="h-24 mt-1"
            />
          </div>
          
          <div>
            <Label>API Endpoint</Label>
            <Input
              value={config.apiEndpoint}
              onChange={(e) => handleChange('apiEndpoint', e.target.value)}
              placeholder="Default provider endpoint"
            />
            <p className="text-xs text-muted-foreground mt-1">Leave empty to use default provider endpoint</p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Configuration</Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ModelConfigForm;
