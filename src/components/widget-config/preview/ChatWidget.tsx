
import { MessageSquare } from "lucide-react";

interface ChatWidgetProps {
  primaryColor: string;
  chatIconSize: number[];
  borderRadius: number[];
  fontFamily: string;
  initialMessage: string;
  placeholderText: string;
  position: string;
  showExpanded: boolean;
  setShowExpanded: (show: boolean) => void;
}

export function ChatWidget({
  primaryColor,
  chatIconSize,
  borderRadius,
  fontFamily,
  initialMessage,
  placeholderText,
  position,
  showExpanded,
  setShowExpanded
}: ChatWidgetProps) {
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
    <>
      {/* Widget Button */}
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
    </>
  );
}
