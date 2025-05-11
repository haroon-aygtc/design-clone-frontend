
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
import { Bot, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  model?: AIModel; // Optional: if connecting an existing model
}

const ConnectModelDialog = ({ open, onOpenChange, model: preselectedModel }: ConnectModelDialogProps) => {
  const { connectModel, availableModels, connectedModels } = useAIModels();
  const { toast } = useToast();
  
  const [selectedModelId, setSelectedModelId] = useState<string>(preselectedModel?.id || "");
  const [apiKey, setApiKey] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [formError, setFormError] = useState("");

  // Update selected model when preselected model changes
  useEffect(() => {
    if (preselectedModel) {
      setSelectedModelId(preselectedModel.id);
    }
  }, [preselectedModel]);

  // Reset form error when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormError("");
    }
  }, [open]);

  const handleConnect = () => {
    setFormError(""); // Clear previous errors
    
    if (!selectedModelId) {
      setFormError("Please select a model");
      return;
    }

    if (!apiKey.trim()) {
      setFormError("Please provide an API key");
      return;
    }

    // Find the selected model from available models
    const modelToConnect = availableModels.find(m => m.id === selectedModelId);
    
    if (!modelToConnect) {
      setFormError("Selected model not found");
      return;
    }

    connectModel(modelToConnect, apiKey, {
      temperature: parseFloat(temperature),
      maxTokens: parseInt(maxTokens),
      systemPrompt: systemPrompt,
      apiEndpoint: apiEndpoint || undefined
    });

    toast({
      title: "Model Connected",
      description: `${modelToConnect.name} has been successfully connected.`,
      variant: "default"
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    if (!preselectedModel) {
      setSelectedModelId("");
    }
    setApiKey("");
    setTemperature("0.7");
    setMaxTokens("2000");
    setSystemPrompt("You are a helpful assistant.");
    setApiEndpoint("");
    setFormError("");
  };

  // Filter out models that are already connected
  const connectableModels = availableModels.filter(model => 
    !connectedModels.some(connectedModel => connectedModel.id === model.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Connect AI Model</DialogTitle>
              <DialogDescription>Select a model and enter your API key to connect.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        {formError && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid gap-4 py-4">
          {!preselectedModel && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model-select" className="text-right">
                Model
              </Label>
              <div className="col-span-3">
                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {connectableModels.length > 0 ? (
                      connectableModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name} ({model.provider})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No models available to connect
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {connectableModels.length === 0 && "All available models are already connected."}
                </p>
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
