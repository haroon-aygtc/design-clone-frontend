
<?php

namespace App\Http\Controllers;

use App\Models\AIModel;
use App\Services\AIModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AIModelController extends Controller
{
    protected $aiModelService;

    public function __construct(AIModelService $aiModelService)
    {
        $this->aiModelService = $aiModelService;
    }

    /**
     * Display a listing of all AI models.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $models = $this->aiModelService->getAllModels();
            return response()->json($models);
        } catch (\Exception $e) {
            Log::error('Error fetching AI models: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve AI models'], 500);
        }
    }

    /**
     * Store a newly connected AI model.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'provider' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'api_key' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $model = $this->aiModelService->createModel([
                'name' => $request->name,
                'provider' => $request->provider,
                'type' => $request->type,
                'description' => $request->description,
                'api_key' => $request->api_key,
                'status' => 'Connected',
                'is_active' => true,
                'configuration' => $request->configuration ?? [],
            ]);
            
            return response()->json($model, 201);
        } catch (\Exception $e) {
            Log::error('Error storing AI model: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to store AI model'], 500);
        }
    }

    /**
     * Display the specified AI model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $model = $this->aiModelService->getModelById($id);
            return response()->json($model);
        } catch (\Exception $e) {
            Log::error('Error retrieving AI model: ' . $e->getMessage());
            return response()->json(['error' => 'AI model not found'], 404);
        }
    }

    /**
     * Update the specified AI model.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $model = $this->aiModelService->updateModel($id, $request->all());
            return response()->json($model);
        } catch (\Exception $e) {
            Log::error('Error updating AI model: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update AI model'], 500);
        }
    }

    /**
     * Update the model's configuration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateConfiguration(Request $request, $id)
    {
        try {
            $model = $this->aiModelService->updateConfiguration($id, $request->configuration);
            return response()->json($model);
        } catch (\Exception $e) {
            Log::error('Error updating AI model configuration: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update model configuration'], 500);
        }
    }

    /**
     * Toggle the active status of the model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleActive($id)
    {
        try {
            $model = $this->aiModelService->toggleActive($id);
            return response()->json($model);
        } catch (\Exception $e) {
            Log::error('Error toggling AI model status: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to toggle model status'], 500);
        }
    }

    /**
     * Remove the specified AI model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->aiModelService->deleteModel($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Error deleting AI model: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete AI model'], 500);
        }
    }

    /**
     * Test the connection to the AI model's API.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function testConnection($id)
    {
        try {
            $result = $this->aiModelService->testConnection($id);
            
            if (!$result['success']) {
                return response()->json($result, 400);
            }
            
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('API connection test failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get usage logs for the AI model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getLogs($id)
    {
        try {
            $logs = $this->aiModelService->getModelLogs($id);
            return response()->json($logs);
        } catch (\Exception $e) {
            Log::error('Error retrieving AI model logs: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve model logs'], 500);
        }
    }
    
    /**
     * Get all active models for widget use.
     * 
     * @return \Illuminate\Http\Response
     */
    public function getWidgetModels()
    {
        try {
            $models = $this->aiModelService->getWidgetModels();
            return response()->json($models);
        } catch (\Exception $e) {
            Log::error('Error fetching widget AI models: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve widget models'], 500);
        }
    }
    
    /**
     * Assign an AI model to a widget.
     * 
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function assignModelToWidget(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'model_id' => 'required|integer|exists:ai_models,id',
            'widget_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $result = $this->aiModelService->assignModelToWidget(
                $request->model_id,
                $request->widget_id
            );
            
            if ($result) {
                return response()->json(['success' => true, 'message' => 'Model assigned to widget successfully']);
            }
            
            return response()->json(['success' => false, 'message' => 'Failed to assign model to widget'], 400);
        } catch (\Exception $e) {
            Log::error('Error assigning AI model to widget: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to assign model to widget'], 500);
        }
    }
    
    /**
     * Increment model usage counter.
     * 
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function recordModelUsage($id)
    {
        try {
            $model = $this->aiModelService->incrementUsageCount($id);
            return response()->json(['success' => true, 'usage_count' => $model->usage_count]);
        } catch (\Exception $e) {
            Log::error('Error recording AI model usage: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to record model usage'], 500);
        }
    }
}
