
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

export function ModelInfoCard() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm">Model Performance</h4>
            <p className="text-xs text-gray-600 mt-1">
              Chat performance depends on the selected model. Higher-capability models may provide better responses
              but could have higher usage costs.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
