
<?php

namespace App\Http\Controllers;

use App\Models\WidgetSetting;
use App\Services\WidgetSettingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class WidgetSettingController extends Controller
{
    protected $widgetSettingService;

    public function __construct(WidgetSettingService $widgetSettingService)
    {
        $this->widgetSettingService = $widgetSettingService;
    }

    /**
     * Display a listing of all widget settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $settings = $this->widgetSettingService->getAllSettings();
            return response()->json($settings);
        } catch (\Exception $e) {
            Log::error('Error fetching widget settings: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve widget settings'], 500);
        }
    }

    /**
     * Store a newly created widget setting.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ai_model_id' => 'required|exists:ai_models,id',
            'name' => 'required|string|max:255',
            'primary_color' => 'nullable|string|max:25',
            'secondary_color' => 'nullable|string|max:25',
            'font_family' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $setting = $this->widgetSettingService->createSetting($request->all());
            
            return response()->json($setting, 201);
        } catch (\Exception $e) {
            Log::error('Error storing widget setting: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to store widget setting'], 500);
        }
    }

    /**
     * Display the specified widget setting.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $setting = $this->widgetSettingService->getSettingById($id);
            return response()->json($setting);
        } catch (\Exception $e) {
            Log::error('Error retrieving widget setting: ' . $e->getMessage());
            return response()->json(['error' => 'Widget setting not found'], 404);
        }
    }

    /**
     * Get all settings for a specific AI model.
     *
     * @param  int  $aiModelId
     * @return \Illuminate\Http\Response
     */
    public function getByModelId($aiModelId)
    {
        try {
            $settings = $this->widgetSettingService->getSettingsByAiModelId($aiModelId);
            return response()->json($settings);
        } catch (\Exception $e) {
            Log::error('Error retrieving widget settings for AI model: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to retrieve widget settings'], 500);
        }
    }

    /**
     * Update the specified widget setting.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $setting = $this->widgetSettingService->updateSetting($id, $request->all());
            return response()->json($setting);
        } catch (\Exception $e) {
            Log::error('Error updating widget setting: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update widget setting'], 500);
        }
    }

    /**
     * Remove the specified widget setting.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->widgetSettingService->deleteSetting($id);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Error deleting widget setting: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete widget setting'], 500);
        }
    }

    /**
     * Generate embed code for the widget setting.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function generateEmbedCode($id)
    {
        try {
            $embedCode = $this->widgetSettingService->generateEmbedCode($id);
            return response()->json([
                'embed_code' => $embedCode
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating embed code: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to generate embed code'], 500);
        }
    }
}
