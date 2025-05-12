<?php

namespace App\Http\Controllers;

use App\Models\AIProviderConfig;
use App\Services\AI\AIProviderFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AIProviderConfigController extends Controller
{
    /**
     * Display a listing of the provider configurations.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $providers = AIProviderConfig::all();
        
        // Mask API keys for security
        foreach ($providers as $provider) {
            if ($provider->api_key) {
                $provider->api_key = '••••••••';
            }
        }
        
        return response()->json($providers);
    }
    
    /**
     * Store a newly created provider configuration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:ai_provider_configs',
            'display_name' => 'required|string|max:255',
            'api_url' => 'required|string|max:255',
            'api_key' => 'nullable|string',
            'headers' => 'nullable|array',
            'default_params' => 'nullable|array',
            'endpoints' => 'nullable|array',
            'is_dynamic' => 'boolean',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        try {
            $provider = new AIProviderConfig();
            $provider->name = $request->name;
            $provider->display_name = $request->display_name;
            $provider->description = $request->description;
            $provider->api_url = $request->api_url;
            $provider->api_key = $request->api_key;
            $provider->headers = $request->headers;
            $provider->default_params = $request->default_params;
            $provider->endpoints = $request->endpoints;
            $provider->is_dynamic = $request->is_dynamic ?? true;
            $provider->is_active = $request->is_active ?? true;
            $provider->save();
            
            // Mask API key for response
            $provider->api_key = '••••••••';
            
            return response()->json($provider, 201);
        } catch (\Exception $e) {
            Log::error('Error creating AI provider config: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to create provider configuration'], 500);
        }
    }
    
    /**
     * Display the specified provider configuration.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $provider = AIProviderConfig::findOrFail($id);
            
            // Mask API key for security
            if ($provider->api_key) {
                $provider->api_key = '••••••••';
            }
            
            return response()->json($provider);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Provider configuration not found'], 404);
        }
    }
    
    /**
     * Update the specified provider configuration.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:ai_provider_configs,name,' . $id,
            'display_name' => 'string|max:255',
            'api_url' => 'string|max:255',
            'api_key' => 'nullable|string',
            'headers' => 'nullable|array',
            'default_params' => 'nullable|array',
            'endpoints' => 'nullable|array',
            'is_dynamic' => 'boolean',
            'is_active' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        try {
            $provider = AIProviderConfig::findOrFail($id);
            
            // Only update fields that are present in the request
            if ($request->has('name')) {
                $provider->name = $request->name;
            }
            
            if ($request->has('display_name')) {
                $provider->display_name = $request->display_name;
            }
            
            if ($request->has('description')) {
                $provider->description = $request->description;
            }
            
            if ($request->has('api_url')) {
                $provider->api_url = $request->api_url;
            }
            
            if ($request->has('api_key')) {
                $provider->api_key = $request->api_key;
            }
            
            if ($request->has('headers')) {
                $provider->headers = $request->headers;
            }
            
            if ($request->has('default_params')) {
                $provider->default_params = $request->default_params;
            }
            
            if ($request->has('endpoints')) {
                $provider->endpoints = $request->endpoints;
            }
            
            if ($request->has('is_dynamic')) {
                $provider->is_dynamic = $request->is_dynamic;
            }
            
            if ($request->has('is_active')) {
                $provider->is_active = $request->is_active;
            }
            
            $provider->save();
            
            // Mask API key for response
            $provider->api_key = '••••••••';
            
            return response()->json($provider);
        } catch (\Exception $e) {
            Log::error('Error updating AI provider config: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update provider configuration'], 500);
        }
    }
    
    /**
     * Remove the specified provider configuration.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $provider = AIProviderConfig::findOrFail($id);
            $provider->delete();
            
            return response()->json(['message' => 'Provider configuration deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting AI provider config: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete provider configuration'], 500);
        }
    }
    
    /**
     * Test the connection to the provider API.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function testConnection($id)
    {
        try {
            $providerConfig = AIProviderConfig::findOrFail($id);
            
            // Create a dynamic provider instance
            $factory = new AIProviderFactory();
            $provider = $factory->createProvider($providerConfig->name);
            
            // Initialize with the API key from the configuration
            $provider->initialize($providerConfig->getDecryptedApiKeyAttribute() ?? '', [
                'provider' => $providerConfig->name,
                'provider_config' => $providerConfig
            ]);
            
            // Test the connection
            $result = $provider->testConnection();
            
            return response()->json($result);
        } catch (\Exception $e) {
            Log::error('Error testing AI provider connection: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage()
            ], 500);
        }
    }
}
