<?php

namespace App\Services\AI\Providers;

use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

/**
 * Cohere API Provider Implementation
 */
class CohereProvider implements AIProviderInterface
{
    /**
     * API key for Cohere
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Base API URL
     *
     * @var string
     */
    protected $apiUrl = 'https://api.cohere.ai/v1';
    
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
    protected $defaultModel = 'command';
    
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
    }
    
    /**
     * Test the connection to the provider API
     *
     * @return array
     */
    public function testConnection(): array
    {
        try {
            // Make a simple request to test the connection
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->get("{$this->apiUrl}/models");
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Connection to Cohere API successful',
                    'models' => $response->json()
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to connect to Cohere API: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (ConnectionException $e) {
            Log::error('Cohere connection error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        } catch (RequestException $e) {
            Log::error('Cohere request error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Request error: ' . $e->getMessage(),
                'status' => $e->getCode()
            ];
        } catch (\Exception $e) {
            Log::error('Cohere general error: ' . $e->getMessage());
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
            $systemPrompt = $options['systemPrompt'] ?? '';
            
            // Format chat history for Cohere
            $chatHistory = [];
            foreach ($messages as $message) {
                $role = $message['role'] === 'assistant' ? 'CHATBOT' : 'USER';
                $chatHistory[] = [
                    'role' => $role,
                    'message' => $message['content']
                ];
            }
            
            // Prepare the request payload
            $payload = [
                'model' => $model,
                'message' => $prompt,
                'temperature' => (float) $temperature,
                'max_tokens' => (int) $maxTokens,
            ];
            
            // Add chat history if available
            if (!empty($chatHistory)) {
                $payload['chat_history'] = $chatHistory;
            }
            
            // Add system prompt (preamble) if provided
            if (!empty($systemPrompt)) {
                $payload['preamble'] = $systemPrompt;
            }
            
            // Make the API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/chat", $payload);
            
            if ($response->successful()) {
                $result = $response->json();
                return [
                    'success' => true,
                    'message' => $result['text'] ?? '',
                    'usage' => [
                        'prompt_tokens' => $result['meta']['prompt_tokens'] ?? 0,
                        'completion_tokens' => $result['meta']['response_tokens'] ?? 0,
                        'total_tokens' => ($result['meta']['prompt_tokens'] ?? 0) + ($result['meta']['response_tokens'] ?? 0)
                    ],
                    'model' => $model,
                    'raw' => $result
                ];
            }
            
            Log::error('Cohere API error: ' . $response->body());
            return [
                'success' => false,
                'message' => 'API error: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error('Cohere completion error: ' . $e->getMessage());
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
            $systemPrompt = $options['systemPrompt'] ?? '';
            
            // Format chat history for Cohere
            $chatHistory = [];
            foreach ($messages as $message) {
                $role = $message['role'] === 'assistant' ? 'CHATBOT' : 'USER';
                $chatHistory[] = [
                    'role' => $role,
                    'message' => $message['content']
                ];
            }
            
            // Prepare the request payload
            $payload = [
                'model' => $model,
                'message' => $prompt,
                'temperature' => (float) $temperature,
                'max_tokens' => (int) $maxTokens,
                'stream' => true
            ];
            
            // Add chat history if available
            if (!empty($chatHistory)) {
                $payload['chat_history'] = $chatHistory;
            }
            
            // Add system prompt (preamble) if provided
            if (!empty($systemPrompt)) {
                $payload['preamble'] = $systemPrompt;
            }
            
            // Make the streaming API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->withOptions([
                'stream' => true,
            ])->post("{$this->apiUrl}/chat", $payload);
            
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
                            if (json_last_error() === JSON_ERROR_NONE && isset($json['text'])) {
                                $content = $json['text'];
                                if ($callback) {
                                    $callback($content, $json);
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Cohere streaming error: ' . $e->getMessage());
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
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->get("{$this->apiUrl}/models");
            
            if ($response->successful()) {
                // Format the response to match our expected format
                $models = [];
                foreach ($response->json() as $model) {
                    $models[] = [
                        'id' => $model,
                        'name' => $model
                    ];
                }
                
                return [
                    'success' => true,
                    'models' => $models
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to retrieve models: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error('Cohere models error: ' . $e->getMessage());
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
        return 'Cohere';
    }
}
