
import { useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Trash2, Code, Activity, TestTube, Eye, EyeOff, MessageSquare } from "lucide-react";
import { AIModel } from "@/types/aiModels";
import ModelConfigForm from "./ModelConfigForm";
import ModelCodeSnippet from "./ModelCodeSnippet";
import ModelLogs from "./ModelLogs";

interface ConnectedModelCardProps {
  model: AIModel;
  onToggleActive: (modelId: string) => void;
  onDeleteClick: (model: AIModel) => void;
  onTestChat: (model: AIModel) => void;
  onTestConnection: (model: AIModel) => void;
}

const ConnectedModelCard = ({ 
  model, 
  onToggleActive,
  onDeleteClick,
  onTestChat,
  onTestConnection
}: ConnectedModelCardProps) => {
  const [showApiKey, setShowApiKey] = useState<boolean>(false);

  const toggleApiKeyVisibility = () => {
    setShowApiKey(prev => !prev);
  };

  return (
    <Card key={model.id} className="overflow-hidden border-gray-200 mb-6">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{model.name}</CardTitle>
              <Badge variant="outline" className={`${model.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100'}`}>
                {model.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <CardDescription>{model.provider} • {model.type}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Switch 
                id={`model-${model.id}-active`} 
                checked={model.isActive} 
                onCheckedChange={() => onToggleActive(model.id)}
              />
              <Label htmlFor={`model-${model.id}-active`}>Active</Label>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-red-500"
              onClick={() => onDeleteClick(model)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="border-t pt-4">
        <ModelCardContent 
          model={model} 
          showApiKey={showApiKey}
          toggleApiKeyVisibility={toggleApiKeyVisibility}
        />
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline">Export Logs</Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={() => onTestChat(model)}
          >
            <MessageSquare className="h-4 w-4" />
            Test Chat
          </Button>
          <Button 
            variant="outline" 
            className="flex gap-2 items-center" 
            onClick={() => onTestConnection(model)}
          >
            <TestTube className="h-4 w-4" />
            Test Connection
          </Button>
          <Button className="flex gap-2 items-center">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

interface ModelCardContentProps {
  model: AIModel;
  showApiKey: boolean;
  toggleApiKeyVisibility: () => void;
}

const ModelCardContent = ({ model, showApiKey, toggleApiKeyVisibility }: ModelCardContentProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">API Key</p>
          <div className="flex items-center">
            <Input 
              value={showApiKey ? model.apiKey : model.apiKey?.replace(/./g, '•')} 
              type={showApiKey ? "text" : "password"} 
              readOnly 
              className="text-sm font-mono" 
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2"
              onClick={toggleApiKeyVisibility}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Usage Count</p>
          <p className="text-2xl font-bold">{model.usageCount?.toLocaleString() || 0}</p>
          <p className="text-xs text-gray-500">Total API calls</p>
        </div>
        <div>
          <p className="text-sm font-medium">Last Used</p>
          <p className="text-2xl font-bold">{model.lastUsed || 'Never'}</p>
          <p className="text-xs text-gray-500">Recent activity</p>
        </div>
      </div>
      
      <Tabs defaultValue="config" className="mt-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configuration
          </TabsTrigger>
          <TabsTrigger value="code">
            <Code className="h-4 w-4 mr-2" />
            Code Example
          </TabsTrigger>
          <TabsTrigger value="logs">
            <Activity className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="mt-4">
          <ModelConfigForm model={model} />
        </TabsContent>
        
        <TabsContent value="code">
          <ModelCodeSnippet model={model} />
        </TabsContent>
        
        <TabsContent value="logs">
          <ModelLogs model={model} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ConnectedModelCard;
