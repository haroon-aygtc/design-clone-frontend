
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiModels, Plus, Settings, Trash2 } from "lucide-react";

const AIModelsPage = () => {
  const [activeTab, setActiveTab] = useState("available");

  // Mock data for available models
  const availableModels = [
    { id: 1, name: "GPT-4", provider: "OpenAI", type: "Large Language Model", status: "Available" },
    { id: 2, name: "Claude 3", provider: "Anthropic", type: "Large Language Model", status: "Available" },
    { id: 3, name: "Gemini Pro", provider: "Google", type: "Multimodal", status: "Available" },
    { id: 4, name: "DALL-E 3", provider: "OpenAI", type: "Image Generation", status: "Available" },
    { id: 5, name: "Whisper", provider: "OpenAI", type: "Speech Recognition", status: "Available" },
  ];

  // Mock data for connected models
  const connectedModels = [
    { 
      id: 1, 
      name: "GPT-4", 
      provider: "OpenAI", 
      apiKey: "sk-••••••••••••••••••••••", 
      isActive: true,
      usageCount: 1243,
      lastUsed: "2 hours ago" 
    },
    { 
      id: 3, 
      name: "Gemini Pro", 
      provider: "Google", 
      apiKey: "AIza••••••••••••••••••••", 
      isActive: true,
      usageCount: 867,
      lastUsed: "5 mins ago" 
    },
  ];

  return (
    <AdminLayout title="AI Models">
      <Tabs defaultValue="available" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="available">Available Models</TabsTrigger>
            <TabsTrigger value="connected">Connected Models</TabsTrigger>
          </TabsList>
          
          {activeTab === "available" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Request New Model
            </Button>
          )}
          
          {activeTab === "connected" && (
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Connect New Model
            </Button>
          )}
        </div>
        
        <TabsContent value="available" className="space-y-4">
          <div className="flex justify-between mb-4">
            <Input className="max-w-sm" placeholder="Search models..." />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="llm">Language Models</SelectItem>
                <SelectItem value="image">Image Generation</SelectItem>
                <SelectItem value="audio">Audio Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableModels.map((model) => (
              <Card key={model.id} className="overflow-hidden border-gray-200">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.provider}</CardDescription>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-admin-navy/10 flex items-center justify-center">
                      <AiModels className="h-5 w-5 text-admin-navy" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span>{model.type}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Status:</span>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        {model.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button variant="outline" className="mr-2">Learn More</Button>
                  <Button>Connect</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="connected" className="space-y-4">
          {connectedModels.map((model) => (
            <Card key={model.id} className="overflow-hidden border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        Connected
                      </span>
                    </div>
                    <CardDescription>{model.provider}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Switch id={`model-${model.id}-active`} checked={model.isActive} />
                      <Label htmlFor={`model-${model.id}-active`}>Active</Label>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">API Key</p>
                    <div className="flex items-center">
                      <Input value={model.apiKey} type="password" readOnly className="text-sm" />
                      <Button variant="ghost" size="sm" className="ml-2">
                        Show
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Usage Count</p>
                    <p className="text-2xl font-bold">{model.usageCount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total API calls</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Used</p>
                    <p className="text-2xl font-bold">{model.lastUsed}</p>
                    <p className="text-xs text-gray-500">Recent activity</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline">View Logs</Button>
                <Button variant="outline">Test Connection</Button>
                <Button>Configure Settings</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AIModelsPage;
