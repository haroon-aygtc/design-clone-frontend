import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { AIModelProvider, AIModelType } from "@/types/aiModels";
import { useAIModels } from "@/context/AIModelsContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Plus, Loader2 } from "lucide-react";

interface AddModelFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddModelForm = ({ open, onOpenChange }: AddModelFormProps) => {
  const { toast } = useToast();
  const { addModel, loading } = useAIModels();

  // Form state
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<AIModelProvider | "">("");
  const [customProvider, setCustomProvider] = useState("");
  const [type, setType] = useState<AIModelType | "">("");
  const [customType, setCustomType] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("2000");
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!provider && !customProvider) newErrors.provider = "Provider is required";
    if (!type && !customType) newErrors.type = "Type is required";
    if (!apiKey.trim()) newErrors.apiKey = "API Key is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const actualProvider = provider || customProvider;
    const actualType = type || customType;

    try {
      // Create the model data with both camelCase and snake_case for API key
      const modelData: any = {
        name,
        provider: actualProvider,
        type: actualType,
        description,
        apiKey,
        api_key: apiKey, // Add this in case the backend expects snake_case
        isActive,
        configuration: {
          temperature: parseFloat(temperature),
          maxTokens: parseInt(maxTokens),
          systemPrompt,
          apiEndpoint: apiEndpoint || undefined
        }
      };

      await addModel(modelData);

      toast({
        title: "Model Added",
        description: `${name} has been successfully added.`,
      });

      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error adding model:", error);

      // Extract error message from the response if available
      let errorMessage = "Failed to add model. Please try again.";
      if (error.response?.data) {
        console.error("Error response data:", error.response.data);

        // Handle validation errors
        if (error.response.data.api_key) {
          errorMessage = `API Key Error: ${error.response.data.api_key}`;
          setErrors(prev => ({ ...prev, apiKey: error.response.data.api_key }));
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setName("");
    setProvider("");
    setCustomProvider("");
    setType("");
    setCustomType("");
    setDescription("");
    setApiKey("");
    setApiEndpoint("");
    setIsActive(true);
    setTemperature("0.7");
    setMaxTokens("2000");
    setSystemPrompt("You are a helpful assistant.");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Add New AI Model</DialogTitle>
              <DialogDescription>Enter model details and configuration.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Model Name <span className="text-destructive">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., GPT-4, Claude 3"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="provider" className="text-right">
              Provider <span className="text-destructive">*</span>
            </Label>
            <div className="col-span-3">
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className={errors.provider ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OpenAI">OpenAI</SelectItem>
                  <SelectItem value="Anthropic">Anthropic</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Mistral AI">Mistral AI</SelectItem>
                  <SelectItem value="Cohere">Cohere</SelectItem>
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
              {provider === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom provider"
                  value={customProvider}
                  onChange={(e) => setCustomProvider(e.target.value)}
                />
              )}
              {errors.provider && <p className="text-xs text-destructive mt-1">{errors.provider}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Model Type <span className="text-destructive">*</span>
            </Label>
            <div className="col-span-3">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select model type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Large Language Model">Large Language Model</SelectItem>
                  <SelectItem value="Image Generation">Image Generation</SelectItem>
                  <SelectItem value="Speech Recognition">Speech Recognition</SelectItem>
                  <SelectItem value="Multimodal">Multimodal</SelectItem>
                  <SelectItem value="Other">Other (Custom)</SelectItem>
                </SelectContent>
              </Select>
              {type === "Other" && (
                <Input
                  className="mt-2"
                  placeholder="Enter custom model type"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                />
              )}
              {errors.type && <p className="text-xs text-destructive mt-1">{errors.type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the model"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="api-key" className="text-right">
              API Key <span className="text-destructive">*</span>
            </Label>
            <div className="col-span-3">
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className={errors.apiKey ? "border-destructive" : ""}
              />
              {errors.apiKey && <p className="text-xs text-destructive mt-1">{errors.apiKey}</p>}
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
            <Label htmlFor="is-active" className="text-right">
              Active
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="is-active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is-active" className="text-sm text-muted-foreground">
                Model will be available for use
              </Label>
            </div>
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
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Add Model
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddModelForm;
