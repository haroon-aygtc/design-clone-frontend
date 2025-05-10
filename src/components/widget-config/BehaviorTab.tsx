
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Gauge } from "lucide-react";

interface BehaviorTabProps {
  responseDelay: number[];
  setResponseDelay: (delay: number[]) => void;
  autoOpen: boolean;
  setAutoOpen: (open: boolean) => void;
  position: string;
  setPosition: (position: string) => void;
  allowAttachments: boolean;
  setAllowAttachments: (allow: boolean) => void;
  updatePreview: () => void;
}

export function BehaviorTab({
  responseDelay,
  setResponseDelay,
  autoOpen,
  setAutoOpen,
  position,
  setPosition,
  allowAttachments,
  setAllowAttachments,
  updatePreview
}: BehaviorTabProps) {
  return (
    <div className="space-y-6">
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
        <Button onClick={updatePreview}>Save Changes</Button>
      </div>
    </div>
  );
}
