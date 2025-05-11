
import { useState } from "react";
import { DeviceSwitcher, DeviceType } from "./preview/DeviceSwitcher";
import { ChatWidget } from "./preview/ChatWidget";
import { PreviewControls } from "./preview/PreviewControls";
import { PreviewContainer } from "./preview/PreviewContainer";
import { SimulatedContent } from "./preview/SimulatedContent";
import { usePreviewStyles } from "./preview/usePreviewStyles";

interface WidgetPreviewProps {
  previewLoading: boolean;
  primaryColor: string;
  chatIconSize: number[];
  borderRadius: number[];
  fontFamily: string;
  initialMessage: string;
  placeholderText: string;
  position?: string;
}

export function WidgetPreview({
  previewLoading,
  primaryColor,
  chatIconSize,
  borderRadius,
  fontFamily,
  initialMessage,
  placeholderText,
  position = "bottom-right",
}: WidgetPreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
  const [showExpanded, setShowExpanded] = useState(true);
  const { getDeviceMaxWidth } = usePreviewStyles(selectedDevice);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      
      {/* Device preview selection */}
      <DeviceSwitcher 
        selectedDevice={selectedDevice} 
        setSelectedDevice={setSelectedDevice} 
      />
      
      <PreviewContainer selectedDevice={selectedDevice}>
        {previewLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <>
            <SimulatedContent />
            
            <div className="relative">
              {/* Widget Preview */}
              <ChatWidget 
                primaryColor={primaryColor}
                chatIconSize={chatIconSize}
                borderRadius={borderRadius}
                fontFamily={fontFamily}
                initialMessage={initialMessage}
                placeholderText={placeholderText}
                position={position}
                showExpanded={showExpanded}
                setShowExpanded={setShowExpanded}
              />
            </div>

            {/* Preview Controls */}
            <PreviewControls 
              showExpanded={showExpanded} 
              setShowExpanded={setShowExpanded} 
            />
          </>
        )}
      </PreviewContainer>
    </div>
  );
}
