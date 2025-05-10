
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function AdvancedOptions() {
  return (
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
  );
}
