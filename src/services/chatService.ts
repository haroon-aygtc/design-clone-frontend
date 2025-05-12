import apiClient from './api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatContext {
  messages?: ChatMessage[];
  sessionId?: string;
  [key: string]: any;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  model?: {
    name: string;
    provider: string;
  };
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface StreamChunk {
  content: string;
  data: any;
}

export interface StreamCallbacks {
  onStart?: () => void;
  onChunk?: (chunk: StreamChunk) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

const chatService = {
  // Send a message to the chat API
  sendMessage: async (widgetId: number, message: string, context: ChatContext = {}): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post('/widget/chat', {
        widget_id: widgetId,
        message,
        context
      });
      return response.data;
    } catch (error) {
      console.error('Failed to send chat message', error);
      throw error;
    }
  },

  // Send a message with streaming response
  sendMessageStream: (
    widgetId: number,
    message: string,
    context: ChatContext = {},
    callbacks: StreamCallbacks = {}
  ): () => void => {
    // Create a URL with a unique timestamp to prevent caching
    const url = new URL(`${apiClient.defaults.baseURL}/widget/chat/stream`);

    // Create a new EventSource with POST method using a hidden form
    const form = document.createElement('form');
    form.method = 'POST';
    form.target = 'stream-iframe';
    form.action = url.toString();
    form.style.display = 'none';

    // Add the data as hidden fields
    const widgetIdField = document.createElement('input');
    widgetIdField.name = 'widget_id';
    widgetIdField.value = widgetId.toString();
    form.appendChild(widgetIdField);

    const messageField = document.createElement('input');
    messageField.name = 'message';
    messageField.value = message;
    form.appendChild(messageField);

    const contextField = document.createElement('input');
    contextField.name = 'context';
    contextField.value = JSON.stringify(context);
    form.appendChild(contextField);

    // Create a hidden iframe to receive the response
    const iframe = document.createElement('iframe');
    iframe.name = 'stream-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    document.body.appendChild(form);

    // Create a new EventSource connection
    let eventSource: EventSource | null = null;

    // When the iframe loads, it will contain the session ID
    iframe.onload = () => {
      try {
        // Create the EventSource with the proper URL
        eventSource = new EventSource(`${apiClient.defaults.baseURL}/widget/chat/stream`);

        // Handle connection open
        eventSource.onopen = () => {
          console.log('SSE connection opened');
        };

        // Handle start event
        eventSource.addEventListener('start', (event) => {
          const data = JSON.parse(event.data);
          if (callbacks.onStart) {
            callbacks.onStart();
          }
        });

        // Handle chunk events
        eventSource.addEventListener('chunk', (event) => {
          const data = JSON.parse(event.data);
          if (callbacks.onChunk) {
            callbacks.onChunk({
              content: data.content,
              data: data.data
            });
          }
        });

        // Handle end event
        eventSource.addEventListener('end', (event) => {
          const data = JSON.parse(event.data);
          if (callbacks.onEnd) {
            callbacks.onEnd();
          }
          cleanup();
        });

        // Handle errors
        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          if (callbacks.onError) {
            callbacks.onError(new Error('Stream connection error'));
          }
          cleanup();
        };
      } catch (error) {
        console.error('Error setting up EventSource:', error);
        if (callbacks.onError) {
          callbacks.onError(error instanceof Error ? error : new Error('Unknown error'));
        }
        cleanup();
      }
    };

    // Submit the form
    form.submit();

    // Cleanup function to remove elements and close connections
    const cleanup = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      if (document.body.contains(form)) {
        document.body.removeChild(form);
      }
    };

    // Return a function to close the connection
    return cleanup;
  },

  // Alternative implementation using fetch and ReadableStream
  sendMessageStreamFetch: async (
    widgetId: number,
    message: string,
    context: ChatContext = {},
    callbacks: StreamCallbacks = {}
  ): Promise<() => void> => {
    try {
      // Call onStart callback
      if (callbacks.onStart) {
        callbacks.onStart();
      }

      // Make the fetch request
      const response = await fetch(`${apiClient.defaults.baseURL}/widget/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({
          widget_id: widgetId,
          message,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      // Get a reader from the response body stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Function to read from the stream
      const read = async (): Promise<void> => {
        const { done, value } = await reader.read();

        if (done) {
          // Call onEnd callback
          if (callbacks.onEnd) {
            callbacks.onEnd();
          }
          return;
        }

        // Decode the chunk and add to buffer
        buffer += decoder.decode(value, { stream: true });

        // Process any complete SSE events in the buffer
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep the last incomplete event in the buffer

        for (const event of events) {
          if (!event.trim()) continue;

          const lines = event.split('\n');
          const eventType = lines[0].startsWith('event: ') ? lines[0].slice(7) : 'message';
          const data = lines[1].startsWith('data: ') ? JSON.parse(lines[1].slice(6)) : {};

          if (eventType === 'chunk' && callbacks.onChunk) {
            callbacks.onChunk({
              content: data.content,
              data: data.data
            });
          }
        }

        // Continue reading
        return read();
      };

      // Start reading
      read().catch(error => {
        console.error('Stream reading error:', error);
        if (callbacks.onError) {
          callbacks.onError(error);
        }
      });

      // Return a function to abort the fetch
      return () => {
        reader.cancel();
      };
    } catch (error) {
      console.error('Failed to send streaming chat message', error);
      if (callbacks.onError) {
        callbacks.onError(error as Error);
      }
      return () => {}; // Return a no-op function
    }
  }
};

export default chatService;
