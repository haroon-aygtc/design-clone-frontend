
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Check } from "lucide-react";

export function StatusCards() {
  return (
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
    </div>
  );
}
