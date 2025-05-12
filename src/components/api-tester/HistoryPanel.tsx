import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RequestHistory } from "@/types/apiTester";
import { Search, Trash, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface HistoryPanelProps {
  history: RequestHistory[];
  onSelectRequest: (historyItem: RequestHistory) => void;
}

const HistoryPanel = ({ history, onSelectRequest }: HistoryPanelProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredHistory = history.filter(item => 
    item.request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.request.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (status >= 300 && status < 400) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    if (status >= 400 && status < 500) return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    if (status >= 500) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "POST":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "PUT":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "DELETE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "PATCH":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), "MMM d, yyyy h:mm a");
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <h3 className="text-lg font-medium mb-1">No History Found</h3>
              <p className="text-sm">
                {history.length === 0
                  ? "Your request history will appear here"
                  : "No requests match your search"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-md p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => onSelectRequest(item)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={cn("px-2 py-0.5", getMethodColor(item.request.method))}>
                        {item.request.method}
                      </Badge>
                      <span className="font-medium truncate max-w-[200px]">
                        {item.request.name}
                      </span>
                    </div>
                    
                    <Badge className={cn("px-2 py-0.5", getStatusColor(item.response.status))}>
                      {item.response.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground truncate mb-2">
                    {item.request.url}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatTime(item.timestamp)}</span>
                    <span>{item.response.time ? `${item.response.time}ms` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
