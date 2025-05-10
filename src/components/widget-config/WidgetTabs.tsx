
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Gauge, MessageSquare, Code } from "lucide-react";

import { AppearanceTab } from "./AppearanceTab";
import { BehaviorTab } from "./BehaviorTab";
import { ContentTab } from "./ContentTab";
import { EmbeddingTab } from "./EmbeddingTab";

interface WidgetTabsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  borderRadius: number[];
  setBorderRadius: (radius: number[]) => void;
  chatIconSize: number[];
  setChatIconSize: (size: number[]) => void;
  responseDelay: number[];
  setResponseDelay: (delay: number[]) => void;
  autoOpen: boolean;
  setAutoOpen: (open: boolean) => void;
  position: string;
  setPosition: (position: string) => void;
  allowAttachments: boolean;
  setAllowAttachments: (allow: boolean) => void;
  initialMessage: string;
  setInitialMessage: (message: string) => void;
  placeholderText: string;
  setPlaceholderText: (text: string) => void;
  embedCode: string;
  updatePreview: () => void;
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
  updatePreview
}: WidgetTabsProps) {
  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="appearance" onClick={updatePreview}>
          <Paintbrush className="mr-2 h-4 w-4" />
          Appearance
        </TabsTrigger>
        <TabsTrigger value="behavior" onClick={updatePreview}>
          <Gauge className="mr-2 h-4 w-4" />
          Behavior
        </TabsTrigger>
        <TabsTrigger value="content" onClick={updatePreview}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Content
        </TabsTrigger>
        <TabsTrigger value="embedding" onClick={updatePreview}>
          <Code className="mr-2 h-4 w-4" />
          Embedding
        </TabsTrigger>
      </TabsList>

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

      <TabsContent value="embedding">
        <EmbeddingTab 
          embedCode={embedCode}
          updatePreview={updatePreview}
        />
      </TabsContent>
    </Tabs>
  );
}
