
<?php

namespace App\Http\Controllers;

use App\Models\AIModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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

        $model = AIModel::create([
            'name' => $request->name,
            'provider' => $request->provider,
            'type' => $request->type,
            'description' => $request->description,
            'api_key' => encrypt($request->api_key),
            'status' => 'Connected',
            'is_active' => true,
            'configuration' => $request->configuration ?? [],
        ]);

        return response()->json($model, 201);
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
        
        // Implement the logic to test the connection
        // This would depend on the provider and type of model
        
        // Mock response for now
        return response()->json([
            'success' => true,
            'message' => 'Connection successful',
        ]);
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
