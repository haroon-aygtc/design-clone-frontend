
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WidgetPreviewProps {
  previewLoading: boolean;
  primaryColor: string;
  chatIconSize: number[];
  borderRadius: number[];
  fontFamily: string;
  initialMessage: string;
  placeholderText: string;
}

export function WidgetPreview({
  previewLoading,
  primaryColor,
  chatIconSize,
  borderRadius,
  fontFamily,
  initialMessage,
  placeholderText,
}: WidgetPreviewProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
      <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
      <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] bg-gray-50 relative">
        {previewLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Widget Preview */}
            <div className="flex-1 p-4 relative overflow-hidden">
              <div 
                className="absolute bottom-4 right-4 rounded-full shadow-lg cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  width: `${chatIconSize}px`,
                  height: `${chatIconSize}px`,
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="text-white" size={chatIconSize[0] * 0.5} />
                </div>
              </div>

              {/* Expanded Chat Widget */}
              <div 
                className="w-72 absolute bottom-20 right-4 rounded-lg shadow-lg overflow-hidden flex flex-col bg-white"
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
                    <button className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-black/10">
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
            </div>

            {/* Preview Controls */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">Minimized View</Button>
                <Button variant="outline" size="sm">Expanded View</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
