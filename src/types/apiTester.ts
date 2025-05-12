export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

export interface APIRequest {
  id: string;
  name: string;
  url: string;
  method: HTTPMethod;
  headers: Record<string, string>;
  params: Record<string, string>;
  body: string;
  description: string;
}

export interface APIResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  time: number;
}

export interface APICollection {
  id: string;
  name: string;
  description: string;
  requests: APIRequest[];
}

export interface RequestHistory {
  id: string;
  timestamp: string;
  request: APIRequest;
  response: APIResponse;
}
