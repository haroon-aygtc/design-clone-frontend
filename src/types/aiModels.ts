
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  type: string;
  description: string;
  status: 'Available' | 'Connected' | 'Unavailable';
  apiKey?: string;
  isActive?: boolean;
  usageCount?: number;
  lastUsed?: string;
  configuration?: AIModelConfiguration;
}

export interface AIModelConfiguration {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  systemPrompt?: string;
  contextWindow?: number;
  apiEndpoint?: string;
}

export type AIModelProvider = 'OpenAI' | 'Anthropic' | 'Google' | 'Mistral AI' | 'Cohere' | 'Other';
export type AIModelType = 'Large Language Model' | 'Image Generation' | 'Speech Recognition' | 'Multimodal';
