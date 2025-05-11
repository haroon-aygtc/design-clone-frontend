
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { WidgetPreview } from "@/components/widget-config/WidgetPreview";
import { useWidgetSettings } from "@/components/widget-config/useWidgetSettings";
import { WidgetConfigurator } from "@/components/widget-config/WidgetConfigurator";
import { SaveConfigButton } from "@/components/widget-config/SaveConfigButton";
import { useToast } from "@/components/ui/use-toast";

const WidgetConfigPage = () => {
  const [selectedModelId, setSelectedModelId] = useState("");
  const { toast } = useToast();
  
  const {
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
  } = useWidgetSettings(selectedModelId);

  const settingData = {
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
  };

  return (
    <AdminLayout title="Widget Config">
      <div className="flex justify-end mb-4">
        <SaveConfigButton
          selectedModelId={selectedModelId}
          settingId={settingId}
          settingData={settingData}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WidgetConfigurator 
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
