<?php

namespace App\Http\Controllers;

use App\Models\AIModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AIModelController extends Controller
{
    /**
     * Display a listing of all AI models.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $models = AIModel::all();
        return response()->json($models);
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
            $model = new AIModel();
            $model->name = $request->name;
            $model->provider = $request->provider;
            $model->type = $request->type;
            $model->description = $request->description;
            $model->api_key = $request->api_key; // Will be automatically encrypted
            $model->status = 'Connected';
            $model->is_active = true;
            $model->configuration = $request->configuration ?? [];
            $model->save();
            
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
        $model = AIModel::findOrFail($id);
        return response()->json($model);
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
        $model = AIModel::findOrFail($id);
        
        // Update the model
        $model->update($request->all());
        
        return response()->json($model);
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
        $model = AIModel::findOrFail($id);
        
        $model->configuration = $request->configuration;
        $model->save();
        
        return response()->json($model);
    }

    /**
     * Toggle the active status of the model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleActive($id)
    {
        $model = AIModel::findOrFail($id);
        
        $model->is_active = !$model->is_active;
        $model->save();
        
        return response()->json($model);
    }

    /**
     * Remove the specified AI model.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $model = AIModel::findOrFail($id);
        $model->delete();
        
        return response()->json(null, 204);
    }

    /**
     * Test the connection to the AI model's API.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function testConnection($id)
    {
        $model = AIModel::findOrFail($id);
        
        // Implements a basic test of the API key validity
        // This could be expanded based on the model provider
        try {
            $apiKey = $model->getDecryptedApiKeyAttribute();
            
            // For demonstration purposes only - would need to be replaced 
            // with actual API validation logic based on the provider
            $isValid = !empty($apiKey);
            
            if (!$isValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or missing API key',
                ], 400);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Connection successful',
            ]);
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
        $model = AIModel::findOrFail($id);
        
        // Mock logs data
        $logs = [
            [
                'id' => 1,
                'timestamp' => now()->subHours(1)->format('Y-m-d H:i:s'),
                'type' => 'Usage',
                'message' => 'API call successful',
                'details' => 'Generated 256 tokens in 2.3 seconds'
            ],
            [
                'id' => 2,
                'timestamp' => now()->subHours(2)->format('Y-m-d H:i:s'),
                'type' => 'Usage',
                'message' => 'API call successful',
                'details' => 'Generated 512 tokens in 4.1 seconds'
            ],
            [
                'id' => 3,
                'timestamp' => now()->subHours(3)->format('Y-m-d H:i:s'),
                'type' => 'Error',
                'message' => 'Rate limit exceeded',
                'details' => 'Too many requests in 1 minute'
            ],
        ];
        
        return response()->json($logs);
    }
}
