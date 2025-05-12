import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import { AIModelProvider, AIModelType } from "@/types/aiModels";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Save,
  ArrowLeft,
  Loader2,
  Settings,
  MessageSquare,
  Code,
  Sliders,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

const AddAIModelContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addModel, loading } = useAIModels();

  // Form state
  const [name, setName] = useState("");
  const [provider, setProvider] = useState<string>("");
  const [customProvider, setCustomProvider] = useState("");
  const [type, setType] = useState<string>("");
  const [customType, setCustomType] = useState("");
  const [description, setDescription] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [systemPrompt, setSystemPrompt] = useState("You are a helpful assistant.");
  const [activeTab, setActiveTab] = useState("basic");

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
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const actualProvider = provider === "Other" ? customProvider : provider;
    const actualType = type === "Other" ? customType : type;

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
          temperature: parseFloat(temperature.toString()),
          maxTokens: parseInt(maxTokens.toString()),
          systemPrompt,
          apiEndpoint: apiEndpoint || undefined
        }
      };

      await addModel(modelData);

      toast({
        title: "Model Added",
        description: `${name} has been successfully added.`,
      });

      navigate("/admin/ai-models");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/ai-models")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Add New AI Model</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/ai-models")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Model
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Model Preview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="basic">
                <Bot className="mr-2 h-4 w-4" /> Basic Information
              </TabsTrigger>
              <TabsTrigger value="configuration">
                <Settings className="mr-2 h-4 w-4" /> Configuration
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Code className="mr-2 h-4 w-4" /> Advanced Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about the AI model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Model Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., GPT-4, Claude 3"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">
                        Provider <span className="text-destructive">*</span>
                      </Label>
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
                      {errors.provider && <p className="text-xs text-destructive">{errors.provider}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">
                          Model Type <span className="text-destructive">*</span>
                        </Label>
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
                        {errors.type && <p className="text-xs text-destructive">{errors.type}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the model and its capabilities"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">
                        API Key <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className={errors.apiKey ? "border-destructive" : ""}
                      />
                      {errors.apiKey && <p className="text-xs text-destructive">{errors.apiKey}</p>}
                      <p className="text-xs text-muted-foreground">Your API key will be stored securely.</p>
                    </div>
                  </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => navigate("/admin/ai-models")}>
                    Cancel
                  </Button>
                  <Button onClick={() => setActiveTab("configuration")}>
                    Continue to Configuration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Model Configuration</CardTitle>
                  <CardDescription>
                    Configure how the model behaves when generating responses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-endpoint">API Endpoint</Label>
                      <Input
                        id="api-endpoint"
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        placeholder="https://api.example.com/v1 (Optional)"
                      />
                      <p className="text-xs text-muted-foreground">Leave empty to use the provider's default endpoint</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="temperature">Temperature: {temperature}</Label>
                        <span className="text-sm text-muted-foreground">{temperature}</span>
                      </div>
                      <Slider
                        id="temperature"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[temperature]}
                        onValueChange={(value) => setTemperature(value[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls randomness: 0 is deterministic, 1 is creative (0.7 recommended)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        min="1"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of tokens to generate in the response
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        rows={4}
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Instructions for the AI model"
                      />
                      <p className="text-xs text-muted-foreground">
                        Instructions that define how the AI should behave
                      </p>
                    </div>
                  </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("basic")}>
                    Back to Basic Info
                  </Button>
                  <Button onClick={() => setActiveTab("advanced")}>
                    Continue to Advanced Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    Configure additional settings for the model
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="is-active">Active Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable this model
                        </p>
                      </div>
                      <Switch
                        id="is-active"
                        checked={isActive}
                        onCheckedChange={setIsActive}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Model Availability</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center p-2 border rounded-md">
                          <input
                            type="checkbox"
                            id="available-chat"
                            className="mr-2"
                            checked
                            readOnly
                          />
                          <Label htmlFor="available-chat" className="cursor-pointer">
                            Chat Widget
                          </Label>
                        </div>
                        <div className="flex items-center p-2 border rounded-md">
                          <input
                            type="checkbox"
                            id="available-api"
                            className="mr-2"
                            checked
                            readOnly
                          />
                          <Label htmlFor="available-api" className="cursor-pointer">
                            API Access
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setActiveTab("configuration")}>
                    Back to Configuration
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save Model
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

          {/* Preview Card */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Model Preview</CardTitle>
                <CardDescription>
                  Preview of how your model will appear
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{name || "Model Name"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {provider === "Other" ? customProvider : provider || "Provider"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Badge variant={isActive ? "default" : "outline"}>
                    {isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    {type === "Other" ? customType : type || "Model Type"}
                  </Badge>
                </div>

                <div className="text-sm">
                  {description || "No description provided"}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Configuration</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className="font-medium">{temperature}</span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/50 p-2 rounded">
                      <span className="text-muted-foreground">Max Tokens</span>
                      <span className="font-medium">{maxTokens}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">System Prompt</h4>
                  <div className="bg-muted/50 p-2 rounded text-sm max-h-24 overflow-auto">
                    {systemPrompt || "Default system prompt"}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Check className="h-4 w-4 mr-1 text-green-500" />
                  Ready to save
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
  );
};

const AddAIModel = () => {
  return (
    <AdminLayout title="Add AI Model">
      <AIModelsProvider>
        <AddAIModelContent />
      </AIModelsProvider>
    </AdminLayout>
  );
};

export default AddAIModel;
