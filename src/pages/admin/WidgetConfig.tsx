
import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Paintbrush, Gauge, MessageSquare, Code, Check, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const WidgetConfigPage = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#6366F1");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [chatIconSize, setChatIconSize] = useState([40]);
  const [initialMessage, setInitialMessage] = useState("Hi there! How can I help you today?");
  const [placeholderText, setPlaceholderText] = useState("Ask me anything...");
  const [responseDelay, setResponseDelay] = useState([1]);
  const [autoOpen, setAutoOpen] = useState(false);
  const [position, setPosition] = useState("bottom-right");
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [embedCode, setEmbedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  // Mock preview state - would be connected to an actual preview in a real app
  const [previewLoading, setPreviewLoading] = useState(false);

  const updatePreview = () => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 800);
  };

  const colorOptions = [
    { color: "#6366F1", class: "bg-indigo-500" },
    { color: "#22C55E", class: "bg-green-500" },
    { color: "#EF4444", class: "bg-red-500" },
    { color: "#F97316", class: "bg-orange-500" },
    { color: "#3B82F6", class: "bg-blue-500" },
    { color: "#000000", class: "bg-black" },
    { color: "#8B5CF6", class: "bg-purple-500" },
  ];

  // Generate embed code based on current settings
  useEffect(() => {
    const code = `<script>
  window.chatWidgetSettings = {
    primaryColor: "${primaryColor}",
    secondaryColor: "${secondaryColor}",
    fontFamily: "${fontFamily}",
    borderRadius: ${borderRadius[0]},
    chatIconSize: ${chatIconSize[0]},
    position: "${position}",
    autoOpen: ${autoOpen},
    initialMessage: "${initialMessage}"
  };
</script>
<script src="https://cdn.example.com/chat-widget.js" async></script>`;
    
    setEmbedCode(code);
  }, [primaryColor, secondaryColor, fontFamily, borderRadius, chatIconSize, position, autoOpen, initialMessage]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <AdminLayout title="Widget Config">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-xl font-semibold mb-4">Widget Configurator</h2>

            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="appearance" onClick={updatePreview}>
                  <Paintbrush className="mr-2 h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="behavior" onClick={updatePreview}>
                  <Gauge className="mr-2 h-4 w-4" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="content" onClick={updatePreview}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="embedding" onClick={updatePreview}>
                  <Code className="mr-2 h-4 w-4" />
                  Embedding
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Visual Style</h3>
                  <p className="text-sm text-gray-600 mb-4">Customize how your chat widget looks</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Primary Color</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colorOptions.map((option) => (
                        <button 
                          key={option.color} 
                          className={`h-8 w-8 rounded-full ${option.class} border border-gray-200 flex items-center justify-center ${primaryColor === option.color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                          onClick={() => setPrimaryColor(option.color)}
                        >
                          {primaryColor === option.color && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">This color will be used for the chat header and buttons</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Secondary Color</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {colorOptions.map((option) => (
                        <button 
                          key={option.color} 
                          className={`h-8 w-8 rounded-full ${option.class} border border-gray-200 flex items-center justify-center ${secondaryColor === option.color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                          onClick={() => setSecondaryColor(option.color)}
                        >
                          {secondaryColor === option.color && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">Used for backgrounds and secondary elements</p>
                  </div>

                  <div>
                    <Label htmlFor="fontFamily" className="mb-2 block">Font Family</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger id="fontFamily" className="w-full">
                        <SelectValue placeholder="Choose a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Choose a font for your chat widget</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Border Radius: {borderRadius}px</Label>
                    <Slider
                      defaultValue={[8]}
                      max={20}
                      step={1}
                      value={borderRadius}
                      onValueChange={setBorderRadius}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Adjust the roundness of corners</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Chat Icon Size: {chatIconSize}px</Label>
                    <Slider
                      defaultValue={[40]}
                      max={60}
                      min={20}
                      step={2}
                      value={chatIconSize}
                      onValueChange={setChatIconSize}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Size of the chat button when minimized</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="button" variant="outline" className="mr-2">Reset to Default</Button>
                  <Button>Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Behavior Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Configure how your chat widget behaves</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Response Delay: {responseDelay}s</Label>
                    <Slider
                      defaultValue={[1]}
                      max={5}
                      min={0.2}
                      step={0.2}
                      value={responseDelay}
                      onValueChange={setResponseDelay}
                      className="mb-2"
                    />
                    <p className="text-xs text-gray-500">Time before AI responds (adds natural feel)</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="auto-open">Auto Open Widget</Label>
                      <Switch id="auto-open" checked={autoOpen} onCheckedChange={setAutoOpen} />
                    </div>
                    <p className="text-xs text-gray-500">Automatically open the chat widget when page loads</p>
                  </div>

                  <div>
                    <Label htmlFor="position" className="mb-2 block">Widget Position</Label>
                    <Select value={position} onValueChange={setPosition}>
                      <SelectTrigger id="position" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">Position of the chat widget on the screen</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="allow-attachments">Allow File Attachments</Label>
                      <Switch id="allow-attachments" checked={allowAttachments} onCheckedChange={setAllowAttachments} />
                    </div>
                    <p className="text-xs text-gray-500">Allow users to upload files in chat</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="button" variant="outline" className="mr-2">Reset to Default</Button>
                  <Button>Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Content Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">Customize the text content in your chat widget</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="initial-message" className="mb-2 block">Initial Welcome Message</Label>
                    <Textarea 
                      id="initial-message" 
                      value={initialMessage}
                      onChange={(e) => setInitialMessage(e.target.value)}
                      className="w-full"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">First message users see when opening the chat</p>
                  </div>

                  <div>
                    <Label htmlFor="placeholder" className="mb-2 block">Input Placeholder</Label>
                    <Input 
                      id="placeholder" 
                      value={placeholderText}
                      onChange={(e) => setPlaceholderText(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">Placeholder text shown in the message input</p>
                  </div>

                  <div>
                    <Label className="mb-2 block">Suggested Questions</Label>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Input defaultValue="What services do you offer?" className="flex-1 mr-2" />
                            <Button variant="ghost" size="icon">×</Button>
                          </div>
                          <div className="flex items-center">
                            <Input defaultValue="How do I contact support?" className="flex-1 mr-2" />
                            <Button variant="ghost" size="icon">×</Button>
                          </div>
                          <div className="flex items-center">
                            <Input defaultValue="What are your business hours?" className="flex-1 mr-2" />
                            <Button variant="ghost" size="icon">×</Button>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full mt-2">+ Add Question</Button>
                      </CardContent>
                    </Card>
                    <p className="text-xs text-gray-500 mt-1">Quick questions shown to users for easy replies</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="button" variant="outline" className="mr-2">Reset to Default</Button>
                  <Button>Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="embedding" className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-2">Embedding Code</h3>
                  <p className="text-sm text-gray-600 mb-4">Get the code to embed your chat widget on any website</p>
                </div>

                <div className="space-y-4">
                  <Card className="relative">
                    <CardContent className="p-4">
                      <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{embedCode}</pre>
                      </div>
                      <Button 
                        className="absolute top-4 right-4" 
                        variant="outline" 
                        size="sm"
                        onClick={copyToClipboard}
                      >
                        {codeCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {codeCopied ? "Copied!" : "Copy"}
                      </Button>
                    </CardContent>
                  </Card>

                  <div>
                    <h4 className="text-base font-medium mb-2">Installation Instructions</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-sm font-medium mb-1">1. Copy the code above</h5>
                        <p className="text-xs text-gray-600">Click the copy button to copy the widget code to your clipboard.</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">2. Paste before closing &lt;/body&gt; tag</h5>
                        <p className="text-xs text-gray-600">Add the code just before the closing body tag in your HTML.</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-1">3. Save and publish your website</h5>
                        <p className="text-xs text-gray-600">The chat widget will automatically appear on your site.</p>
                      </div>
                    </div>
                  </div>

                  <Collapsible className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" className="w-full flex justify-between">
                        <span>Advanced Options</span>
                        <span>↓</span>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <Card>
                        <CardContent className="p-4 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <Label htmlFor="disable-mobile">Disable on Mobile</Label>
                              <Switch id="disable-mobile" />
                            </div>
                            <p className="text-xs text-gray-500">Hide the chat widget on mobile devices</p>
                          </div>
                          
                          <div>
                            <Label className="mb-2 block">Show on Pages</Label>
                            <Input placeholder="e.g. /pricing, /contact" />
                            <p className="text-xs text-gray-500 mt-1">Comma-separated list of pages to show the widget on (leave empty for all)</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] bg-gray-50 relative">
              {previewLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-800"></div>
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  {/* Widget Preview */}
                  <div className="flex-1 p-4 relative overflow-hidden">
                    <div 
                      className="absolute bottom-4 right-4 rounded-full shadow-lg cursor-pointer"
                      style={{
                        backgroundColor: primaryColor,
                        width: `${chatIconSize}px`,
                        height: `${chatIconSize}px`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MessageSquare className="text-white" size={chatIconSize[0] * 0.5} />
                      </div>
                    </div>

                    {/* Expanded Chat Widget */}
                    <div 
                      className="w-72 absolute bottom-20 right-4 rounded-lg shadow-lg overflow-hidden flex flex-col bg-white"
                      style={{
                        borderRadius: `${borderRadius[0]}px`,
                        height: '300px',
                      }}
                    >
                      <div 
                        className="p-3 text-white flex justify-between items-center"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <h3 className={`font-${fontFamily.toLowerCase()} text-sm font-medium`}>Chat with Us</h3>
                        <div className="flex space-x-1">
                          <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10">
                            <span className="sr-only">Minimize</span>
                            <span>−</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 p-3 overflow-y-auto flex flex-col">
                        <div className="bg-gray-100 text-gray-800 p-2 rounded-lg mb-2 max-w-[80%] text-xs">
                          {initialMessage}
                        </div>
                      </div>

                      <div className="border-t p-2 flex">
                        <input 
                          type="text" 
                          placeholder={placeholderText}
                          className="border rounded-l-md px-2 py-1 text-xs flex-grow"
                          style={{ borderRadius: `${borderRadius[0] / 1.5}px` }}
                        />
                        <button 
                          className="text-white rounded-r-md px-3 py-1 text-xs"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Preview Controls */}
                  <div className="p-3 border-t border-gray-200 bg-white">
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">Minimized View</Button>
                      <Button variant="outline" size="sm">Expanded View</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WidgetConfigPage;
