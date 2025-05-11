
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bot } from "lucide-react";
import { AIModel } from "@/types/aiModels";

interface AvailableModelsListProps {
  availableModels: AIModel[];
  onConnectClick: (model: AIModel) => void;
}

const AvailableModelsList = ({ availableModels, onConnectClick }: AvailableModelsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredModels = availableModels.filter(model => {
    const matchesSearch = searchTerm === "" || 
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || model.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <Input 
          className="max-w-sm" 
          placeholder="Search models..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select 
          defaultValue="all" 
          value={filterType} 
          onValueChange={setFilterType}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="large language model">Language Models</SelectItem>
            <SelectItem value="image">Image Generation</SelectItem>
            <SelectItem value="speech">Speech Processing</SelectItem>
            <SelectItem value="multimodal">Multimodal</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => (
          <ModelCard 
            key={model.id} 
            model={model} 
            onConnectClick={onConnectClick} 
          />
        ))}
        
        {filteredModels.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No models found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ModelCardProps {
  model: AIModel;
  onConnectClick: (model: AIModel) => void;
}

const ModelCard = ({ model, onConnectClick }: ModelCardProps) => {
  return (
    <Card className="overflow-hidden border-gray-200 hover:border-primary/50 transition-colors">
      <CardHeader className="bg-gray-50 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{model.name}</CardTitle>
            <CardDescription>{model.provider}</CardDescription>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <p className="text-sm">{model.description}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Type:</span>
            <span>{model.type}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Status:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
              {model.status}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-4">
        <Button variant="outline" className="mr-2">Learn More</Button>
        <Button onClick={() => onConnectClick(model)}>Connect</Button>
      </CardFooter>
    </Card>
  );
};

export default AvailableModelsList;
