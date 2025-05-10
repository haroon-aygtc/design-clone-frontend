
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AIModel } from "@/types/aiModels";

interface ModelLogsProps {
  model: AIModel;
}

type LogType = "Usage" | "Error" | "System";

interface Log {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
  details?: string;
}

const ModelLogs = ({ model }: ModelLogsProps) => {
  // Mock log data
  const [logs] = useState<Log[]>([
    {
      id: "1",
      timestamp: "2023-06-10 14:23:45",
      type: "Usage",
      message: "API call successful",
      details: "Generated 256 tokens in 2.3 seconds"
    },
    {
      id: "2",
      timestamp: "2023-06-10 14:20:12",
      type: "Usage",
      message: "API call successful",
      details: "Generated 512 tokens in 4.1 seconds"
    },
    {
      id: "3",
      timestamp: "2023-06-10 13:55:30",
      type: "Error",
      message: "Rate limit exceeded",
      details: "Too many requests in 1 minute"
    },
    {
      id: "4",
      timestamp: "2023-06-10 13:45:22",
      type: "System",
      message: "Model configuration updated",
      details: "Temperature changed from 0.7 to 0.8"
    },
    {
      id: "5",
      timestamp: "2023-06-10 13:30:15",
      type: "Usage",
      message: "API call successful",
      details: "Generated 128 tokens in 1.2 seconds"
    }
  ]);

  const getLogTypeClass = (type: LogType) => {
    switch (type) {
      case "Usage": return "bg-green-100 text-green-800";
      case "Error": return "bg-red-100 text-red-800";
      case "System": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-6 border rounded-md overflow-hidden">
      <Tabs defaultValue="all" className="w-full">
        <div className="bg-muted/50 p-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All Logs</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="p-0">
          <LogTable logs={logs} getLogTypeClass={getLogTypeClass} />
        </TabsContent>
        
        <TabsContent value="usage" className="p-0">
          <LogTable 
            logs={logs.filter(log => log.type === "Usage")} 
            getLogTypeClass={getLogTypeClass} 
          />
        </TabsContent>
        
        <TabsContent value="errors" className="p-0">
          <LogTable 
            logs={logs.filter(log => log.type === "Error")} 
            getLogTypeClass={getLogTypeClass} 
          />
        </TabsContent>
        
        <TabsContent value="system" className="p-0">
          <LogTable 
            logs={logs.filter(log => log.type === "System")} 
            getLogTypeClass={getLogTypeClass} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const LogTable = ({ 
  logs, 
  getLogTypeClass 
}: { 
  logs: Log[], 
  getLogTypeClass: (type: LogType) => string 
}) => {
  if (logs.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No logs found
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLogTypeClass(log.type)}`}>
                  {log.type}
                </span>
              </TableCell>
              <TableCell>{log.message}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{log.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ModelLogs;
