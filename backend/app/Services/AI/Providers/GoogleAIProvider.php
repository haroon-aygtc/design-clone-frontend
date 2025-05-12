<?php

namespace App\Services\AI\Providers;

use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\Client\ConnectionException;

/**
 * Google AI (Gemini) API Provider Implementation
 */
class GoogleAIProvider implements AIProviderInterface
{
    /**
     * API key for Google AI
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Base API URL
     *
     * @var string
     */
    protected $apiUrl = 'https://generativelanguage.googleapis.com/v1beta';
    
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
    protected $defaultModel = 'gemini-pro';
    
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
            $response = Http::get("{$this->apiUrl}/models?key={$this->apiKey}");
            
            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Connection to Google AI API successful',
                    'models' => $response->json('models')
                ];
            }
            
            return [
                'success' => false,
                'message' => 'Failed to connect to Google AI API: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (ConnectionException $e) {
            Log::error('Google AI connection error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage()
            ];
        } catch (RequestException $e) {
            Log::error('Google AI request error: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Request error: ' . $e->getMessage(),
                'status' => $e->getCode()
            ];
        } catch (\Exception $e) {
            Log::error('Google AI general error: ' . $e->getMessage());
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
            
            // Prepare content for the request
            $contents = [];
            
            // Add system prompt if provided
            if (!empty($systemPrompt)) {
                $contents[] = [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemPrompt]
                    ]
                ];
                
                $contents[] = [
                    'role' => 'model',
                    'parts' => [
                        ['text' => 'I understand and will follow these instructions.']
                    ]
                ];
            }
            
            // Add any pre-existing messages
            foreach ($messages as $message) {
                $role = $message['role'] === 'assistant' ? 'model' : $message['role'];
                $contents[] = [
                    'role' => $role,
                    'parts' => [
                        ['text' => $message['content']]
                    ]
                ];
            }
            
            // Add the current prompt as a user message
            if (!empty($prompt)) {
                $contents[] = [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ];
            }
            
            // Make the API request
            $response = Http::post("{$this->apiUrl}/models/{$model}:generateContent?key={$this->apiKey}", [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => (float) $temperature,
                    'maxOutputTokens' => (int) $maxTokens,
                    'topP' => (float) $topP,
                ]
            ]);
            
            if ($response->successful()) {
                $result = $response->json();
                
                // Extract the response text
                $responseText = '';
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $responseText = $result['candidates'][0]['content']['parts'][0]['text'];
                }
                
                return [
                    'success' => true,
                    'message' => $responseText,
                    'usage' => [
                        'prompt_tokens' => $result['usageMetadata']['promptTokenCount'] ?? 0,
                        'completion_tokens' => $result['usageMetadata']['candidatesTokenCount'] ?? 0,
                        'total_tokens' => ($result['usageMetadata']['promptTokenCount'] ?? 0) + ($result['usageMetadata']['candidatesTokenCount'] ?? 0)
                    ],
                    'model' => $model,
                    'raw' => $result
                ];
            }
            
            Log::error('Google AI API error: ' . $response->body());
            return [
                'success' => false,
                'message' => 'API error: ' . $response->body(),
                'status' => $response->status()
            ];
        } catch (\Exception $e) {
            Log::error('Google AI completion error: ' . $e->getMessage());
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
            
            // Prepare content for the request
            $contents = [];
            
            // Add system prompt if provided
            if (!empty($systemPrompt)) {
                $contents[] = [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemPrompt]
                    ]
                ];
                
                $contents[] = [
                    'role' => 'model',
                    'parts' => [
                        ['text' => 'I understand and will follow these instructions.']
                    ]
                ];
            }
            
            // Add any pre-existing messages
            foreach ($messages as $message) {
                $role = $message['role'] === 'assistant' ? 'model' : $message['role'];
                $contents[] = [
                    'role' => $role,
                    'parts' => [
                        ['text' => $message['content']]
                    ]
                ];
            }
            
            // Add the current prompt as a user message
            if (!empty($prompt)) {
                $contents[] = [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ];
            }
            
            // Make the streaming API request
            $response = Http::withOptions([
                'stream' => true,
            ])->post("{$this->apiUrl}/models/{$model}:streamGenerateContent?key={$this->apiKey}", [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => (float) $temperature,
                    'maxOutputTokens' => (int) $maxTokens,
                    'topP' => (float) $topP,
                ]
            ]);
            
            // Process the streaming response
            $buffer = '';
            $response->throw()->toPsrResponse()->getBody()->rewind();
            $stream = $response->toPsrResponse()->getBody();
            
            while (!$stream->eof()) {
                $line = $stream->read(1024);
                $buffer .= $line;
                
                // Process any complete JSON objects
                if (strpos($buffer, "\n") !== false) {
                    $parts = explode("\n", $buffer);
                    $buffer = array_pop($parts); // Keep the last incomplete part
                    
                    foreach ($parts as $part) {
                        $data = trim($part);
                        if (empty($data)) {
                            continue;
                        }
                        
                        $json = json_decode($data, true);
                        if (json_last_error() === JSON_ERROR_NONE && isset($json['candidates'][0]['content']['parts'][0]['text'])) {
                            $content = $json['candidates'][0]['content']['parts'][0]['text'];
                            if ($callback) {
                                $callback($content, $json);
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Google AI streaming error: ' . $e->getMessage());
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
            $response = Http::get("{$this->apiUrl}/models?key={$this->apiKey}");
            
            if ($response->successful()) {
                $models = $response->json('models');
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
            Log::error('Google AI models error: ' . $e->getMessage());
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
        return 'Google AI';
    }
}
