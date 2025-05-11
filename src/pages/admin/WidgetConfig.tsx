
import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { WidgetTabs } from "@/components/widget-config/WidgetTabs";
import { WidgetPreview } from "@/components/widget-config/WidgetPreview";
import { AIModelsProvider } from "@/context/AIModelsContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Save } from "lucide-react";
import widgetSettingService, { WidgetSetting } from "@/services/widgetSettingService";

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
  const [selectedModelId, setSelectedModelId] = useState("");
  const [saving, setSaving] = useState(false);
  const [settingId, setSettingId] = useState<number | undefined>(undefined);
  const { toast } = useToast();

  // Update preview with loading animation
  const updatePreview = () => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 800);
  };

  // Load settings when selectedModelId changes
  useEffect(() => {
    if (selectedModelId) {
      const loadSettings = async () => {
        try {
          const settings = await widgetSettingService.getWidgetSettings(selectedModelId);
          setSettingId(settings.id);
          setPrimaryColor(settings.primary_color);
          setSecondaryColor(settings.secondary_color);
          setFontFamily(settings.font_family);
          setBorderRadius([settings.border_radius]);
          setChatIconSize([settings.chat_icon_size]);
          setResponseDelay([settings.response_delay]);
          setAutoOpen(settings.auto_open);
          setPosition(settings.position);
          setAllowAttachments(settings.allow_attachments);
          setInitialMessage(settings.initial_message || "");
          setPlaceholderText(settings.placeholder_text);
        } catch (error) {
          console.error("Failed to load settings", error);
          toast({
            title: "Error",
            description: "Could not load widget settings.",
            variant: "destructive",
          });
        }
      };

      loadSettings();
    }
  }, [selectedModelId, toast]);

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
    responseDelay: ${responseDelay[0]},
    aiModelId: "${selectedModelId}"
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
    responseDelay,
    selectedModelId
  ]);

  const handleSaveSettings = async () => {
    if (!selectedModelId) {
      toast({
        title: "Error",
        description: "Please select an AI model first.",
        variant: "destructive",
      });
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare settings object
      const settingsData: WidgetSetting = {
        id: settingId,
        ai_model_id: parseInt(selectedModelId),
        name: `Widget for ${selectedModelId}`,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
        border_radius: borderRadius[0],
        chat_icon_size: chatIconSize[0],
        response_delay: responseDelay[0],
        auto_open: autoOpen,
        position: position,
        allow_attachments: allowAttachments,
        initial_message: initialMessage,
        placeholder_text: placeholderText,
        suggested_questions: ["What services do you offer?", "How do I contact support?"]
      };
      
      // Save to API
      const response = await widgetSettingService.saveWidgetSettings(settingsData);
      setSettingId(response.id);
      
      toast({
        title: "Settings saved",
        description: "Your widget configuration has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save settings", error);
      toast({
        title: "Error",
        description: "Could not save widget configuration.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Widget Config">
      <div className="flex justify-end mb-4">
        <Button onClick={handleSaveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Configuration"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
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
