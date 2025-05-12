
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AIModel } from "@/types/aiModels";
import { useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import { Bot } from "lucide-react";

interface ConnectModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: AIModel; // Optional: if connecting an existing model
}

const ConnectModelDialog = ({ open, onOpenChange, model: initialModel }: ConnectModelDialogProps) => {
  const { connectModel, availableModels } = useAIModels();
  const { toast } = useToast();

  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [model, setModel] = useState<AIModel | undefined>(initialModel);
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  const [apiEndpoint, setApiEndpoint] = useState("");

  // Update model when initialModel or selectedModelId changes
  useEffect(() => {
    if (initialModel) {
      setModel(initialModel);
      setSelectedModelId(initialModel.id);
    } else if (selectedModelId) {
      const selectedModel = availableModels.find(m => m.id === selectedModelId);
      setModel(selectedModel);
    }
  }, [initialModel, selectedModelId, availableModels]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (initialModel) {
        setSelectedModelId(initialModel.id);
      } else {
        setSelectedModelId("");
      }
    }
  }, [open, initialModel]);

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const handleConnect = () => {
    if (!model || !apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please select a model and provide an API key",
        variant: "destructive"
      });
      return;
    }

    connectModel(model, apiKey, {
      temperature: parseFloat(temperature),
      maxTokens: parseInt(maxTokens),
      systemPrompt: systemPrompt,
      apiEndpoint: apiEndpoint || undefined
    });

    toast({
      title: "Model Connected",
      description: `${model.name} has been successfully connected.`,
      variant: "default"
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    if (!initialModel) {
      setSelectedModelId("");
      setModel(undefined);
    }
    setApiKey("");
    setTemperature("0.7");
    setMaxTokens("2000");
    setSystemPrompt("You are a helpful assistant.");
    setApiEndpoint("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Connect {model?.name || "AI Model"}</DialogTitle>
              <DialogDescription>Enter your API key and configure model parameters.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!initialModel && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-select" className="text-right">
                Select Model
              </Label>
              <div className="col-span-3">
                <Select value={selectedModelId} onValueChange={handleModelSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels
                      .filter(m => m.status === 'Available')
                      .map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name} ({m.provider})
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">Choose an AI model to connect.</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key
            </Label>
            <div className="col-span-3">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
              />
              <p className="text-xs text-muted-foreground mt-1">Your API key will be stored securely.</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-endpoint" className="text-right">
              API Endpoint
            </Label>
            <Input
              id="api-endpoint"
              className="col-span-3"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.example.com/v1 (Optional)"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="temperature" className="text-right">
              Temperature
            </Label>
            <div className="col-span-3">
              <Input
                id="temperature"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">0 = deterministic, 1 = creative (0.7 recommended)</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="max-tokens" className="text-right">
              Max Tokens
            </Label>
            <Input
              id="max-tokens"
              className="col-span-3"
              type="number"
              min="1"
              value={maxTokens}
              onChange={(e) => setMaxTokens(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="system-prompt" className="text-right pt-2">
              System Prompt
            </Label>
            <Textarea
              id="system-prompt"
              className="col-span-3"
              rows={3}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleConnect}>Connect Model</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModelDialog;
