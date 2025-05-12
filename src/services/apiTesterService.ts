import axios from 'axios';
import { APICollection, APIRequest, APIResponse, RequestHistory } from '@/types/apiTester';
import apiClient from './api';

// Local storage keys
const COLLECTIONS_STORAGE_KEY = 'api_tester_collections';
const HISTORY_STORAGE_KEY = 'api_tester_history';

export const apiTesterService = {
  // Get available APIs from the backend
  getAvailableAPIs: async (): Promise<string[]> => {
    try {
      // First try to get APIs from the backend
      const response = await apiClient.get('/api-endpoints');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch API endpoints from backend, using fallback list', error);
      
      // Fallback to a list of common APIs in the application
      return [
        '/api/ai-models',
        '/api/ai-provider-configs',
        '/api/widget/chat',
        '/api/users',
        'https://jsonplaceholder.typicode.com/posts',
        'https://jsonplaceholder.typicode.com/users',
        'https://jsonplaceholder.typicode.com/comments',
        'https://api.github.com/users',
        'https://api.publicapis.org/entries',
      ];
    }
  },

  // Get collections from local storage
  getCollections: async (): Promise<APICollection[]> => {
    try {
      const collectionsJson = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (collectionsJson) {
        return JSON.parse(collectionsJson);
      }
      
      // Return default collection if none exists
      const defaultCollection: APICollection = {
        id: Date.now().toString(),
        name: 'My Collection',
        description: 'Default collection',
        requests: [],
      };
      
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify([defaultCollection]));
      return [defaultCollection];
    } catch (error) {
      console.error('Error getting collections:', error);
      return [];
    }
  },

  // Save collections to local storage
  saveCollections: async (collections: APICollection[]): Promise<void> => {
    try {
      localStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections));
    } catch (error) {
      console.error('Error saving collections:', error);
    }
  },

  // Get request history from local storage
  getRequestHistory: async (): Promise<RequestHistory[]> => {
    try {
      const historyJson = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
      return [];
    } catch (error) {
      console.error('Error getting request history:', error);
      return [];
    }
  },

  // Save request history to local storage
  saveRequestHistory: async (history: RequestHistory[]): Promise<void> => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving request history:', error);
    }
  },

  // Send an API request
  sendRequest: async (request: APIRequest): Promise<APIResponse> => {
    const startTime = Date.now();
    
    try {
      // Build URL with query parameters
      let url = request.url;
      const queryParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(request.params)) {
        queryParams.append(key, value);
      }
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
      
      // Prepare request config
      const config = {
        method: request.method,
        url,
        headers: request.headers,
        data: request.body ? JSON.parse(request.body) : undefined,
      };
      
      // Send request
      const response = await axios(config);
      
      // Calculate request time
      const endTime = Date.now();
      const requestTime = endTime - startTime;
      
      // Format headers
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(response.headers)) {
        headers[key] = value as string;
      }
      
      return {
        status: response.status,
        statusText: response.statusText,
        headers,
        data: response.data,
        time: requestTime,
      };
    } catch (error) {
      // Calculate request time even for errors
      const endTime = Date.now();
      const requestTime = endTime - startTime;
      
      if (axios.isAxiosError(error) && error.response) {
        // Format headers
        const headers: Record<string, string> = {};
        for (const [key, value] of Object.entries(error.response.headers)) {
          headers[key] = value as string;
        }
        
        return {
          status: error.response.status,
          statusText: error.response.statusText,
          headers,
          data: error.response.data,
          time: requestTime,
        };
      }
      
      // Generic error response
      return {
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        time: requestTime,
      };
    }
  },

  // Generate sample data based on the API endpoint
  generateSampleData: (url: string): any => {
    // Extract the endpoint name from the URL
    const endpoint = url.split('/').pop()?.toLowerCase() || '';
    
    // Generate sample data based on common endpoints
    if (endpoint.includes('user')) {
      return {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        active: true
      };
    }
    
    if (endpoint.includes('post') || endpoint.includes('article')) {
      return {
        title: 'Sample Post Title',
        content: 'This is the content of the sample post.',
        author: 'John Doe',
        tags: ['sample', 'test', 'example']
      };
    }
    
    if (endpoint.includes('comment')) {
      return {
        postId: 1,
        text: 'This is a sample comment.',
        author: 'John Doe'
      };
    }
    
    if (endpoint.includes('product')) {
      return {
        name: 'Sample Product',
        price: 99.99,
        description: 'This is a sample product description.',
        inStock: true,
        categories: ['electronics', 'gadgets']
      };
    }
    
    if (endpoint.includes('order')) {
      return {
        orderId: '12345',
        customer: 'John Doe',
        items: [
          { productId: 1, quantity: 2, price: 99.99 },
          { productId: 2, quantity: 1, price: 49.99 }
        ],
        total: 249.97,
        status: 'pending'
      };
    }
    
    if (endpoint.includes('chat') || endpoint.includes('message')) {
      return {
        message: 'Hello, this is a test message.',
        widget_id: 1,
        context: {
          user: 'John Doe',
          session: '12345'
        }
      };
    }
    
    if (endpoint.includes('ai') || endpoint.includes('model')) {
      return {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Hello, can you help me?' }
        ],
        temperature: 0.7,
        max_tokens: 100
      };
    }
    
    // Default sample data
    return {
      id: 1,
      name: 'Sample Data',
      description: 'This is a sample data object for testing purposes.',
      timestamp: new Date().toISOString(),
      properties: {
        key1: 'value1',
        key2: 'value2',
        key3: true,
        key4: 42
      }
    };
  }
};

export default apiTesterService;
