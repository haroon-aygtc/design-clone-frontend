
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function NoModelsAlert() {
  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">No Active AI Models</h4>
            <p className="text-xs text-gray-600 mt-1">
              You need to connect and activate at least one AI model before you can use the chat widget.
            </p>
            <a href="/admin/ai-models" className="text-xs text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Go to AI Models page
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
