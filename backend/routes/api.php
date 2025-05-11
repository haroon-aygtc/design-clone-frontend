<?php

use App\Http\Controllers\AIModelController;
use App\Http\Controllers\WidgetSettingController;
use App\Http\Controllers\WidgetChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// AI Models routes
Route::prefix('ai-models')->group(function () {
    Route::get('/', [AIModelController::class, 'index']);
    Route::post('/', [AIModelController::class, 'store']);
    Route::get('/{id}', [AIModelController::class, 'show']);
    Route::put('/{id}', [AIModelController::class, 'update']);
    Route::delete('/{id}', [AIModelController::class, 'destroy']);
    
    Route::put('/{id}/configuration', [AIModelController::class, 'updateConfiguration']);
    Route::put('/{id}/toggle-active', [AIModelController::class, 'toggleActive']);
    Route::get('/{id}/test-connection', [AIModelController::class, 'testConnection']);
    Route::get('/{id}/logs', [AIModelController::class, 'getLogs']);
    
    // Widget-related routes
    Route::get('/widget/available', [AIModelController::class, 'getWidgetModels']);
    Route::post('/widget/assign', [AIModelController::class, 'assignModelToWidget']);
    Route::post('/{id}/usage', [AIModelController::class, 'recordModelUsage']);
});

// Widget Settings routes
Route::prefix('widget-settings')->group(function () {
    Route::get('/', [WidgetSettingController::class, 'index']);
    Route::post('/', [WidgetSettingController::class, 'store']);
    Route::get('/{id}', [WidgetSettingController::class, 'show']);
    Route::put('/{id}', [WidgetSettingController::class, 'update']);
    Route::delete('/{id}', [WidgetSettingController::class, 'destroy']);
    
    Route::get('/model/{aiModelId}', [WidgetSettingController::class, 'getByModelId']);
    Route::get('/{id}/embed-code', [WidgetSettingController::class, 'generateEmbedCode']);
});

// Widget Chat routes
Route::prefix('widget')->group(function () {
    Route::post('/chat', [WidgetChatController::class, 'processMessage']);
});
