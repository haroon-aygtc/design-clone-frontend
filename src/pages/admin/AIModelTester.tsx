import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import { AIModelsProvider, useAIModels } from "@/context/AIModelsContext";
import { useToast } from "@/components/ui/use-toast";
import { AIModel } from "@/types/aiModels";
import {
  ArrowLeft,
  Bot,
  Send,
  Settings,
  Code,
  Image,
  MessageSquare,
  Zap,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Trash2,
  Download,
  Upload,
  Play,
  Pause,
  Clock,
  RotateCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { apiClient } from "@/services/api";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface TestResult {
  success: boolean;
  message: string;
  latency?: number;
  tokenCount?: number;
  response?: string;
}

const AIModelTesterContent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { connectedModels, testConnection } = useAIModels();
  const [activeTab, setActiveTab] = useState("chat");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<AIModel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [showSettings, setShowSettings] = useState(false);
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [apiRequest, setApiRequest] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find the model by ID
  useEffect(() => {
    const foundModel = connectedModels.find(m => m.id === id);
    if (foundModel) {
      setModel(foundModel);
      // Initialize with model's configuration
      if (foundModel.configuration) {
        setSystemPrompt(foundModel.configuration.systemPrompt || "");
        setTemperature(foundModel.configuration.temperature || 0.7);
        setMaxTokens(foundModel.configuration.maxTokens || 2000);
      }
      // Add system message if system prompt exists
      if (foundModel.configuration?.systemPrompt) {
        setMessages([
          {
            id: "system-1",
            role: "system",
            content: foundModel.configuration.systemPrompt,
            timestamp: new Date()
          }
        ]);
      }
    } else {
      toast({
        title: "Model Not Found",
        description: "The requested AI model could not be found.",
        variant: "destructive"
      });
      navigate("/admin/ai-models");
    }
  }, [connectedModels, id, navigate, toast]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !model) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare the API request for display in the API tab
      const requestBody = {
        model: model.name,
        messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
        temperature,
        max_tokens: maxTokens,
        stream: streaming
      };
      
      setApiRequest(JSON.stringify(requestBody, null, 2));

      // Make the actual API call
      const response = await apiClient.post(`/ai-models/${model.id}/generate`, requestBody);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.data.response || "No response received",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update API response for display
      setApiResponse(JSON.stringify(response.data, null, 2));
      
      // Update test results
      setTestResults({
        success: true,
        message: "Message generated successfully",
        latency: response.data.latency || 0,
        tokenCount: response.data.tokenCount || 0,
        response: response.data.response
      });
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Update API response with error
      if (error.response?.data) {
        setApiResponse(JSON.stringify(error.response.data, null, 2));
      } else {
        setApiResponse(JSON.stringify({ error: "Failed to generate response" }, null, 2));
      }
      
      // Add error message
      const errorMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content: "Error: Failed to generate a response. Please check the API tab for details.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Update test results
      setTestResults({
        success: false,
        message: "Failed to generate response",
      });
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate a response. Please check your model configuration.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!model) return;
    
    toast({
      title: "Testing Connection",
      description: "Please wait while we test the connection...",
    });
    
    try {
      const success = await testConnection(model.id);
      
      if (success) {
        setTestResults({
          success: true,
          message: "Connection test successful",
        });
      } else {
        setTestResults({
          success: false,
          message: "Connection test failed",
        });
      }
    } catch (error) {
      console.error("Error testing connection:", error);
      setTestResults({
        success: false,
        message: "Connection test failed with an error",
      });
    }
  };

  const handleClearChat = () => {
    // Keep system message if it exists
    const systemMessages = messages.filter(m => m.role === "system");
    setMessages(systemMessages);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = () => {
    if (!model) return;
    
    // Update system message if it exists
    if (messages.some(m => m.role === "system")) {
      setMessages(prev => 
        prev.map(m => 
          m.role === "system" 
            ? { ...m, content: systemPrompt, timestamp: new Date() } 
            : m
        )
      );
    } else if (systemPrompt) {
      // Add system message if it doesn't exist
      setMessages(prev => [
        {
          id: "system-1",
          role: "system",
          content: systemPrompt,
          timestamp: new Date()
        },
        ...prev
      ]);
    }
    
    setShowSettings(false);
    
    toast({
      title: "Settings Updated",
      description: "Your test settings have been updated.",
    });
  };

  if (!model) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate("/admin/ai-models")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" /> 
              {model.name}
            </h1>
            <p className="text-muted-foreground">
              {model.provider} • {model.type}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={model.isActive ? "default" : "outline"}>
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleTestConnection}>
            <Zap className="mr-2 h-4 w-4" /> Test Connection
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Test Settings</CardTitle>
            <CardDescription>Configure how the model responds during testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-prompt">System Prompt</Label>
              <Textarea
                id="system-prompt"
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Instructions for the AI model"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Instructions that define how the AI should behave
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Controls randomness: 0 is deterministic, 1 is creative
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
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="streaming"
                checked={streaming}
                onCheckedChange={setStreaming}
              />
              <Label htmlFor="streaming">Enable streaming responses</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card className={cn(
          "border-l-4",
          testResults.success ? "border-l-green-500" : "border-l-red-500"
        )}>
          <CardHeader className="py-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base flex items-center gap-2">
                {testResults.success ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                {testResults.success ? "Success" : "Error"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setTestResults(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <p className="text-sm">{testResults.message}</p>
            
            {testResults.latency !== undefined && (
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Latency: {testResults.latency}ms</span>
                </div>
                
                {testResults.tokenCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Tokens: {testResults.tokenCount}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Main Testing Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="chat">
            <MessageSquare className="mr-2 h-4 w-4" /> Chat Interface
          </TabsTrigger>
          <TabsTrigger value="api">
            <Code className="mr-2 h-4 w-4" /> API Request/Response
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Sparkles className="mr-2 h-4 w-4" /> Advanced Testing
          </TabsTrigger>
        </TabsList>
        
        {/* Chat Interface Tab */}
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[60vh] flex flex-col">
            <CardContent className="flex-1 p-4 overflow-hidden">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">Start a conversation</h3>
                      <p className="text-muted-foreground max-w-md mt-2">
                        Send a message to start testing the {model.name} model. Your conversation will appear here.
                      </p>
                    </div>
                  ) : (
                    messages.filter(m => m.role !== "system").map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 p-4 rounded-lg",
                          message.role === "user" 
                            ? "bg-primary/10 ml-10" 
                            : "bg-muted/50 mr-10"
                        )}
                      >
                        <div className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                          message.role === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted-foreground/20"
                        )}>
                          {message.role === "user" ? "U" : <Bot className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">
                              {message.role === "user" ? "You" : model.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t p-4">
              <div className="flex items-center w-full gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleClearChat}
                  disabled={messages.filter(m => m.role !== "system").length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                  disabled={loading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!input.trim() || loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* API Request/Response Tab */}
        <TabsContent value="api" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-[60vh] flex flex-col">
              <CardHeader className="py-3 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">API Request</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyToClipboard(apiRequest)}
                    disabled={!apiRequest}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <pre className="p-4 text-sm font-mono">
                    {apiRequest || "No request made yet. Send a message in the Chat tab to generate a request."}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card className="h-[60vh] flex flex-col">
              <CardHeader className="py-3 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">API Response</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopyToClipboard(apiResponse)}
                    disabled={!apiResponse}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <pre className="p-4 text-sm font-mono">
                    {apiResponse || "No response received yet. Send a message in the Chat tab to generate a response."}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Advanced Testing Tab */}
        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Testing Tools</CardTitle>
              <CardDescription>
                Test your model with different scenarios and evaluate performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <RotateCw className="h-4 w-4" /> Batch Testing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Test your model with multiple inputs at once and analyze results
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Import/Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Import test cases or export your conversation history
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4" /> Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Evaluate model responses against benchmarks and criteria
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button className="w-full" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AIModelTester = () => {
  return (
    <AdminLayout title="AI Model Tester">
      <AIModelsProvider>
        <AIModelTesterContent />
      </AIModelsProvider>
    </AdminLayout>
  );
};

export default AIModelTester;
