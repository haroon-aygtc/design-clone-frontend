<?php

namespace Database\Seeders;

use App\Models\AIProviderConfig;
use Illuminate\Database\Seeder;

class AIProviderConfigSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // OpenAI Provider
        AIProviderConfig::create([
            'name' => 'openai',
            'display_name' => 'OpenAI',
            'description' => 'OpenAI API for GPT models',
            'api_url' => 'https://api.openai.com/v1',
            'api_key' => null,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'default_params' => [
                'model' => 'gpt-3.5-turbo',
                'temperature' => 0.7,
                'max_tokens' => 2000,
            ],
            'endpoints' => [
                'chat' => [
                    'path' => 'chat/completions',
                    'method' => 'POST',
                    'request_template' => [
                        'model' => '{{params.model}}',
                        'messages' => '{{messages}}',
                        'temperature' => '{{params.temperature}}',
                        'max_tokens' => '{{params.max_tokens}}',
                    ],
                    'response_mapping' => [
                        'message' => '{{choices.0.message.content}}',
                        'usage' => '{{usage}}',
                    ],
                ],
                'models' => [
                    'path' => 'models',
                    'method' => 'GET',
                    'models_path' => 'data',
                    'model_mapping' => [
                        'id' => 'id',
                        'name' => 'id',
                    ],
                ],
            ],
            'is_dynamic' => true,
            'is_active' => true,
        ]);

        // Anthropic Provider
        AIProviderConfig::create([
            'name' => 'anthropic',
            'display_name' => 'Anthropic',
            'description' => 'Anthropic API for Claude models',
            'api_url' => 'https://api.anthropic.com/v1',
            'api_key' => null,
            'headers' => [
                'Content-Type' => 'application/json',
                'anthropic-version' => '2023-06-01',
            ],
            'default_params' => [
                'model' => 'claude-3-opus-20240229',
                'temperature' => 0.7,
                'max_tokens' => 2000,
            ],
            'endpoints' => [
                'chat' => [
                    'path' => 'messages',
                    'method' => 'POST',
                    'request_template' => [
                        'model' => '{{params.model}}',
                        'messages' => '{{messages}}',
                        'temperature' => '{{params.temperature}}',
                        'max_tokens' => '{{params.max_tokens}}',
                    ],
                    'response_mapping' => [
                        'message' => '{{content.0.text}}',
                        'usage' => '{{usage}}',
                    ],
                ],
            ],
            'is_dynamic' => true,
            'is_active' => true,
        ]);

        // Mistral AI Provider
        AIProviderConfig::create([
            'name' => 'mistralai',
            'display_name' => 'Mistral AI',
            'description' => 'Mistral AI API for Mistral models',
            'api_url' => 'https://api.mistral.ai/v1',
            'api_key' => null,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'default_params' => [
                'model' => 'mistral-large-latest',
                'temperature' => 0.7,
                'max_tokens' => 2000,
            ],
            'endpoints' => [
                'chat' => [
                    'path' => 'chat/completions',
                    'method' => 'POST',
                    'request_template' => [
                        'model' => '{{params.model}}',
                        'messages' => '{{messages}}',
                        'temperature' => '{{params.temperature}}',
                        'max_tokens' => '{{params.max_tokens}}',
                    ],
                    'response_mapping' => [
                        'message' => '{{choices.0.message.content}}',
                        'usage' => '{{usage}}',
                    ],
                ],
                'models' => [
                    'path' => 'models',
                    'method' => 'GET',
                    'models_path' => 'data',
                    'model_mapping' => [
                        'id' => 'id',
                        'name' => 'id',
                    ],
                ],
            ],
            'is_dynamic' => true,
            'is_active' => true,
        ]);

        // Cohere Provider
        AIProviderConfig::create([
            'name' => 'cohere',
            'display_name' => 'Cohere',
            'description' => 'Cohere API for language models',
            'api_url' => 'https://api.cohere.ai/v1',
            'api_key' => null,
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'default_params' => [
                'model' => 'command',
                'temperature' => 0.7,
                'max_tokens' => 2000,
            ],
            'endpoints' => [
                'chat' => [
                    'path' => 'chat',
                    'method' => 'POST',
                    'request_template' => [
                        'model' => '{{params.model}}',
                        'message' => '{{prompt}}',
                        'chat_history' => '{{messages}}',
                        'temperature' => '{{params.temperature}}',
                        'max_tokens' => '{{params.max_tokens}}',
                    ],
                    'response_mapping' => [
                        'message' => '{{text}}',
                        'usage' => [
                            'prompt_tokens' => '{{meta.prompt_tokens}}',
                            'completion_tokens' => '{{meta.response_tokens}}',
                            'total_tokens' => '{{meta.total_tokens}}',
                        ],
                    ],
                ],
                'models' => [
                    'path' => 'models',
                    'method' => 'GET',
                ],
            ],
            'is_dynamic' => true,
            'is_active' => true,
        ]);
    }
}
