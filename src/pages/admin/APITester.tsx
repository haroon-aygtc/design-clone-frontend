import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Send,
  Save,
  Plus,
  Trash,
  Copy,
  Clock,
  Download,
  Upload,
  Code,
  FileJson,
  Check,
  X,
  Play,
  Loader2,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Settings,
  Clipboard,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreHorizontal,
  ArrowDownUp,
  Zap
} from "lucide-react";
import { APIRequest, APIResponse, HTTPMethod, APICollection, RequestHistory } from "@/types/apiTester";
import { apiTesterService } from "@/services/apiTesterService";
import RequestPanel from "@/components/api-tester/RequestPanel";
import ResponsePanel from "@/components/api-tester/ResponsePanel";
import HistoryPanel from "@/components/api-tester/HistoryPanel";

const APITester = () => {
  const [collections, setCollections] = useState<APICollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [requests, setRequests] = useState<APIRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<APIRequest | null>(null);
  const [requestHistory, setRequestHistory] = useState<RequestHistory[]>([]);
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("request");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [availableApis, setAvailableApis] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch available APIs and collections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const apis = await apiTesterService.getAvailableAPIs();
        setAvailableApis(apis);

        const collections = await apiTesterService.getCollections();
        setCollections(collections);

        if (collections.length > 0) {
          setSelectedCollection(collections[0].id);
          setRequests(collections[0].requests);
          if (collections[0].requests.length > 0) {
            setSelectedRequest(collections[0].requests[0]);
          }
        }

        const history = await apiTesterService.getRequestHistory();
        setRequestHistory(history);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load API data",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Handle collection change
  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      setRequests(collection.requests);
      if (collection.requests.length > 0) {
        setSelectedRequest(collection.requests[0]);
      } else {
        setSelectedRequest(null);
      }
    }
  };

  // Handle request selection
  const handleRequestSelect = (request: APIRequest) => {
    setSelectedRequest(request);
    setActiveTab("request");
  };

  // Handle request execution
  const handleSendRequest = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const response = await apiTesterService.sendRequest(selectedRequest);
      setResponse(response);

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        request: { ...selectedRequest },
        response: response,
      };

      const updatedHistory = [historyItem, ...requestHistory].slice(0, 50); // Keep last 50 requests
      setRequestHistory(updatedHistory);
      apiTesterService.saveRequestHistory(updatedHistory);

      toast({
        title: "Request Completed",
        description: `Status: ${response.status} ${response.statusText}`,
        variant: response.status >= 200 && response.status < 300 ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error sending request:", error);
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        data: { error: "Failed to send request" },
        time: 0,
      });

      toast({
        title: "Request Failed",
        description: "Failed to send API request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request update
  const handleRequestUpdate = (updatedRequest: Partial<APIRequest>) => {
    if (!selectedRequest) return;

    const updated = { ...selectedRequest, ...updatedRequest };
    setSelectedRequest(updated);

    // Update in collection
    if (selectedCollection) {
      const updatedRequests = requests.map(req =>
        req.id === updated.id ? updated : req
      );
      setRequests(updatedRequests);

      // Update collection
      const updatedCollections = collections.map(collection =>
        collection.id === selectedCollection
          ? { ...collection, requests: updatedRequests }
          : collection
      );
      setCollections(updatedCollections);
      apiTesterService.saveCollections(updatedCollections);
    }
  };

  // Handle saving a new request
  const handleSaveRequest = () => {
    if (!selectedRequest || !selectedCollection) return;

    // Check if it's a new request or updating existing
    const isNewRequest = !requests.some(req => req.id === selectedRequest.id);

    if (isNewRequest) {
      // Add to requests
      const updatedRequests = [...requests, selectedRequest];
      setRequests(updatedRequests);

      // Update collection
      const updatedCollections = collections.map(collection =>
        collection.id === selectedCollection
          ? { ...collection, requests: updatedRequests }
          : collection
      );
      setCollections(updatedCollections);
      apiTesterService.saveCollections(updatedCollections);

      toast({
        title: "Request Saved",
        description: `"${selectedRequest.name}" added to collection`,
      });
    } else {
      // Update existing request
      const updatedRequests = requests.map(req =>
        req.id === selectedRequest.id ? selectedRequest : req
      );
      setRequests(updatedRequests);

      // Update collection
      const updatedCollections = collections.map(collection =>
        collection.id === selectedCollection
          ? { ...collection, requests: updatedRequests }
          : collection
      );
      setCollections(updatedCollections);
      apiTesterService.saveCollections(updatedCollections);

      toast({
        title: "Request Updated",
        description: `"${selectedRequest.name}" has been updated`,
      });
    }
  };

  // Create a new request
  const handleNewRequest = () => {
    const newRequest: APIRequest = {
      id: Date.now().toString(),
      name: "New Request",
      url: "",
      method: "GET",
      headers: {},
      params: {},
      body: "",
      description: "",
    };

    setSelectedRequest(newRequest);
    setActiveTab("request");
  };

  // Create a new collection
  const handleNewCollection = () => {
    const newCollection: APICollection = {
      id: Date.now().toString(),
      name: "New Collection",
      description: "",
      requests: [],
    };

    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    setSelectedCollection(newCollection.id);
    setRequests([]);
    setSelectedRequest(null);
    apiTesterService.saveCollections(updatedCollections);

    toast({
      title: "Collection Created",
      description: "New collection has been created",
    });
  };

  // Generate sample request data
  const handleGenerateSampleData = () => {
    if (!selectedRequest) return;

    // Generate sample data based on the API endpoint
    const sampleData = apiTesterService.generateSampleData(selectedRequest.url);
    handleRequestUpdate({ body: JSON.stringify(sampleData, null, 2) });

    toast({
      title: "Sample Data Generated",
      description: "Sample request data has been generated",
    });
  };

  return (
    <AdminLayout title="API Tester">
      <div className="flex h-[calc(100vh-120px)] gap-4 overflow-hidden">
        {/* Left sidebar - Collections and Requests */}
        <div className="w-64 flex flex-col border rounded-lg overflow-hidden bg-card">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Collections</h3>
            <Button variant="ghost" size="icon" onClick={handleNewCollection} title="New Collection">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2">
              {collections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No collections found</p>
                  <Button variant="link" onClick={handleNewCollection}>
                    Create your first collection
                  </Button>
                </div>
              ) : (
                <Accordion type="multiple" defaultValue={[selectedCollection || '']}>
                  {collections
                    .filter(collection =>
                      collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      collection.requests.some(req => req.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map(collection => (
                      <AccordionItem key={collection.id} value={collection.id}>
                        <AccordionTrigger
                          className={cn(
                            "px-2 hover:bg-accent hover:text-accent-foreground rounded-md",
                            selectedCollection === collection.id && "font-medium"
                          )}
                          onClick={() => handleCollectionChange(collection.id)}
                        >
                          {collection.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pl-2 space-y-1">
                            {collection.requests
                              .filter(req => req.name.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map(request => (
                                <div
                                  key={request.id}
                                  className={cn(
                                    "flex items-center gap-2 px-2 py-1 text-sm rounded-md cursor-pointer",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    selectedRequest?.id === request.id && "bg-accent text-accent-foreground"
                                  )}
                                  onClick={() => handleRequestSelect(request)}
                                >
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs px-1 py-0",
                                      request.method === "GET" && "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                                      request.method === "POST" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
                                      request.method === "PUT" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
                                      request.method === "DELETE" && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                    )}
                                  >
                                    {request.method}
                                  </Badge>
                                  <span className="truncate">{request.name}</span>
                                </div>
                              ))}

                            {collection.id === selectedCollection && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start pl-2 text-muted-foreground"
                                onClick={handleNewRequest}
                              >
                                <Plus className="h-3 w-3 mr-1" /> New Request
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setActiveTab("history")}
            >
              <Clock className="h-4 w-4 mr-2" /> History
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="mt-2">
                <TabsTrigger value="request">Request</TabsTrigger>
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="request" className="h-full flex flex-col">
                {selectedRequest ? (
                  <RequestPanel
                    request={selectedRequest}
                    onUpdate={handleRequestUpdate}
                    onSend={handleSendRequest}
                    onSave={handleSaveRequest}
                    isLoading={isLoading}
                    availableApis={availableApis}
                    onGenerateSample={handleGenerateSampleData}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">No Request Selected</h3>
                      <p className="text-muted-foreground mb-4">Select a request from the sidebar or create a new one</p>
                      <Button onClick={handleNewRequest}>
                        <Plus className="h-4 w-4 mr-2" /> New Request
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="response" className="h-full">
                {response ? (
                  <ResponsePanel response={response} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">No Response Yet</h3>
                      <p className="text-muted-foreground mb-4">Send a request to see the response here</p>
                      {selectedRequest && (
                        <Button onClick={handleSendRequest} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" /> Send Request
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="h-full">
                <HistoryPanel
                  history={requestHistory}
                  onSelectRequest={(item) => {
                    setSelectedRequest(item.request);
                    setResponse(item.response);
                    setActiveTab("request");
                  }}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AdminLayout>
  );
};

export default APITester;
