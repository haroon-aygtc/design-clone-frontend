
import { Badge } from "@/components/ui/badge";

export function SimulatedContent() {
  return (
    <div className="flex flex-col h-full">
      {/* Simulated website header */}
      <div className="w-full bg-white border-b p-3 flex items-center justify-between">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      
      {/* Simulated content blocks */}
      <div className="flex-1 p-4 relative">
        <div className="max-w-md mx-auto space-y-4 pt-8">
          <div className="h-8 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <Badge variant="outline" className="bg-blue-50">Demo</Badge>
            </div>
            <div className="h-16 bg-gray-100 rounded w-full"></div>
          </div>
          
          <div className="h-4 bg-gray-100 rounded w-5/6"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
