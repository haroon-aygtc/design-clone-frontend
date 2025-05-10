
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface CodePreviewProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodePreview({ code, language = "html", title = "HTML" }: CodePreviewProps) {
  const [codeCopied, setCodeCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className="code-editor-container">
          <div className="code-editor-header bg-gray-800 text-white text-xs rounded-t-md px-4 py-2 flex justify-between items-center">
            <span className="opacity-70">{title}</span>
            <div className="flex space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-b-md font-mono text-sm overflow-x-auto text-gray-200">
            <pre className="whitespace-pre-wrap">
              {code.split('\n').map((line, i) => {
                // Basic syntax highlighting
                const highlightedLine = line
                  .replace(/(&lt;|<)([\/\w\s="':-]*)(&gt;|>)/g, '<span class="text-blue-400">$1$2$3</span>')
                  .replace(/(".*?")/g, '<span class="text-green-400">$1</span>')
                  .replace(/(<!--.*?-->)/g, '<span class="text-gray-500">$1</span>');
                
                return (
                  <div key={i} className="flex">
                    <span className="text-gray-500 w-8 inline-block select-none">{i + 1}</span>
                    <span dangerouslySetInnerHTML={{ __html: highlightedLine }}></span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
        <Button 
          className="absolute top-4 right-4 z-10" 
          variant="outline" 
          size="sm"
          onClick={copyToClipboard}
        >
          {codeCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {codeCopied ? "Copied!" : "Copy"}
        </Button>
      </CardContent>
    </Card>
  );
}
