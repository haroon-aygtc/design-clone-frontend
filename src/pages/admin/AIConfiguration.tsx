import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import {
  Bot,
  Settings,
  Save,
  RefreshCw,
  Sliders,
  MessageSquare,
  Globe,
  Shield,
  AlertTriangle,
  Info
} from "lucide-react";

const AIConfiguration = () => {
  return (
    <AdminLayout title="AI Configuration">
      <AIModelsProvider>
        <AIConfigurationContent />
      </AIModelsProvider>
    </AdminLayout>
  );
};

const AIConfigurationContent = () => {
  const { toast } = useToast();
  const { connectedModels, loading } = useAIModels();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  // General settings
  const [defaultModel, setDefaultModel] = useState("none");
  const [maxTokensPerRequest, setMaxTokensPerRequest] = useState(4000);
  const [maxRequestsPerMinute, setMaxRequestsPerMinute] = useState(60);
  const [enableLogging, setEnableLogging] = useState(true);

  // Content settings
  const [defaultSystemPrompt, setDefaultSystemPrompt] = useState(
    "You are a helpful assistant. Respond concisely and accurately to user queries."
  );
  const [contentFiltering, setContentFiltering] = useState("medium");
  const [allowedTopics, setAllowedTopics] = useState("general,business,education,technology");
  const [blockedTopics, setBlockedTopics] = useState("adult,violence,illegal");

  // Advanced settings
  const [apiTimeout, setApiTimeout] = useState(30);
  const [retryAttempts, setRetryAttempts] = useState(3);
  const [cacheResponses, setCacheResponses] = useState(true);
  const [cacheDuration, setCacheDuration] = useState(60);

  const handleSave = () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "AI configuration has been updated successfully.",
      });
    }, 1000);
  };

  const handleReset = () => {
    // Reset to default values
    setDefaultModel("none");
    setMaxTokensPerRequest(4000);
    setMaxRequestsPerMinute(60);
    setEnableLogging(true);
    setDefaultSystemPrompt("You are a helpful assistant. Respond concisely and accurately to user queries.");
    setContentFiltering("medium");
    setAllowedTopics("general,business,education,technology");
    setBlockedTopics("adult,violence,illegal");
    setApiTimeout(30);
    setRetryAttempts(3);
    setCacheResponses(true);
    setCacheDuration(60);

    toast({
      title: "Settings Reset",
      description: "AI configuration has been reset to default values.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Configuration</h1>
          <p className="text-muted-foreground">
            Configure global settings for all AI models and interactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset} disabled={isSaving}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-blue-50 text-blue-800 p-3 rounded-md border border-blue-200">
        <Info className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          These settings apply globally to all AI models and interactions. Individual models can override these settings.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Content & Safety
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center">
            <Sliders className="mr-2 h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Bot className="mr-2 h-4 w-4" />
                General AI Settings
              </CardTitle>
              <CardDescription>
                Configure basic AI behavior and limitations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-model">Default AI Model</Label>
                <Select value={defaultModel} onValueChange={setDefaultModel}>
                  <SelectTrigger id="default-model">
                    <SelectValue placeholder="Select default model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No default (select per widget)</SelectItem>
                    {connectedModels.map(model => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.name} ({model.provider})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This model will be used when no specific model is selected
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-tokens">Max Tokens Per Request</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {maxTokensPerRequest}
                  </span>
                </div>
                <Slider
                  id="max-tokens"
                  value={[maxTokensPerRequest]}
                  min={1000}
                  max={8000}
                  step={100}
                  onValueChange={(values) => setMaxTokensPerRequest(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of tokens allowed per API request
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rate-limit">Rate Limit (requests per minute)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {maxRequestsPerMinute}
                  </span>
                </div>
                <Slider
                  id="rate-limit"
                  value={[maxRequestsPerMinute]}
                  min={10}
                  max={120}
                  step={5}
                  onValueChange={(values) => setMaxRequestsPerMinute(values[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum number of API requests allowed per minute
                </p>
              </div>

              <div className="flex items-center space-x-2 justify-between">
                <Label htmlFor="enable-logging">Enable Request Logging</Label>
                <Switch
                  id="enable-logging"
                  checked={enableLogging}
                  onCheckedChange={setEnableLogging}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Shield className="mr-2 h-4 w-4" />
                Content & Safety Settings
              </CardTitle>
              <CardDescription>
                Configure content filtering and safety measures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-system-prompt">Default System Prompt</Label>
                <Textarea
                  id="default-system-prompt"
                  value={defaultSystemPrompt}
                  onChange={(e) => setDefaultSystemPrompt(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This prompt will be used as the default system instruction for all models
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-filtering">Content Filtering Level</Label>
                <Select value={contentFiltering} onValueChange={setContentFiltering}>
                  <SelectTrigger id="content-filtering">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minimal filtering</SelectItem>
                    <SelectItem value="medium">Medium - Standard filtering</SelectItem>
                    <SelectItem value="high">High - Strict filtering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowed-topics">Allowed Topics (comma separated)</Label>
                <Input
                  id="allowed-topics"
                  value={allowedTopics}
                  onChange={(e) => setAllowedTopics(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blocked-topics">Blocked Topics (comma separated)</Label>
                <Input
                  id="blocked-topics"
                  value={blockedTopics}
                  onChange={(e) => setBlockedTopics(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                API & Performance Settings
              </CardTitle>
              <CardDescription>
                Configure advanced API behavior and performance settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="api-timeout">API Timeout (seconds)</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {apiTimeout}s
                  </span>
                </div>
                <Slider
                  id="api-timeout"
                  value={[apiTimeout]}
                  min={5}
                  max={60}
                  step={1}
                  onValueChange={(values) => setApiTimeout(values[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                    {retryAttempts}
                  </span>
                </div>
                <Slider
                  id="retry-attempts"
                  value={[retryAttempts]}
                  min={0}
                  max={5}
                  step={1}
                  onValueChange={(values) => setRetryAttempts(values[0])}
                />
              </div>

              <div className="flex items-center space-x-2 justify-between">
                <Label htmlFor="cache-responses">Cache API Responses</Label>
                <Switch
                  id="cache-responses"
                  checked={cacheResponses}
                  onCheckedChange={setCacheResponses}
                />
              </div>

              {cacheResponses && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
                    <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                      {cacheDuration}m
                    </span>
                  </div>
                  <Slider
                    id="cache-duration"
                    value={[cacheDuration]}
                    min={5}
                    max={1440}
                    step={5}
                    onValueChange={(values) => setCacheDuration(values[0])}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center text-amber-800">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Advanced Settings Warning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-800">
                These settings can significantly impact system performance and API costs.
                Changes should be made carefully and tested thoroughly.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIConfiguration;
