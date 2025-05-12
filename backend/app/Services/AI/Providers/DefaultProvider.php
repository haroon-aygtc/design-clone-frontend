<?php

namespace App\Services\AI\Providers;

use App\Services\AI\AIProviderInterface;
use Illuminate\Support\Facades\Log;

/**
 * Default Provider Implementation (Fallback)
 */
class DefaultProvider implements AIProviderInterface
{
    /**
     * API key
     *
     * @var string
     */
    protected $apiKey;
    
    /**
     * Configuration options
     *
     * @var array
     */
    protected $config = [];
    
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
        Log::warning('Using DefaultProvider which does not connect to any real AI service.');
    }
    
    /**
     * Test the connection to the provider API
     *
     * @return array
     */
    public function testConnection(): array
    {
        return [
            'success' => false,
            'message' => 'This is a default provider and does not connect to any real AI service.'
        ];
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
        $response = "This is a default response from the system. The actual AI provider integration is not configured properly. Please contact support.";
        
        return [
            'success' => true,
            'message' => $response,
            'usage' => [
                'prompt_tokens' => 0,
                'completion_tokens' => 0,
                'total_tokens' => 0
            ],
            'model' => 'default',
            'raw' => []
        ];
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
        $response = "This is a default response from the system. The actual AI provider integration is not configured properly. Please contact support.";
        
        if ($callback) {
            $callback($response, []);
        }
    }
    
    /**
     * Get available models from this provider
     *
     * @return array
     */
    public function getAvailableModels(): array
    {
        return [
            'success' => true,
            'models' => [
                ['id' => 'default', 'name' => 'Default Model']
            ]
        ];
    }
    
    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string
    {
        return 'Default';
    }
}
