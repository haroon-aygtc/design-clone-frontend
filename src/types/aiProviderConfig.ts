export interface AIProviderEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  request_template?: Record<string, any>;
  response_mapping?: Record<string, any>;
  prompt_field?: string;
  stream_content_path?: string;
  models_path?: string;
  model_mapping?: {
    id: string;
    name: string;
  };
}

export interface AIProviderConfig {
  id: number;
  name: string;
  display_name: string;
  description?: string;
  api_url: string;
  api_key?: string;
  headers?: Record<string, string>;
  default_params?: Record<string, any>;
  endpoints?: Record<string, AIProviderEndpoint>;
  is_dynamic: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
