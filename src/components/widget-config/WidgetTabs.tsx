
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppearanceTab } from "./AppearanceTab";
import { BehaviorTab } from "./BehaviorTab";
import { ContentTab } from "./ContentTab";
import { EmbeddingTab } from "./EmbeddingTab";
import { AIModelTab } from "./AIModelTab";

interface WidgetTabsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  fontFamily: string;
  setFontFamily: (fontFamily: string) => void;
  borderRadius: number[];
  setBorderRadius: (borderRadius: number[]) => void;
  chatIconSize: number[];
  setChatIconSize: (chatIconSize: number[]) => void;
  responseDelay: number[];
  setResponseDelay: (responseDelay: number[]) => void;
  autoOpen: boolean;
  setAutoOpen: (autoOpen: boolean) => void;
  position: string;
  setPosition: (position: string) => void;
  allowAttachments: boolean;
  setAllowAttachments: (allowAttachments: boolean) => void;
  initialMessage: string;
  setInitialMessage: (initialMessage: string) => void;
  placeholderText: string;
  setPlaceholderText: (placeholderText: string) => void;
  embedCode: string;
  updatePreview: () => void;
  selectedModelId?: string;
  setSelectedModelId?: (id: string) => void;
}

export function WidgetTabs({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  fontFamily,
  setFontFamily,
  borderRadius,
  setBorderRadius,
  chatIconSize,
  setChatIconSize,
  responseDelay,
  setResponseDelay,
  autoOpen,
  setAutoOpen,
  position,
  setPosition,
  allowAttachments,
  setAllowAttachments,
  initialMessage,
  setInitialMessage,
  placeholderText,
  setPlaceholderText,
  embedCode,
  updatePreview,
  selectedModelId = "",
  setSelectedModelId = () => {},
}: WidgetTabsProps) {
  return (
    <Tabs defaultValue="appearance">
      <TabsList className="w-full grid grid-cols-5">
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="behavior">Behavior</TabsTrigger>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="ai-model">AI Model</TabsTrigger>
        <TabsTrigger value="embed">Embed</TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="appearance">
          <AppearanceTab
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            chatIconSize={chatIconSize}
            setChatIconSize={setChatIconSize}
            updatePreview={updatePreview}
          />
        </TabsContent>
        
        <TabsContent value="behavior">
          <BehaviorTab
            responseDelay={responseDelay}
            setResponseDelay={setResponseDelay}
            autoOpen={autoOpen}
            setAutoOpen={setAutoOpen}
            position={position}
            setPosition={setPosition}
            allowAttachments={allowAttachments}
            setAllowAttachments={setAllowAttachments}
            updatePreview={updatePreview}
          />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentTab
            initialMessage={initialMessage}
            setInitialMessage={setInitialMessage}
            placeholderText={placeholderText}
            setPlaceholderText={setPlaceholderText}
            updatePreview={updatePreview}
          />
        </TabsContent>

        <TabsContent value="ai-model">
          <AIModelTab
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            updatePreview={updatePreview}
          />
        </TabsContent>
        
        <TabsContent value="embed">
          <EmbeddingTab
            embedCode={embedCode}
            updatePreview={updatePreview}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
