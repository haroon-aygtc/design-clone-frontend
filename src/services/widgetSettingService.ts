
import apiClient from './api';

export interface WidgetSetting {
  id?: number;
  ai_model_id: number;
  name: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  border_radius: number;
  chat_icon_size: number;
  response_delay: number;
  auto_open: boolean;
  position: string;
  allow_attachments: boolean;
  initial_message: string | null;
  placeholder_text: string;
  suggested_questions: string[] | null;
}

export const widgetSettingService = {
  // Get widget settings
  getWidgetSettings: async (aiModelId: string): Promise<WidgetSetting> => {
    try {
      const response = await apiClient.get(`/widget-settings/model/${aiModelId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch widget settings', error);
      // Return default settings while in development
      return {
        ai_model_id: parseInt(aiModelId),
        name: "Default Widget",
        primary_color: "#6366F1",
        secondary_color: "#6366F1",
        font_family: "Inter",
        border_radius: 8,
        chat_icon_size: 40,
        response_delay: 1,
        auto_open: false,
        position: "bottom-right",
        allow_attachments: true,
        initial_message: "Hi there! How can I help you today?",
        placeholder_text: "Ask me anything...",
        suggested_questions: ["What services do you offer?", "How do I contact support?", "What are your business hours?"]
      };
    }
  },

  // Save widget settings
  saveWidgetSettings: async (settings: WidgetSetting): Promise<WidgetSetting> => {
    try {
      let response;
      if (settings.id) {
        // Update existing settings
        response = await apiClient.put(`/widget-settings/${settings.id}`, settings);
      } else {
        // Create new settings
        response = await apiClient.post('/widget-settings', settings);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to save widget settings', error);
      throw error;
    }
  },

  // Generate embed code
  generateEmbedCode: async (settingId: number): Promise<string> => {
    try {
      const response = await apiClient.get(`/widget-settings/${settingId}/embed-code`);
      return response.data.embed_code;
    } catch (error) {
      console.error('Failed to generate embed code', error);
      throw error;
    }
  }
};

export default widgetSettingService;
