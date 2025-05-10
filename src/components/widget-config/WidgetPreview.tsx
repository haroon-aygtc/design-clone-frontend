
import { useState } from "react";
import { MessageSquare, Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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

type DeviceType = "desktop" | "mobile" | "tablet";

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
  const isMobile = useIsMobile();
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
  const [showExpanded, setShowExpanded] = useState(true);

  // Calculate preview container styles based on selected device
  const getPreviewContainerStyles = () => {
    switch (selectedDevice) {
      case "mobile":
        return {
          maxWidth: "320px",
          height: "580px",
          margin: "0 auto",
          border: "10px solid #222",
          borderRadius: "20px",
        };
      case "tablet":
        return {
          maxWidth: "768px",
          height: "500px",
          margin: "0 auto",
          border: "10px solid #222",
          borderRadius: "12px",
        };
      default:
        return {
          height: "500px",
        };
    }
  };

  // Calculate widget position based on position setting
  const getWidgetPosition = () => {
    const positions: Record<string, string> = {
      "bottom-right": "bottom-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "top-right": "top-4 right-4",
      "top-left": "top-4 left-4",
    };
    
    return positions[position] || "bottom-4 right-4";
  };

  // Calculate chat container position based on widget position
  const getChatContainerPosition = () => {
    const widgetPos = position || "bottom-right";
    
    if (widgetPos.includes("top")) {
      return widgetPos.includes("right") ? "top-20 right-4" : "top-20 left-4";
    } else {
      return widgetPos.includes("right") ? "bottom-20 right-4" : "bottom-20 left-4";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      
      {/* Device preview selection */}
      <div className="mb-4 flex justify-center gap-2">
        <Button 
          variant={selectedDevice === "desktop" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSelectedDevice("desktop")}
          className="flex items-center gap-2"
        >
          <Monitor size={16} />
          {!isMobile && <span>Desktop</span>}
        </Button>
        <Button 
          variant={selectedDevice === "tablet" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSelectedDevice("tablet")}
          className="flex items-center gap-2"
        >
          <Tablet size={16} />
          {!isMobile && <span>Tablet</span>}
        </Button>
        <Button 
          variant={selectedDevice === "mobile" ? "default" : "outline"} 
          size="sm" 
          onClick={() => setSelectedDevice("mobile")}
          className="flex items-center gap-2"
        >
          <Smartphone size={16} />
          {!isMobile && <span>Mobile</span>}
        </Button>
      </div>
      
      <div 
        className="border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] bg-gray-50 relative overflow-hidden"
        style={getPreviewContainerStyles()}
      >
        {previewLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Simulated website content for more realistic preview */}
            <div className="w-full bg-white border-b p-3">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
            </div>
            
            <div className="flex-1 p-4 relative">
              {/* Simulated content blocks */}
              <div className="max-w-md mx-auto space-y-4 pt-8">
                <div className="h-8 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="h-4 bg-gray-100 rounded w-full"></div>
                <div className="h-20 bg-gray-100 rounded w-full"></div>
              </div>

              {/* Widget Preview */}
              <div 
                className={`absolute ${getWidgetPosition()} rounded-full shadow-lg cursor-pointer z-10`}
                style={{
                  backgroundColor: primaryColor,
                  width: `${chatIconSize}px`,
                  height: `${chatIconSize}px`,
                }}
                onClick={() => setShowExpanded(!showExpanded)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="text-white" size={chatIconSize[0] * 0.5} />
                </div>
              </div>

              {/* Expanded Chat Widget */}
              {showExpanded && (
                <div 
                  className={`w-72 absolute ${getChatContainerPosition()} rounded-lg shadow-lg overflow-hidden flex flex-col bg-white z-20`}
                  style={{
                    borderRadius: `${borderRadius[0]}px`,
                    height: '300px',
                    maxWidth: selectedDevice === "mobile" ? "85%" : "300px",
                  }}
                >
                  <div 
                    className="p-3 text-white flex justify-between items-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <h3 className={`font-${fontFamily.toLowerCase()} text-sm font-medium`}>Chat with Us</h3>
                    <div className="flex space-x-1">
                      <button 
                        className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10"
                        onClick={() => setShowExpanded(false)}
                      >
                        <span className="sr-only">Minimize</span>
                        <span>−</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-3 overflow-y-auto flex flex-col">
                    <div className="bg-gray-100 text-gray-800 p-2 rounded-lg mb-2 max-w-[80%] text-xs">
                      {initialMessage}
                    </div>
                  </div>

                  <div className="border-t p-2 flex">
                    <input 
                      type="text" 
                      placeholder={placeholderText}
                      className="border rounded-l-md px-2 py-1 text-xs flex-grow"
                      style={{ borderRadius: `${borderRadius[0] / 1.5}px` }}
                    />
                    <button 
                      className="text-white rounded-r-md px-3 py-1 text-xs"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Controls */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExpanded(false)}
                  className={!showExpanded ? "bg-gray-100" : ""}
                >
                  Minimized View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowExpanded(true)}
                  className={showExpanded ? "bg-gray-100" : ""}
                >
                  Expanded View
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
