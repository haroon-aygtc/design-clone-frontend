<?php

namespace App\Services;

use App\Services\AIModelService;
use App\Services\AI\AIProviderService;
use App\Repositories\WidgetSettingRepository;
use Illuminate\Support\Facades\Log;

class WidgetChatService
{
    protected $aiModelService;
    protected $widgetSettingRepository;
    protected $providerService;

    public function __construct(
        AIModelService $aiModelService,
        WidgetSettingRepository $widgetSettingRepository,
        AIProviderService $providerService
    ) {
        $this->aiModelService = $aiModelService;
        $this->widgetSettingRepository = $widgetSettingRepository;
        $this->providerService = $providerService;
    }

    /**
     * Process a chat message using the configured AI model
     *
     * @param int $widgetId
     * @param string $message
     * @param array $context
     * @return array
     */
    public function processMessage(int $widgetId, string $message, array $context = []): array
    {
        try {
            // Get the widget settings
            $widgetSetting = $this->widgetSettingRepository->findById($widgetId);

            // Get the AI model
            $aiModelId = $widgetSetting->ai_model_id;
            $aiModel = $this->aiModelService->getModelById($aiModelId);

            // Verify the model is active
            if (!$aiModel->is_active) {
                return [
                    'success' => false,
                    'message' => 'The AI model is not currently available.'
                ];
            }

            // Record usage of the model
            $this->aiModelService->incrementUsageCount($aiModelId);

            // Prepare message context with widget settings for personalization
            $enhancedContext = array_merge($context, [
                'widget_name' => $widgetSetting->name,
                'initial_message' => $widgetSetting->initial_message,
            ]);

            // Prepare system prompt with widget context
            $systemPrompt = "You are an AI assistant for {$widgetSetting->name}. ";
            $systemPrompt .= "Be helpful, concise, and friendly. ";

            if (!empty($widgetSetting->ai_instructions)) {
                $systemPrompt .= $widgetSetting->ai_instructions;
            }

            // Format any previous messages if provided in context
            $previousMessages = [];
            if (!empty($context['messages']) && is_array($context['messages'])) {
                $previousMessages = $context['messages'];
            }

            // Generate completion using the provider service
            $result = $this->providerService->generateCompletion(
                $aiModel,
                $message,
                $previousMessages,
                [
                    'systemPrompt' => $systemPrompt
                ]
            );

            if (!$result['success']) {
                return [
                    'success' => false,
                    'message' => 'Failed to generate a response: ' . $result['message']
                ];
            }

            return [
                'success' => true,
                'message' => $result['message'],
                'model' => [
                    'name' => $aiModel->name,
                    'provider' => $aiModel->provider
                ],
                'usage' => $result['usage'] ?? null
            ];
        } catch (\Exception $e) {
            Log::error('Error processing chat message: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while processing your message.'
            ];
        }
    }


}
