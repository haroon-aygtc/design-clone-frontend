<?php

namespace App\Http\Controllers;

use App\Services\WidgetChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WidgetChatController extends Controller
{
    protected $widgetChatService;
    protected $aiModelService;
    protected $providerService;

    public function __construct(
        WidgetChatService $widgetChatService,
        \App\Services\AIModelService $aiModelService,
        \App\Services\AI\AIProviderService $providerService
    ) {
        $this->widgetChatService = $widgetChatService;
        $this->aiModelService = $aiModelService;
        $this->providerService = $providerService;
    }

    /**
     * Process a chat message from the widget
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function processMessage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'widget_id' => 'required|integer|exists:widget_settings,id',
            'message' => 'required|string',
            'context' => 'nullable|array',
            'session_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $result = $this->widgetChatService->processMessage(
                $request->widget_id,
                $request->message,
                $request->context ?? []
            );

            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error in chat processing: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your message.'
            ], 500);
        }
    }

    /**
     * Process a chat message from the widget with streaming response
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function processMessageStream(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'widget_id' => 'required|integer|exists:widget_settings,id',
            'message' => 'required|string',
            'context' => 'nullable|array',
            'session_id' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            // Get the widget settings
            $widgetSetting = app(\App\Repositories\WidgetSettingRepository::class)->findById($request->widget_id);

            // Get the AI model
            $aiModelId = $widgetSetting->ai_model_id;
            $aiModel = $this->aiModelService->getModelById($aiModelId);

            // Verify the model is active
            if (!$aiModel->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'The AI model is not currently available.'
                ], 400);
            }

            // Record usage of the model
            $this->aiModelService->incrementUsageCount($aiModelId);

            // Prepare system prompt with widget context
            $systemPrompt = "You are an AI assistant for {$widgetSetting->name}. ";
            $systemPrompt .= "Be helpful, concise, and friendly. ";

            if (!empty($widgetSetting->ai_instructions)) {
                $systemPrompt .= $widgetSetting->ai_instructions;
            }

            // Format any previous messages if provided in context
            $previousMessages = [];
            if (!empty($request->context['messages']) && is_array($request->context['messages'])) {
                $previousMessages = $request->context['messages'];
            }

            // Create a streamed response
            return response()->stream(function () use ($aiModel, $request, $previousMessages, $systemPrompt) {
                // Send response headers for SSE
                header('Content-Type: text/event-stream');
                header('Cache-Control: no-cache');
                header('X-Accel-Buffering: no'); // Disable buffering for Nginx
                header('Access-Control-Allow-Origin: *'); // Allow cross-origin requests
                header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
                header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

                // Send a start event
                echo "event: start\n";
                echo "data: " . json_encode(['success' => true]) . "\n\n";
                ob_flush();
                flush();

                // Track total tokens for usage reporting
                $totalTokens = 0;
                $promptTokens = 0;
                $completionTokens = 0;

                // Generate streaming completion
                $this->providerService->generateCompletionStream(
                    $aiModel,
                    $request->message,
                    $previousMessages,
                    ['systemPrompt' => $systemPrompt],
                    function ($content, $data) use (&$totalTokens, &$promptTokens, &$completionTokens) {
                        // Update token counts if available in the data
                        if (isset($data['usage'])) {
                            if (isset($data['usage']['prompt_tokens'])) {
                                $promptTokens = $data['usage']['prompt_tokens'];
                            }
                            if (isset($data['usage']['completion_tokens'])) {
                                $completionTokens = $data['usage']['completion_tokens'];
                            }
                            if (isset($data['usage']['total_tokens'])) {
                                $totalTokens = $data['usage']['total_tokens'];
                            }
                        }

                        // Send each chunk as an SSE event
                        echo "event: chunk\n";
                        echo "data: " . json_encode([
                            'content' => $content,
                            'data' => $data
                        ]) . "\n\n";
                        ob_flush();
                        flush();
                    }
                );

                // Send an end event with usage information
                echo "event: end\n";
                echo "data: " . json_encode([
                    'success' => true,
                    'usage' => [
                        'prompt_tokens' => $promptTokens,
                        'completion_tokens' => $completionTokens,
                        'total_tokens' => $totalTokens
                    ],
                    'model' => [
                        'name' => $aiModel->name,
                        'provider' => $aiModel->provider
                    ]
                ]) . "\n\n";
                ob_flush();
                flush();
            }, 200, [
                'Cache-Control' => 'no-cache',
                'Content-Type' => 'text/event-stream',
                'Connection' => 'keep-alive',
                'X-Accel-Buffering' => 'no',
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Headers' => 'Content-Type, X-Requested-With',
                'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS'
            ]);
        } catch (\Exception $e) {
            Log::error('Error in streaming chat processing: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your message.'
            ], 500);
        }
    }
}
