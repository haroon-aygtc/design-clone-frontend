
import { WidgetTabs } from "@/components/widget-config/WidgetTabs";
import { AIModelsProvider } from "@/context/AIModelsContext";

interface WidgetConfiguratorProps {
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
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

export function WidgetConfigurator({
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
  selectedModelId,
  setSelectedModelId,
}: WidgetConfiguratorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <h2 className="text-xl font-semibold mb-4">Widget Configurator</h2>

      <AIModelsProvider>
        <WidgetTabs
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
          responseDelay={responseDelay}
          setResponseDelay={setResponseDelay}
          autoOpen={autoOpen}
          setAutoOpen={setAutoOpen}
          position={position}
          setPosition={setPosition}
          allowAttachments={allowAttachments}
          setAllowAttachments={setAllowAttachments}
          initialMessage={initialMessage}
          setInitialMessage={setInitialMessage}
          placeholderText={placeholderText}
          setPlaceholderText={setPlaceholderText}
          embedCode={embedCode}
          updatePreview={updatePreview}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
        />
      </AIModelsProvider>
    </div>
  );
}
