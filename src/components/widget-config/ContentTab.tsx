
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ContentTabProps {
  initialMessage: string;
  setInitialMessage: (message: string) => void;
  placeholderText: string;
  setPlaceholderText: (text: string) => void;
  updatePreview: () => void;
}

export function ContentTab({
  initialMessage,
  setInitialMessage,
  placeholderText,
  setPlaceholderText,
  updatePreview
}: ContentTabProps) {
  return (
    <div className="space-y-6">
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
        <Button onClick={updatePreview}>Save Changes</Button>
      </div>
    </div>
  );
}
