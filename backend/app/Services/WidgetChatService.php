<?php

namespace App\Services;

use App\Services\AIModelService;
use App\Repositories\WidgetSettingRepository;
use Illuminate\Support\Facades\Log;

class WidgetChatService
{
    protected $aiModelService;
    protected $widgetSettingRepository;

    public function __construct(
        AIModelService $aiModelService,
        WidgetSettingRepository $widgetSettingRepository
    ) {
        $this->aiModelService = $aiModelService;
        $this->widgetSettingRepository = $widgetSettingRepository;
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
            
            // In a real implementation, this would call the actual AI API
            // with the appropriate model configuration
            $response = $this->simulateAIResponse($message, $aiModel, $enhancedContext);
            
            return [
                'success' => true,
                'message' => $response,
                'model' => [
                    'name' => $aiModel->name,
                    'provider' => $aiModel->provider
                ]
            ];
        } catch (\Exception $e) {
            Log::error('Error processing chat message: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'An error occurred while processing your message.'
            ];
        }
    }
    
    /**
     * Simulate an AI response (temporary implementation)
     *
     * @param string $message
     * @param object $aiModel
     * @param array $context
     * @return string
     */
    private function simulateAIResponse(string $message, $aiModel, array $context = []): string
    {
        // In a real implementation, this would use the model's configuration
        // to call the appropriate API with the right parameters
        $modelConfig = $aiModel->configuration ?? [];
        
        $responses = [
            'hello' => "Hello! How can I assist you today?",
            'how are you' => "I'm an AI assistant powered by {$aiModel->name}. I don't have feelings, but I'm ready to help you!",
            'help' => "I can answer questions, provide information, or assist with tasks. What do you need help with?",
        ];
        
        $messageLower = strtolower($message);
        
        foreach ($responses as $key => $response) {
            if (strpos($messageLower, $key) !== false) {
                return $response;
            }
        }
        
        // Include widget context in response if available
        $widgetName = isset($context['widget_name']) ? " through {$context['widget_name']}" : "";
        
        return "Thanks for your message{$widgetName}. I'm currently using {$aiModel->name} to process your requests. How can I help you further?";
    }
}
