
import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { WidgetTabs } from "@/components/widget-config/WidgetTabs";
import { WidgetPreview } from "@/components/widget-config/WidgetPreview";

const WidgetConfigPage = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#6366F1");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [chatIconSize, setChatIconSize] = useState([40]);
  const [initialMessage, setInitialMessage] = useState("Hi there! How can I help you today?");
  const [placeholderText, setPlaceholderText] = useState("Ask me anything...");
  const [responseDelay, setResponseDelay] = useState([1]);
  const [autoOpen, setAutoOpen] = useState(false);
  const [position, setPosition] = useState("bottom-right");
  const [allowAttachments, setAllowAttachments] = useState(true);
  const [embedCode, setEmbedCode] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Update preview with loading animation
  const updatePreview = () => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 800);
  };

  // Generate embed code based on current settings
  useEffect(() => {
    const code = `<script>
  window.chatWidgetSettings = {
    primaryColor: "${primaryColor}",
    secondaryColor: "${secondaryColor}",
    fontFamily: "${fontFamily}",
    borderRadius: ${borderRadius[0]},
    chatIconSize: ${chatIconSize[0]},
    position: "${position}",
    autoOpen: ${autoOpen},
    initialMessage: "${initialMessage}",
    placeholderText: "${placeholderText}",
    allowAttachments: ${allowAttachments},
    responseDelay: ${responseDelay[0]}
  };
</script>
<script src="https://cdn.example.com/chat-widget.js" async></script>`;
    
    setEmbedCode(code);
  }, [
    primaryColor, 
    secondaryColor, 
    fontFamily, 
    borderRadius, 
    chatIconSize, 
    position, 
    autoOpen, 
    initialMessage,
    placeholderText,
    allowAttachments,
    responseDelay
  ]);

  return (
    <AdminLayout title="Widget Config">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-xl font-semibold mb-4">Widget Configurator</h2>

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
            />
          </div>
        </div>
        
        <div>
          <WidgetPreview
            previewLoading={previewLoading}
            primaryColor={primaryColor}
            chatIconSize={chatIconSize}
            borderRadius={borderRadius}
            fontFamily={fontFamily}
            initialMessage={initialMessage}
            placeholderText={placeholderText}
            position={position}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default WidgetConfigPage;
