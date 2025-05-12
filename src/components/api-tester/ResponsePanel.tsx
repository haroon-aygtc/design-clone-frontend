import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { APIResponse } from "@/types/apiTester";
import { Copy, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ResponsePanelProps {
  response: APIResponse;
}

const ResponsePanel = ({ response }: ResponsePanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("body");
  const { toast } = useToast();

  const isSuccess = response.status >= 200 && response.status < 300;
  const isRedirect = response.status >= 300 && response.status < 400;
  const isClientError = response.status >= 400 && response.status < 500;
  const isServerError = response.status >= 500;

  const getStatusColor = () => {
    if (isSuccess) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (isRedirect) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (isClientError) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    if (isServerError) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const formatJson = (data: any): string => {
    try {
      if (typeof data === 'string') {
        // Try to parse if it's a JSON string
        const parsed = JSON.parse(data);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch (e) {
      // If it's not valid JSON, return as is
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  };

  const handleCopyResponse = () => {
    const responseText = formatJson(response.data);
    navigator.clipboard.writeText(responseText);
    toast({
      title: "Copied to clipboard",
      description: "Response body copied to clipboard",
    });
  };

  const handleDownloadResponse = () => {
    const responseText = formatJson(response.data);
    const blob = new Blob([responseText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={cn("px-2 py-1", getStatusColor())}>
                {response.status} {response.statusText}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {response.time ? `${response.time}ms` : ''}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyResponse}>
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadResponse}>
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-4">
          <TabsList className="mt-2">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-4">
            <TabsContent value="body" className="mt-0">
              <pre className="bg-muted p-4 rounded-md overflow-x-auto font-mono text-sm whitespace-pre-wrap">
                {formatJson(response.data)}
              </pre>
            </TabsContent>
            
            <TabsContent value="headers" className="mt-0">
              <div className="space-y-2">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex border-b border-border pb-2 last:border-0">
                    <div className="w-1/3 font-medium text-sm">{key}</div>
                    <div className="w-2/3 text-sm break-all">{value}</div>
                  </div>
                ))}
                
                {Object.keys(response.headers).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    No headers available
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default ResponsePanel;
