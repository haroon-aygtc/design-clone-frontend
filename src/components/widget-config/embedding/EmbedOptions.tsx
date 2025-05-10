
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodePreview } from "./CodePreview";

interface EmbedOptionsProps {
  embedCode: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function EmbedOptions({ embedCode, activeTab, setActiveTab }: EmbedOptionsProps) {
  // Generate iframe embed code (default)
  const getIframeCode = () => {
    return `<!-- iFrame Integration - Complete isolation -->
<iframe 
  src="https://cdn.example.com/chat-widget/embed.html" 
  width="0" 
  height="0" 
  style="border:none; position:fixed; bottom:0; right:0;" 
  allow="microphone"
  title="Chat Widget">
</iframe>`;
  };

  // Generate web component code
  const getWebComponentCode = () => {
    return `<!-- Web Component Integration using Shadow DOM -->
<script src="https://cdn.example.com/chat-widget/web-component.js"></script>

<!-- Add the widget to your page -->
<chat-widget
  primary-color="${embedCode.match(/primaryColor: "(.+?)"/)?.[1] || "#6366F1"}"
  position="${embedCode.match(/position: "(.+?)"/)?.[1] || "bottom-right"}"
  auto-open="${embedCode.match(/autoOpen: (.+?)(,|\})/)?.[1] || "false"}">
</chat-widget>`;
  };

  return (
    <Tabs defaultValue="iframe" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-2">
        <TabsTrigger value="iframe">iFrame Integration</TabsTrigger>
        <TabsTrigger value="web-component">Web Component</TabsTrigger>
      </TabsList>

      <TabsContent value="iframe" className="mt-0">
        <CodePreview code={getIframeCode()} />
        <div className="mt-3 text-xs text-gray-500">
          <p>Complete isolation from your website's styles and scripts.</p>
          <p>Best for maximum compatibility and security.</p>
        </div>
      </TabsContent>

      <TabsContent value="web-component" className="mt-0">
        <CodePreview code={getWebComponentCode()} />
        <div className="mt-3 text-xs text-gray-500">
          <p>Uses Shadow DOM to encapsulate styles and scripts.</p>
          <p>Better performance and more seamless integration.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
