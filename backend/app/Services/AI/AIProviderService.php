<?php

namespace App\Services\AI;

use App\Models\AIModel;
use App\Services\AI\AIProviderFactory;
use Illuminate\Support\Facades\Log;

/**
 * Service to manage AI providers
 */
class AIProviderService
{
    /**
     * Get an initialized provider for a specific AI model
     *
     * @param AIModel $model
     * @return AIProviderInterface
     */
    public function getProviderForModel(AIModel $model): AIProviderInterface
    {
        $provider = $model->provider;
        $apiKey = $model->getDecryptedApiKeyAttribute();
        $config = $model->configuration ?? [];
        
        return AIProviderFactory::create($provider, $apiKey, $config);
    }
    
    /**
     * Test connection to a provider
     *
     * @param AIModel $model
     * @return array
     */
    public function testConnection(AIModel $model): array
    {
        try {
            $provider = $this->getProviderForModel($model);
            return $provider->testConnection();
        } catch (\Exception $e) {
            Log::error('Error testing provider connection: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Generate a completion from a provider
     *
     * @param AIModel $model
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @return array
     */
    public function generateCompletion(AIModel $model, string $prompt, array $messages = [], array $options = []): array
    {
        try {
            $provider = $this->getProviderForModel($model);
            
            // Merge model configuration with provided options
            $mergedOptions = array_merge($model->configuration ?? [], $options);
            
            return $provider->generateCompletion($prompt, $messages, $mergedOptions);
        } catch (\Exception $e) {
            Log::error('Error generating completion: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Generate a streaming completion from a provider
     *
     * @param AIModel $model
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @param callable $callback
     * @return void
     */
    public function generateCompletionStream(AIModel $model, string $prompt, array $messages = [], array $options = [], callable $callback = null): void
    {
        try {
            $provider = $this->getProviderForModel($model);
            
            // Merge model configuration with provided options
            $mergedOptions = array_merge($model->configuration ?? [], $options);
            
            $provider->generateCompletionStream($prompt, $messages, $mergedOptions, $callback);
        } catch (\Exception $e) {
            Log::error('Error generating streaming completion: ' . $e->getMessage());
            if ($callback) {
                $callback('', ['error' => $e->getMessage()]);
            }
        }
    }
    
    /**
     * Get available models from a provider
     *
     * @param AIModel $model
     * @return array
     */
    public function getAvailableModels(AIModel $model): array
    {
        try {
            $provider = $this->getProviderForModel($model);
            return $provider->getAvailableModels();
        } catch (\Exception $e) {
            Log::error('Error getting available models: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }
}
