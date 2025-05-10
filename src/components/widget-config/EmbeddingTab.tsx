import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy, Code, Bot } from "lucide-react";
import { useState } from "react";

interface EmbeddingTabProps {
  embedCode: string;
  updatePreview: () => void;
}

export function EmbeddingTab({ embedCode, updatePreview }: EmbeddingTabProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("iframe");

  // Generate iframe embed code (default)
  const getIframeCode = () => {
    return `<!-- iFrame Integration - Complete isolation -->
<iframe 
  src="https://cdn.example.com/chat-widget/embed.html" 
  width="0" 
  height="0" 
  style="border:none; position:fixed; bottom:0; right:0;" 
  allow="microphone"
  title="Chat Widget">
</iframe>`;
  };

  // Generate web component code
  const getWebComponentCode = () => {
    return `<!-- Web Component Integration using Shadow DOM -->
<script src="https://cdn.example.com/chat-widget/web-component.js"></script>

<!-- Add the widget to your page -->
<chat-widget
  primary-color="${embedCode.match(/primaryColor: "(.+?)"/)?.[1] || "#6366F1"}"
  position="${embedCode.match(/position: "(.+?)"/)?.[1] || "bottom-right"}"
  auto-open="${embedCode.match(/autoOpen: (.+?)(,|\})/)?.[1] || "false"}">
</chat-widget>`;
  };

  // Get the currently active code based on the selected tab
  const getActiveCode = () => {
    return activeTab === "iframe" ? getIframeCode() : getWebComponentCode();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-2">Embedding Code</h3>
        <p className="text-sm text-gray-600 mb-4">Get the code to embed your AI-powered chat widget on any website</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Bot className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">AI Integration Ready</h4>
                <p className="text-xs text-gray-600 mt-1">
                  This widget is configured to use your selected AI model. The embed code includes all necessary
                  configurations for the AI to process messages automatically.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Ready to Use</h4>
                <p className="text-xs text-gray-600 mt-1">
                  The generated code is fully configured with your selected AI model and widget settings. Users can simply copy, 
                  paste and have a working chat widget with no additional setup required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="iframe" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="iframe">iFrame Integration</TabsTrigger>
            <TabsTrigger value="web-component">Web Component</TabsTrigger>
          </TabsList>

          <TabsContent value="iframe" className="mt-0">
            <Card className="relative">
              <CardContent className="p-4">
                <div className="code-editor-container">
                  <div className="code-editor-header bg-gray-800 text-white text-xs rounded-t-md px-4 py-2 flex justify-between items-center">
                    <span className="opacity-70">HTML</span>
                    <div className="flex space-x-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-b-md font-mono text-sm overflow-x-auto text-gray-200">
                    <pre className="whitespace-pre-wrap">
                      {getIframeCode().split('\n').map((line, i) => {
                        // Basic syntax highlighting
                        const highlightedLine = line
                          .replace(/(&lt;|<)([\/\w\s="':-]*)(&gt;|>)/g, '<span class="text-blue-400">$1$2$3</span>')
                          .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
                          .replace(/(<!--.*?-->)/g, '<span class="text-gray-500">$1</span>');
                        
                        return (
                          <div key={i} className="flex">
                            <span className="text-gray-500 w-8 inline-block select-none">{i + 1}</span>
                            <span dangerouslySetInnerHTML={{ __html: highlightedLine }}></span>
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Complete isolation from your website's styles and scripts.</p>
                  <p>Best for maximum compatibility and security.</p>
                </div>
                <Button 
                  className="absolute top-4 right-4 z-10" 
                  variant="outline" 
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {codeCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {codeCopied ? "Copied!" : "Copy"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="web-component" className="mt-0">
            <Card className="relative">
              <CardContent className="p-4">
                <div className="code-editor-container">
                  <div className="code-editor-header bg-gray-800 text-white text-xs rounded-t-md px-4 py-2 flex justify-between items-center">
                    <span className="opacity-70">HTML</span>
                    <div className="flex space-x-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-b-md font-mono text-sm overflow-x-auto text-gray-200">
                    <pre className="whitespace-pre-wrap">
                      {getWebComponentCode().split('\n').map((line, i) => {
                        // Basic syntax highlighting
                        const highlightedLine = line
                          .replace(/(&lt;|<)([\/\w\s="':-]*)(&gt;|>)/g, '<span class="text-blue-400">$1$2$3</span>')
                          .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
                          .replace(/(<!--.*?-->)/g, '<span class="text-gray-500">$1</span>');
                        
                        return (
                          <div key={i} className="flex">
                            <span className="text-gray-500 w-8 inline-block select-none">{i + 1}</span>
                            <span dangerouslySetInnerHTML={{ __html: highlightedLine }}></span>
                          </div>
                        );
                      })}
                    </pre>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Uses Shadow DOM to encapsulate styles and scripts.</p>
                  <p>Better performance and more seamless integration.</p>
                </div>
                <Button 
                  className="absolute top-4 right-4 z-10" 
                  variant="outline" 
                  size="sm"
                  onClick={copyToClipboard}
                >
                  {codeCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {codeCopied ? "Copied!" : "Copy"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div>
          <h4 className="text-base font-medium mb-2">How It Works</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              <span className="font-medium">Copy and paste</span>: Add the embed code to your website
            </li>
            <li>
              <span className="font-medium">Automatic connection</span>: The widget connects to our AI backend
            </li>
            <li>
              <span className="font-medium">User interaction</span>: Visitors chat with your configured AI model
            </li>
            <li>
              <span className="font-medium">Real-time responses</span>: The AI responds based on your settings
            </li>
          </ol>
        </div>

        <div>
          <h4 className="text-base font-medium mb-2">Installation Instructions</h4>
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium mb-1">1. Copy the code above</h5>
              <p className="text-xs text-gray-600">Click the copy button to copy the widget code to your clipboard.</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">2. {activeTab === "iframe" ? "Add to your HTML" : "Add to your page"}</h5>
              <p className="text-xs text-gray-600">
                {activeTab === "iframe" 
                  ? "Add the iframe code just before the closing body tag in your HTML." 
                  : "Add the script tag to your head and the custom element to your body."}
              </p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-1">3. Save and publish your website</h5>
              <p className="text-xs text-gray-600">The AI-powered chat widget will automatically appear on your site.</p>
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
    </div>
  );
}
