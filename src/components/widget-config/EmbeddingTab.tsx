
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Copy, Code } from "lucide-react";
import { useState } from "react";

interface EmbeddingTabProps {
  embedCode: string;
  updatePreview: () => void;
}

export function EmbeddingTab({ embedCode, updatePreview }: EmbeddingTabProps) {
  const [codeCopied, setCodeCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}
