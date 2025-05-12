
import { AIModel } from "@/types/aiModels";
import ConnectedModelCard from "./ConnectedModelCard";
import EmptyConnectedModels from "./EmptyConnectedModels";

interface ConnectedModelsListProps {
  connectedModels: AIModel[];
  onDeleteClick: (model: AIModel) => void;
  onToggleActive: (modelId: string) => void;
  onTestChat: (model: AIModel) => void;
  onTestConnection: (model: AIModel) => void;
}

const ConnectedModelsList = ({ 
  connectedModels, 
  onDeleteClick, 
  onToggleActive, 
  onTestChat,
  onTestConnection 
}: ConnectedModelsListProps) => {
  if (connectedModels.length === 0) {
    return <EmptyConnectedModels />;
  }

  return (
    <div className="space-y-4">
      {connectedModels.map((model) => (
        <ConnectedModelCard
          key={model.id}
          model={model}
          onToggleActive={onToggleActive}
          onDeleteClick={onDeleteClick}
          onTestChat={onTestChat}
          onTestConnection={onTestConnection}
        />
      ))}
    </div>
  );
};

export default ConnectedModelsList;
