<?php

namespace App\Services\AI\Providers;

use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

/**
 * Anthropic API Provider Implementation
 */
class AnthropicProvider implements AIProviderInterface
{
    /**
     * API key for Anthropic
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Base API URL
     *
     * @var string
     */
    protected $apiUrl = 'https://api.anthropic.com/v1';
    
    /**
     * Configuration options
     *
     * @var array
     */
    protected $config = [];
    
    /**
     * Default model to use
     *
     * @var string
     */
    protected $defaultModel = 'claude-3-opus-20240229';
    
    /**
     * API version
     *
     * @var string
     */
    protected $apiVersion = '2023-06-01';
    
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
        $this->config = $config;
        
        // Set custom API URL if provided
        if (!empty($config['apiEndpoint'])) {
            $this->apiUrl = rtrim($config['apiEndpoint'], '/');
        }
        
        // Set default model if provided
        if (!empty($config['model'])) {
            $this->defaultModel = $config['model'];
        }
        
        // Set API version if provided
        if (!empty($config['apiVersion'])) {
            $this->apiVersion = $config['apiVersion'];
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
            // Make a simple completion request to test the connection
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => $this->apiVersion,
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/messages", [
                'model' => $this->defaultModel,
                'max_tokens' => 10,
                'messages' => [
                    [
                        'role' => 'user',
                        'content' => 'Hello, this is a connection test.'
                    ]
                ]
            ]);
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Connection to Anthropic API successful',
                    'model' => $this->defaultModel
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to connect to Anthropic API: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (ConnectionException $e) {
            Log::error('Anthropic connection error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        } catch (RequestException $e) {
            Log::error('Anthropic request error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Request error: ' . $e->getMessage(),
                'status' => $e->getCode()
            ];
        } catch (\Exception $e) {
            Log::error('Anthropic general error: ' . $e->getMessage());
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
            $model = $options['model'] ?? $this->defaultModel;
            $temperature = $options['temperature'] ?? 0.7;
            $maxTokens = $options['maxTokens'] ?? 2000;
            $topP = $options['topP'] ?? 1;
            $systemPrompt = $options['systemPrompt'] ?? '';
            
            // Prepare messages for chat completion
            $formattedMessages = [];
            
            // Add any pre-existing messages
            foreach ($messages as $message) {
                $formattedMessages[] = $message;
            }
            
            // Add the current prompt as a user message
            if (!empty($prompt)) {
                $formattedMessages[] = [
                    'role' => 'user',
                    'content' => $prompt
                ];
            }
            
            // If no messages provided, use the prompt directly
            if (empty($formattedMessages) && !empty($prompt)) {
                $formattedMessages[] = [
                    'role' => 'user',
                    'content' => $prompt
                ];
            }
            
            // Prepare the request payload
            $payload = [
                'model' => $model,
                'messages' => $formattedMessages,
                'max_tokens' => (int) $maxTokens,
                'temperature' => (float) $temperature,
                'top_p' => (float) $topP,
            ];
            
            // Add system prompt if provided
            if (!empty($systemPrompt)) {
                $payload['system'] = $systemPrompt;
            }
            
            // Make the API request
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => $this->apiVersion,
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/messages", $payload);
            
            if ($response->successful()) {
                $result = $response->json();
                return [
                    'success' => true,
                    'message' => $result['content'][0]['text'] ?? '',
                    'usage' => [
                        'prompt_tokens' => $result['usage']['input_tokens'] ?? 0,
                        'completion_tokens' => $result['usage']['output_tokens'] ?? 0,
                        'total_tokens' => ($result['usage']['input_tokens'] ?? 0) + ($result['usage']['output_tokens'] ?? 0)
                    ],
                    'model' => $result['model'] ?? $model,
                    'raw' => $result
                ];
            }
            
            Log::error('Anthropic API error: ' . $response->body());
            return [
                'success' => false,
                'message' => 'API error: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error('Anthropic completion error: ' . $e->getMessage());
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
            $model = $options['model'] ?? $this->defaultModel;
            $temperature = $options['temperature'] ?? 0.7;
            $maxTokens = $options['maxTokens'] ?? 2000;
            $topP = $options['topP'] ?? 1;
            $systemPrompt = $options['systemPrompt'] ?? '';
            
            // Prepare messages for chat completion
            $formattedMessages = [];
            
            // Add any pre-existing messages
            foreach ($messages as $message) {
                $formattedMessages[] = $message;
            }
            
            // Add the current prompt as a user message
            if (!empty($prompt)) {
                $formattedMessages[] = [
                    'role' => 'user',
                    'content' => $prompt
                ];
            }
            
            // If no messages provided, use the prompt directly
            if (empty($formattedMessages) && !empty($prompt)) {
                $formattedMessages[] = [
                    'role' => 'user',
                    'content' => $prompt
                ];
            }
            
            // Prepare the request payload
            $payload = [
                'model' => $model,
                'messages' => $formattedMessages,
                'max_tokens' => (int) $maxTokens,
                'temperature' => (float) $temperature,
                'top_p' => (float) $topP,
                'stream' => true
            ];
            
            // Add system prompt if provided
            if (!empty($systemPrompt)) {
                $payload['system'] = $systemPrompt;
            }
            
            // Make the streaming API request
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => $this->apiVersion,
                'Content-Type' => 'application/json',
            ])->withOptions([
                'stream' => true,
            ])->post("{$this->apiUrl}/messages", $payload);
            
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
                            if (json_last_error() === JSON_ERROR_NONE && isset($json['type']) && $json['type'] === 'content_block_delta') {
                                $content = $json['delta']['text'] ?? '';
                                if ($callback) {
                                    $callback($content, $json);
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Anthropic streaming error: ' . $e->getMessage());
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
        // Anthropic doesn't have a models endpoint, so we return a static list
        $models = [
            ['id' => 'claude-3-opus-20240229', 'name' => 'Claude 3 Opus'],
            ['id' => 'claude-3-sonnet-20240229', 'name' => 'Claude 3 Sonnet'],
            ['id' => 'claude-3-haiku-20240307', 'name' => 'Claude 3 Haiku'],
            ['id' => 'claude-2.1', 'name' => 'Claude 2.1'],
            ['id' => 'claude-2.0', 'name' => 'Claude 2.0'],
            ['id' => 'claude-instant-1.2', 'name' => 'Claude Instant 1.2']
        ];
        
        return [
            'success' => true,
            'models' => $models
        ];
    }
    
    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string
    {
        return 'Anthropic';
    }
}
