
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import widgetSettingService, { WidgetSetting } from "@/services/widgetSettingService";

interface SaveConfigButtonProps {
  selectedModelId: string;
  settingId?: number;
  settingData: Omit<WidgetSetting, 'id' | 'ai_model_id' | 'name' | 'suggested_questions'>;
}

export function SaveConfigButton({ selectedModelId, settingId, settingData }: SaveConfigButtonProps) {
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

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
        primary_color: settingData.primary_color,
        secondary_color: settingData.secondary_color,
        font_family: settingData.font_family,
        border_radius: settingData.border_radius,
        chat_icon_size: settingData.chat_icon_size,
        response_delay: settingData.response_delay,
        auto_open: settingData.auto_open,
        position: settingData.position,
        allow_attachments: settingData.allow_attachments,
        initial_message: settingData.initial_message,
        placeholder_text: settingData.placeholder_text,
        suggested_questions: ["What services do you offer?", "How do I contact support?"]
      };
      
      // Save to API
      const response = await widgetSettingService.saveWidgetSettings(settingsData);
      return response.id;
    } catch (error) {
      console.error("Failed to save settings", error);
      toast({
        title: "Error",
        description: "Could not save widget configuration.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Button onClick={handleSaveSettings} disabled={saving}>
      <Save className="h-4 w-4 mr-2" />
      {saving ? "Saving..." : "Save Configuration"}
    </Button>
  );
}
