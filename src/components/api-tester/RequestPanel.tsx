import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { APIRequest, HTTPMethod } from "@/types/apiTester";
import { Send, Save, Plus, Trash, Zap, Loader2, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";

interface RequestPanelProps {
  request: APIRequest;
  onUpdate: (request: Partial<APIRequest>) => void;
  onSend: () => void;
  onSave: () => void;
  isLoading: boolean;
  availableApis: string[];
  onGenerateSample: () => void;
}

const RequestPanel = ({
  request,
  onUpdate,
  onSend,
  onSave,
  isLoading,
  availableApis,
  onGenerateSample
}: RequestPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("params");
  const [newHeaderKey, setNewHeaderKey] = useState<string>("");
  const [newHeaderValue, setNewHeaderValue] = useState<string>("");
  const [newParamKey, setNewParamKey] = useState<string>("");
  const [newParamValue, setNewParamValue] = useState<string>("");

  const handleMethodChange = (method: string) => {
    onUpdate({ method: method as HTTPMethod });
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ url });
  };

  const handleNameChange = (name: string) => {
    onUpdate({ name });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ description });
  };

  const handleBodyChange = (body: string) => {
    onUpdate({ body });
  };

  const handleAddHeader = () => {
    if (!newHeaderKey.trim()) return;
    
    const updatedHeaders = {
      ...request.headers,
      [newHeaderKey]: newHeaderValue
    };
    
    onUpdate({ headers: updatedHeaders });
    setNewHeaderKey("");
    setNewHeaderValue("");
  };

  const handleRemoveHeader = (key: string) => {
    const updatedHeaders = { ...request.headers };
    delete updatedHeaders[key];
    onUpdate({ headers: updatedHeaders });
  };

  const handleAddParam = () => {
    if (!newParamKey.trim()) return;
    
    const updatedParams = {
      ...request.params,
      [newParamKey]: newParamValue
    };
    
    onUpdate({ params: updatedParams });
    setNewParamKey("");
    setNewParamValue("");
  };

  const handleRemoveParam = (key: string) => {
    const updatedParams = { ...request.params };
    delete updatedParams[key];
    onUpdate({ params: updatedParams });
  };

  const handleSelectApi = (url: string) => {
    onUpdate({ url });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Request Name"
              value={request.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="font-medium"
            />
            
            <Button onClick={onSave} variant="outline" size="icon" title="Save Request">
              <Save className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={request.method} onValueChange={handleMethodChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative flex-1">
              <Input
                placeholder="Enter request URL"
                value={request.url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pr-24"
              />
              
              {availableApis.length > 0 && (
                <Select onValueChange={handleSelectApi}>
                  <SelectTrigger className="absolute right-0 top-0 w-[120px] border-0">
                    <SelectValue placeholder="APIs" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableApis.map((api) => (
                      <SelectItem key={api} value={api}>
                        {api.split('/').pop()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <Button onClick={onSend} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="params" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Query Parameters</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onGenerateSample}
                    className="text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" /> Generate Sample
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {Object.entries(request.params).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const updatedParams = { ...request.params };
                          delete updatedParams[key];
                          updatedParams[e.target.value] = value;
                          onUpdate({ params: updatedParams });
                        }}
                        className="flex-1"
                        placeholder="Parameter name"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          const updatedParams = { ...request.params };
                          updatedParams[key] = e.target.value;
                          onUpdate({ params: updatedParams });
                        }}
                        className="flex-1"
                        placeholder="Value"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveParam(key)}
                        className="text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={newParamKey}
                      onChange={(e) => setNewParamKey(e.target.value)}
                      className="flex-1"
                      placeholder="Parameter name"
                    />
                    <Input
                      value={newParamValue}
                      onChange={(e) => setNewParamValue(e.target.value)}
                      className="flex-1"
                      placeholder="Value"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddParam}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="headers" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Headers</h3>
                
                <div className="space-y-2">
                  {Object.entries(request.headers).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Input
                        value={key}
                        onChange={(e) => {
                          const updatedHeaders = { ...request.headers };
                          delete updatedHeaders[key];
                          updatedHeaders[e.target.value] = value;
                          onUpdate({ headers: updatedHeaders });
                        }}
                        className="flex-1"
                        placeholder="Header name"
                      />
                      <Input
                        value={value}
                        onChange={(e) => {
                          const updatedHeaders = { ...request.headers };
                          updatedHeaders[key] = e.target.value;
                          onUpdate({ headers: updatedHeaders });
                        }}
                        className="flex-1"
                        placeholder="Value"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHeader(key)}
                        className="text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={newHeaderKey}
                      onChange={(e) => setNewHeaderKey(e.target.value)}
                      className="flex-1"
                      placeholder="Header name"
                    />
                    <Input
                      value={newHeaderValue}
                      onChange={(e) => setNewHeaderValue(e.target.value)}
                      className="flex-1"
                      placeholder="Value"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleAddHeader}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => {
                      onUpdate({
                        headers: {
                          ...request.headers,
                          "Content-Type": "application/json",
                          "Accept": "application/json"
                        }
                      });
                    }}
                  >
                    <FileJson className="h-3 w-3 mr-1" /> Add JSON Headers
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="body" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Request Body</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onGenerateSample}
                    className="text-xs"
                  >
                    <Zap className="h-3 w-3 mr-1" /> Generate Sample
                  </Button>
                </div>
                
                <Textarea
                  value={request.body}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  placeholder="Enter request body (JSON, XML, etc.)"
                  className="font-mono text-sm min-h-[300px]"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="description" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Description</h3>
                
                <Textarea
                  value={request.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="Enter request description"
                  className="min-h-[200px]"
                />
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default RequestPanel;
