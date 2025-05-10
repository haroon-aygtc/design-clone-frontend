
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
            
            // In a real implementation, this would call the actual AI API
            // For now, we'll simulate a response
            $response = $this->simulateAIResponse($message, $aiModel->name);
            
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
     * @param string $modelName
     * @return string
     */
    private function simulateAIResponse(string $message, string $modelName): string
    {
        // In a real implementation, this would call the AI provider's API
        $responses = [
            'hello' => "Hello! How can I assist you today?",
            'how are you' => "I'm an AI assistant powered by $modelName. I don't have feelings, but I'm ready to help you!",
            'help' => "I can answer questions, provide information, or assist with tasks. What do you need help with?",
        ];
        
        $messageLower = strtolower($message);
        
        foreach ($responses as $key => $response) {
            if (strpos($messageLower, $key) !== false) {
                return $response;
            }
        }
        
        return "Thanks for your message. I'm currently using $modelName to process your requests. How can I help you further?";
    }
}
