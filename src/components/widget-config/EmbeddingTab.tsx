
import { useState } from "react";
import { StatusCards } from "./embedding/StatusCards";
import { EmbedOptions } from "./embedding/EmbedOptions";
import { HowItWorks } from "./embedding/HowItWorks";
import { InstallationInstructions } from "./embedding/InstallationInstructions";
import { AdvancedOptions } from "./embedding/AdvancedOptions";

interface EmbeddingTabProps {
  embedCode: string;
  updatePreview: () => void;
}

export function EmbeddingTab({ embedCode, updatePreview }: EmbeddingTabProps) {
  const [activeTab, setActiveTab] = useState("iframe");
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-2">Embedding Code</h3>
        <p className="text-sm text-gray-600 mb-4">Get the code to embed your AI-powered chat widget on any website</p>
      </div>

      <div className="space-y-4">
        <StatusCards />
        <EmbedOptions 
          embedCode={embedCode} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <HowItWorks />
        <InstallationInstructions activeTab={activeTab} />
        <AdvancedOptions />
      </div>
    </div>
  );
}
