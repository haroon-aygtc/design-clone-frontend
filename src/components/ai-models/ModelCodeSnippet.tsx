
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { AIModel } from "@/types/aiModels";

interface ModelCodeSnippetProps {
  model: AIModel;
}

const ModelCodeSnippet = ({ model }: ModelCodeSnippetProps) => {
  const [copied, setCopied] = useState(false);

  const modelCode = `// Example code for using ${model.name}
import { Configuration, OpenAIApi } from 'openai'; // Adjust based on provider

// Initialize the client
const configuration = new Configuration({
  apiKey: 'YOUR_API_KEY_HERE',
});
const client = new OpenAIApi(configuration);

// Make an API call
async function generateResponse(prompt) {
  const completion = await client.createCompletion({
    model: '${model.name.toLowerCase().replace(/\s+/g, "-")}',
    prompt: prompt,
    temperature: ${model.configuration?.temperature || 0.7},
    max_tokens: ${model.configuration?.maxTokens || 2000}
  });
  
  return completion.data.choices[0].text;
}

// Example usage
const response = await generateResponse("Hello, how can I help you today?");
console.log(response);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(modelCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-editor-container mt-4">
      <div className="code-editor-header flex items-center justify-between bg-gray-800 text-white px-4 py-2 text-xs">
        <span>Example Code</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy} 
          className="h-8 px-2 text-gray-300 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-xs font-mono">
        <code>{modelCode}</code>
      </pre>
    </div>
  );
};

export default ModelCodeSnippet;
