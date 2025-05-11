<?php

namespace App\Http\Controllers;

use App\Services\WidgetChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class WidgetChatController extends Controller
{
    protected $widgetChatService;

    public function __construct(WidgetChatService $widgetChatService)
    {
        $this->widgetChatService = $widgetChatService;
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
}
