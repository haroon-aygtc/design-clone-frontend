<?php

namespace App\Services\AI;

use App\Services\AI\Providers\OpenAIProvider;
use App\Services\AI\Providers\AnthropicProvider;
use App\Services\AI\Providers\GoogleAIProvider;
use App\Services\AI\Providers\MistralAIProvider;
use App\Services\AI\Providers\CohereProvider;
use App\Services\AI\Providers\DefaultProvider;
use Illuminate\Support\Facades\Log;

/**
 * Factory for creating AI Provider instances
 */
class AIProviderFactory
{
    /**
     * Create an AI provider instance based on provider name
     *
     * @param string $provider
     * @param string $apiKey
     * @param array $config
     * @return AIProviderInterface
     */
    public static function create(string $provider, string $apiKey = '', array $config = []): AIProviderInterface
    {
        $instance = self::createProviderInstance($provider);
        
        if (!empty($apiKey)) {
            $instance->initialize($apiKey, $config);
        }
        
        return $instance;
    }
    
    /**
     * Create the appropriate provider instance
     *
     * @param string $provider
     * @return AIProviderInterface
     */
    private static function createProviderInstance(string $provider): AIProviderInterface
    {
        switch (strtolower($provider)) {
            case 'openai':
                return new OpenAIProvider();
            case 'anthropic':
                return new AnthropicProvider();
            case 'google':
                return new GoogleAIProvider();
            case 'mistral ai':
                return new MistralAIProvider();
            case 'cohere':
                return new CohereProvider();
            default:
                Log::warning("Unknown AI provider: {$provider}. Using default provider.");
                return new DefaultProvider();
        }
    }
}
