<?php

namespace App\Services\AI;

use App\Models\AIProviderConfig;
use App\Services\AI\Providers\AnthropicProvider;
use App\Services\AI\Providers\CohereProvider;
use App\Services\AI\Providers\DefaultProvider;
use App\Services\AI\Providers\DynamicAIProvider;
use App\Services\AI\Providers\GoogleAIProvider;
use App\Services\AI\Providers\MistralAIProvider;
use App\Services\AI\Providers\OpenAIProvider;

/**
 * Factory for creating AI provider instances
 */
class AIProviderFactory
{
    /**
     * Create a provider instance based on the provider name
     *
     * @param string $provider
     * @return AIProviderInterface
     */
    public function createProvider(string $provider): AIProviderInterface
    {
        // First, check if there's a dynamic provider configuration
        $providerConfig = AIProviderConfig::where('name', strtolower($provider))
            ->where('is_active', true)
            ->where('is_dynamic', true)
            ->first();
        
        if ($providerConfig) {
            $dynamicProvider = new DynamicAIProvider();
            $dynamicProvider->initialize('', [
                'provider' => $provider,
                'provider_config' => $providerConfig
            ]);
            return $dynamicProvider;
        }
        
        // If no dynamic provider found, fall back to hardcoded providers
        switch (strtolower($provider)) {
            case 'openai':
                return new OpenAIProvider();
            case 'anthropic':
                return new AnthropicProvider();
            case 'google':
                return new GoogleAIProvider();
            case 'mistralai':
                return new MistralAIProvider();
            case 'cohere':
                return new CohereProvider();
            default:
                return new DefaultProvider();
        }
    }
}
