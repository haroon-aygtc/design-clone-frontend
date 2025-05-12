<?php

namespace App\Services\AI\Providers;

use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

/**
 * Mistral AI Provider Implementation
 */
class MistralAIProvider implements AIProviderInterface
{
    /**
     * API key for Mistral AI
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Base API URL
     *
     * @var string
     */
    protected $apiUrl = 'https://api.mistral.ai/v1';
    
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
    protected $defaultModel = 'mistral-large-latest';
    
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
            // Make a simple models list request to test the connection
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->get("{$this->apiUrl}/models");
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Connection to Mistral AI API successful',
                    'models' => $response->json('data')
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to connect to Mistral AI API: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (ConnectionException $e) {
            Log::error('Mistral AI connection error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        } catch (RequestException $e) {
            Log::error('Mistral AI request error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Request error: ' . $e->getMessage(),
                'status' => $e->getCode()
            ];
        } catch (\Exception $e) {
            Log::error('Mistral AI general error: ' . $e->getMessage());
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
            
            // Add system message if provided
            if (!empty($systemPrompt)) {
                $formattedMessages[] = [
                    'role' => 'system',
                    'content' => $systemPrompt
                ];
            }
            
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
            
            // Make the API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post("{$this->apiUrl}/chat/completions", [
                'model' => $model,
                'messages' => $formattedMessages,
                'temperature' => (float) $temperature,
                'max_tokens' => (int) $maxTokens,
                'top_p' => (float) $topP,
            ]);
            
            if ($response->successful()) {
                $result = $response->json();
                return [
                    'success' => true,
                    'message' => $result['choices'][0]['message']['content'] ?? '',
                    'usage' => $result['usage'] ?? [],
                    'model' => $result['model'] ?? $model,
                    'raw' => $result
                ];
            }
            
            Log::error('Mistral AI API error: ' . $response->body());
            return [
                'success' => false,
                'message' => 'API error: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error('Mistral AI completion error: ' . $e->getMessage());
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
            
            // Add system message if provided
            if (!empty($systemPrompt)) {
                $formattedMessages[] = [
                    'role' => 'system',
                    'content' => $systemPrompt
                ];
            }
            
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
            
            // Make the streaming API request
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->withOptions([
                'stream' => true,
            ])->post("{$this->apiUrl}/chat/completions", [
                'model' => $model,
                'messages' => $formattedMessages,
                'temperature' => (float) $temperature,
                'max_tokens' => (int) $maxTokens,
                'top_p' => (float) $topP,
                'stream' => true,
            ]);
            
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
                            if (json_last_error() === JSON_ERROR_NONE && isset($json['choices'][0]['delta']['content'])) {
                                $content = $json['choices'][0]['delta']['content'];
                                if ($callback) {
                                    $callback($content, $json);
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Mistral AI streaming error: ' . $e->getMessage());
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
                $models = $response->json('data');
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
            Log::error('Mistral AI models error: ' . $e->getMessage());
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
        return 'Mistral AI';
    }
}
