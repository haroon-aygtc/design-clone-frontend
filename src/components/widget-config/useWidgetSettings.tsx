
import { useState, useEffect } from "react";
import widgetSettingService from "@/services/widgetSettingService";
import { useToast } from "@/components/ui/use-toast";

export function useWidgetSettings(selectedModelId: string) {
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
  
  return {
    settingId,
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
    initialMessage,
    setInitialMessage,
    placeholderText,
    setPlaceholderText,
    responseDelay,
    setResponseDelay,
    autoOpen,
    setAutoOpen,
    position,
    setPosition,
    allowAttachments,
    setAllowAttachments,
    embedCode,
    previewLoading,
    updatePreview,
  };
}
