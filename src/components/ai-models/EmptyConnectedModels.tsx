
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyConnectedModels = () => {
  return (
    <div className="text-center py-10 border rounded-lg">
      <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h3 className="text-lg font-medium mb-2">No Connected Models</h3>
      <p className="text-muted-foreground mb-4">Connect your first AI model to get started.</p>
      <Button>
        Connect a Model
      </Button>
    </div>
  );
};

export default EmptyConnectedModels;
