<?php

namespace App\Services\AI\Providers;

use App\Models\AIProviderConfig;
use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

/**
 * Dynamic AI Provider Implementation
 * 
 * This provider uses configuration from the database to dynamically
 * interact with any AI provider API without requiring custom code.
 */
class DynamicAIProvider implements AIProviderInterface
{
    /**
     * Provider configuration from database
     *
     * @var AIProviderConfig
     */
    protected $config;
    
    /**
     * API key for the provider
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Custom configuration options
     *
     * @var array
     */
    protected $customConfig = [];
    
    /**
     * Initialize the provider with API key and configuration
     *
     * @param string $apiKey
     * @param array $config
     * @return void
     */
    public function initialize(string $apiKey, array $config = []): void
    {
        $this->apiKey = $apiKey;
        $this->customConfig = $config;
        
        // If provider config is passed directly, use it
        if (isset($config['provider_config']) && $config['provider_config'] instanceof AIProviderConfig) {
            $this->config = $config['provider_config'];
            return;
        }
        
        // Otherwise, load from database using provider name
        $providerName = $config['provider'] ?? null;
        if ($providerName) {
            $this->config = AIProviderConfig::where('name', $providerName)
                ->where('is_active', true)
                ->first();
            
            if (!$this->config) {
                throw new \Exception("Provider configuration not found for: {$providerName}");
            }
        } else {
            throw new \Exception("Provider name not specified in configuration");
        }
    }
    
    /**
     * Test the connection to the provider API
     *
     * @return array
     */
    public function testConnection(): array
    {
        try {
            // Get the models endpoint if defined, otherwise use a simple GET to the base URL
            $endpoint = $this->getEndpointConfig('models');
            
            if ($endpoint) {
                $url = $this->buildUrl($endpoint['path'] ?? '');
                $method = $endpoint['method'] ?? 'GET';
                $response = $this->makeRequest($method, $url);
            } else {
                $response = $this->makeRequest('GET', $this->config->api_url);
            }
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => "Connection to {$this->config->display_name} API successful",
                    'data' => $response->json()
                ];
            }
            
            return [
                'success' => false,
                'message' => "Failed to connect to {$this->config->display_name} API: " . $response->body(),
                'status' => $response->status()
            ];
        } catch (ConnectionException $e) {
            Log::error("Dynamic provider connection error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        } catch (RequestException $e) {
            Log::error("Dynamic provider request error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Request error: ' . $e->getMessage(),
                'status' => $e->getCode()
            ];
        } catch (\Exception $e) {
            Log::error("Dynamic provider general error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Generate a completion/chat response
     *
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @return array
     */
    public function generateCompletion(string $prompt, array $messages = [], array $options = []): array
    {
        try {
            $endpoint = $this->getEndpointConfig('chat') ?? $this->getEndpointConfig('completions');
            
            if (!$endpoint) {
                throw new \Exception("No chat or completions endpoint defined for this provider");
            }
            
            $url = $this->buildUrl($endpoint['path']);
            $method = $endpoint['method'] ?? 'POST';
            
            // Merge default params with options
            $params = array_merge(
                $this->config->default_params ?? [],
                $options
            );
            
            // Prepare the request payload based on the endpoint template
            $payload = $this->preparePayload($endpoint, $prompt, $messages, $params);
            
            // Make the API request
            $response = $this->makeRequest($method, $url, $payload);
            
            if ($response->successful()) {
                // Parse the response based on the endpoint response mapping
                return $this->parseResponse($response->json(), $endpoint);
            }
            
            Log::error("Dynamic provider API error: " . $response->body());
            return [
                'success' => false,
                'message' => 'API error: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error("Dynamic provider completion error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error generating completion: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Generate a streaming completion/chat response
     *
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @param callable $callback Function to call with each chunk of the response
     * @return void
     */
    public function generateCompletionStream(string $prompt, array $messages = [], array $options = [], callable $callback = null): void
    {
        try {
            $endpoint = $this->getEndpointConfig('chat_stream') ?? $this->getEndpointConfig('completions_stream');
            
            if (!$endpoint) {
                throw new \Exception("No streaming endpoint defined for this provider");
            }
            
            $url = $this->buildUrl($endpoint['path']);
            $method = $endpoint['method'] ?? 'POST';
            
            // Merge default params with options and add streaming flag
            $params = array_merge(
                $this->config->default_params ?? [],
                $options,
                ['stream' => true]
            );
            
            // Prepare the request payload
            $payload = $this->preparePayload($endpoint, $prompt, $messages, $params);
            
            // Make the streaming API request
            $response = Http::withHeaders($this->getHeaders())
                ->withOptions([
                    'stream' => true,
                ])
                ->send($method, $url, ['json' => $payload]);
            
            // Process the streaming response
            $buffer = '';
            $response->throw()->toPsrResponse()->getBody()->rewind();
            $stream = $response->toPsrResponse()->getBody();
            
            while (!$stream->eof()) {
                $line = $stream->read(1024);
                $buffer .= $line;
                
                // Process any complete server-sent events
                if (strpos($buffer, "data: ") !== false) {
                    $parts = explode("data: ", $buffer);
                    $buffer = array_pop($parts); // Keep the last incomplete part
                    
                    foreach ($parts as $part) {
                        $data = trim($part);
                        if ($data === '[DONE]') {
                            continue;
                        }
                        
                        if (!empty($data)) {
                            $json = json_decode($data, true);
                            if (json_last_error() === JSON_ERROR_NONE) {
                                // Extract content based on endpoint response mapping
                                $content = $this->extractStreamContent($json, $endpoint);
                                if ($callback && !empty($content)) {
                                    $callback($content, $json);
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error("Dynamic provider streaming error: " . $e->getMessage());
            if ($callback) {
                $callback('', ['error' => $e->getMessage()]);
            }
        }
    }
    
    /**
     * Get available models from this provider
     *
     * @return array
     */
    public function getAvailableModels(): array
    {
        try {
            $endpoint = $this->getEndpointConfig('models');
            
            if (!$endpoint) {
                // If no models endpoint is defined, return a default model based on config
                return [
                    'success' => true,
                    'models' => [
                        [
                            'id' => $this->config->default_params['model'] ?? 'default',
                            'name' => $this->config->default_params['model'] ?? 'Default Model'
                        ]
                    ]
                ];
            }
            
            $url = $this->buildUrl($endpoint['path']);
            $method = $endpoint['method'] ?? 'GET';
            
            $response = $this->makeRequest($method, $url);
            
            if ($response->successful()) {
                // Parse models based on the endpoint response mapping
                $models = $this->extractModels($response->json(), $endpoint);
                return [
                    'success' => true,
                    'models' => $models
                ];
            }
            
            return [
                'success' => false,
                'message' => "Failed to retrieve models: " . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error("Dynamic provider models error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error retrieving models: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string
    {
        return $this->config->display_name ?? 'Dynamic Provider';
    }
    
    /**
     * Get endpoint configuration by name
     *
     * @param string $name
     * @return array|null
     */
    protected function getEndpointConfig(string $name): ?array
    {
        if (!$this->config || !isset($this->config->endpoints[$name])) {
            return null;
        }
        
        return $this->config->endpoints[$name];
    }
    
    /**
     * Build the full URL for an endpoint
     *
     * @param string $path
     * @return string
     */
    protected function buildUrl(string $path): string
    {
        $baseUrl = rtrim($this->config->api_url, '/');
        $path = ltrim($path, '/');
        
        return "{$baseUrl}/{$path}";
    }
    
    /**
     * Get headers for API requests
     *
     * @return array
     */
    protected function getHeaders(): array
    {
        $headers = $this->config->headers ?? [];
        
        // Add API key to headers if not already present
        if (!empty($this->apiKey)) {
            // Check if there's an Authorization header already
            $hasAuth = false;
            foreach ($headers as $key => $value) {
                if (strtolower($key) === 'authorization') {
                    $hasAuth = true;
                    break;
                }
            }
            
            if (!$hasAuth) {
                $headers['Authorization'] = "Bearer {$this->apiKey}";
            }
        }
        
        // Add content type if not present
        if (!isset($headers['Content-Type'])) {
            $headers['Content-Type'] = 'application/json';
        }
        
        return $headers;
    }
    
    /**
     * Make an API request
     *
     * @param string $method
     * @param string $url
     * @param array $payload
     * @return \Illuminate\Http\Client\Response
     */
    protected function makeRequest(string $method, string $url, array $payload = null)
    {
        $request = Http::withHeaders($this->getHeaders());
        
        if ($payload !== null) {
            return $request->send($method, $url, ['json' => $payload]);
        }
        
        return $request->send($method, $url);
    }
    
    /**
     * Prepare the request payload based on the endpoint template
     *
     * @param array $endpoint
     * @param string $prompt
     * @param array $messages
     * @param array $params
     * @return array
     */
    protected function preparePayload(array $endpoint, string $prompt, array $messages, array $params): array
    {
        // If there's a template defined, use it
        if (isset($endpoint['request_template'])) {
            return $this->applyTemplate($endpoint['request_template'], compact('prompt', 'messages', 'params'));
        }
        
        // Otherwise, build a generic payload
        $payload = $params;
        
        // Add messages if present
        if (!empty($messages)) {
            $payload['messages'] = $messages;
            
            // Add the current prompt as a user message if not empty
            if (!empty($prompt)) {
                $payload['messages'][] = [
                    'role' => 'user',
                    'content' => $prompt
                ];
            }
        } else if (!empty($prompt)) {
            // If no messages but we have a prompt, add it directly
            // Some APIs use 'prompt', others use 'input', try to be flexible
            if (isset($endpoint['prompt_field'])) {
                $payload[$endpoint['prompt_field']] = $prompt;
            } else {
                $payload['prompt'] = $prompt;
            }
        }
        
        return $payload;
    }
    
    /**
     * Apply a template to create a request payload
     *
     * @param array $template
     * @param array $data
     * @return array
     */
    protected function applyTemplate(array $template, array $data): array
    {
        $result = [];
        
        foreach ($template as $key => $value) {
            if (is_array($value)) {
                $result[$key] = $this->applyTemplate($value, $data);
            } else if (is_string($value) && strpos($value, '{{') !== false) {
                // Replace placeholders in the format {{variable}}
                $result[$key] = preg_replace_callback('/\{\{([^}]+)\}\}/', function($matches) use ($data) {
                    $path = explode('.', $matches[1]);
                    $current = $data;
                    
                    foreach ($path as $segment) {
                        if (isset($current[$segment])) {
                            $current = $current[$segment];
                        } else {
                            return '';
                        }
                    }
                    
                    return is_scalar($current) ? $current : json_encode($current);
                }, $value);
            } else {
                $result[$key] = $value;
            }
        }
        
        return $result;
    }
    
    /**
     * Parse the API response based on the endpoint mapping
     *
     * @param array $response
     * @param array $endpoint
     * @return array
     */
    protected function parseResponse(array $response, array $endpoint): array
    {
        // If there's a response mapping defined, use it
        if (isset($endpoint['response_mapping'])) {
            return $this->applyResponseMapping($response, $endpoint['response_mapping']);
        }
        
        // Otherwise, try to extract common fields
        $result = [
            'success' => true,
        ];
        
        // Try to find the content in common response formats
        if (isset($response['choices'][0]['message']['content'])) {
            $result['message'] = $response['choices'][0]['message']['content'];
        } else if (isset($response['choices'][0]['text'])) {
            $result['message'] = $response['choices'][0]['text'];
        } else if (isset($response['output'])) {
            $result['message'] = $response['output'];
        } else if (isset($response['generated_text'])) {
            $result['message'] = $response['generated_text'];
        } else if (isset($response['text'])) {
            $result['message'] = $response['text'];
        } else {
            $result['message'] = json_encode($response);
        }
        
        // Try to extract usage information
        if (isset($response['usage'])) {
            $result['usage'] = $response['usage'];
        }
        
        // Add model information if available
        if (isset($response['model'])) {
            $result['model'] = $response['model'];
        } else if (isset($this->customConfig['model'])) {
            $result['model'] = $this->customConfig['model'];
        }
        
        // Add the raw response for debugging
        $result['raw'] = $response;
        
        return $result;
    }
    
    /**
     * Apply response mapping to extract data from the API response
     *
     * @param array $response
     * @param array $mapping
     * @return array
     */
    protected function applyResponseMapping(array $response, array $mapping): array
    {
        $result = [];
        
        foreach ($mapping as $key => $path) {
            if (is_array($path)) {
                $result[$key] = $this->applyResponseMapping($response, $path);
            } else if (is_string($path) && strpos($path, '{{') !== false) {
                // Extract data using the path in the format {{path.to.data}}
                $result[$key] = preg_replace_callback('/\{\{([^}]+)\}\}/', function($matches) use ($response) {
                    $path = explode('.', $matches[1]);
                    $current = $response;
                    
                    foreach ($path as $segment) {
                        if (isset($current[$segment])) {
                            $current = $current[$segment];
                        } else {
                            return '';
                        }
                    }
                    
                    return is_scalar($current) ? $current : json_encode($current);
                }, $path);
            } else {
                $result[$key] = $path;
            }
        }
        
        return $result;
    }
    
    /**
     * Extract content from a streaming response
     *
     * @param array $json
     * @param array $endpoint
     * @return string
     */
    protected function extractStreamContent(array $json, array $endpoint): string
    {
        // If there's a stream content path defined, use it
        if (isset($endpoint['stream_content_path'])) {
            $path = explode('.', $endpoint['stream_content_path']);
            $current = $json;
            
            foreach ($path as $segment) {
                if (isset($current[$segment])) {
                    $current = $current[$segment];
                } else {
                    return '';
                }
            }
            
            return is_scalar($current) ? $current : '';
        }
        
        // Otherwise, try common formats
        if (isset($json['choices'][0]['delta']['content'])) {
            return $json['choices'][0]['delta']['content'];
        } else if (isset($json['choices'][0]['text'])) {
            return $json['choices'][0]['text'];
        } else if (isset($json['output'])) {
            return $json['output'];
        } else if (isset($json['text'])) {
            return $json['text'];
        }
        
        return '';
    }
    
    /**
     * Extract models from the API response
     *
     * @param array $response
     * @param array $endpoint
     * @return array
     */
    protected function extractModels(array $response, array $endpoint): array
    {
        // If there's a models path defined, use it
        if (isset($endpoint['models_path'])) {
            $path = explode('.', $endpoint['models_path']);
            $current = $response;
            
            foreach ($path as $segment) {
                if (isset($current[$segment])) {
                    $current = $current[$segment];
                } else {
                    return [];
                }
            }
            
            if (!is_array($current)) {
                return [];
            }
            
            // If there's a model mapping defined, use it
            if (isset($endpoint['model_mapping'])) {
                $idField = $endpoint['model_mapping']['id'] ?? 'id';
                $nameField = $endpoint['model_mapping']['name'] ?? 'name';
                
                $models = [];
                foreach ($current as $model) {
                    if (is_array($model) && isset($model[$idField])) {
                        $models[] = [
                            'id' => $model[$idField],
                            'name' => $model[$nameField] ?? $model[$idField]
                        ];
                    } else if (is_string($model)) {
                        $models[] = [
                            'id' => $model,
                            'name' => $model
                        ];
                    }
                }
                
                return $models;
            }
            
            return $current;
        }
        
        // Otherwise, try common formats
        if (isset($response['data']) && is_array($response['data'])) {
            $models = [];
            foreach ($response['data'] as $model) {
                if (is_array($model) && isset($model['id'])) {
                    $models[] = [
                        'id' => $model['id'],
                        'name' => $model['name'] ?? $model['id']
                    ];
                } else if (is_string($model)) {
                    $models[] = [
                        'id' => $model,
                        'name' => $model
                    ];
                }
            }
            return $models;
        } else if (isset($response['models']) && is_array($response['models'])) {
            $models = [];
            foreach ($response['models'] as $model) {
                if (is_array($model) && isset($model['id'])) {
                    $models[] = [
                        'id' => $model['id'],
                        'name' => $model['name'] ?? $model['id']
                    ];
                } else if (is_string($model)) {
                    $models[] = [
                        'id' => $model,
                        'name' => $model
                    ];
                }
            }
            return $models;
        }
        
        // If we can't find a list of models, return an empty array
        return [];
    }
}
