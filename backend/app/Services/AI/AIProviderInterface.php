<?php

namespace App\Services\AI;

/**
 * Interface for AI Provider clients
 */
interface AIProviderInterface
{
    /**
     * Initialize the provider with API key and configuration
     *
     * @param string $apiKey
     * @param array $config
     * @return void
     */
    public function initialize(string $apiKey, array $config = []): void;

    /**
     * Test the connection to the provider API
     *
     * @return array
     */
    public function testConnection(): array;

    /**
     * Generate a completion/chat response
     *
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @return array
     */
    public function generateCompletion(string $prompt, array $messages = [], array $options = []): array;

    /**
     * Generate a streaming completion/chat response
     *
     * @param string $prompt
     * @param array $messages
     * @param array $options
     * @param callable $callback Function to call with each chunk of the response
     * @return void
     */
    public function generateCompletionStream(string $prompt, array $messages = [], array $options = [], callable $callback = null): void;

    /**
     * Get available models from this provider
     *
     * @return array
     */
    public function getAvailableModels(): array;

    /**
     * Get provider name
     *
     * @return string
     */
    public function getProviderName(): string;
}
