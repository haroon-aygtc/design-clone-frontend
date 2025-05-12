<?php

use App\Http\Controllers\AIModelController;
use App\Http\Controllers\AIProviderConfigController;
use App\Http\Controllers\APIEndpointsController;
use App\Http\Controllers\WidgetChatController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// AI Models routes
Route::get('/ai-models', [AIModelController::class, 'index']);
Route::get('/ai-models/widget/available', [AIModelController::class, 'getAvailableForWidget']);
Route::post('/ai-models/widget/assign', [AIModelController::class, 'assignToWidget']);
Route::get('/ai-models/{id}', [AIModelController::class, 'show']);
Route::put('/ai-models/{id}/configuration', [AIModelController::class, 'updateConfiguration']);
Route::put('/ai-models/{id}/toggle-active', [AIModelController::class, 'toggleActive']);
Route::post('/ai-models/{id}/test-connection', [AIModelController::class, 'testConnection']);

// Widget Chat routes
Route::post('/widget/chat', [WidgetChatController::class, 'sendMessage']);
Route::post('/widget/chat/stream', [WidgetChatController::class, 'sendMessageStream']);

// AI Provider Configuration routes
Route::prefix('ai-provider-configs')->group(function () {
    Route::get('/', [AIProviderConfigController::class, 'index']);
    Route::post('/', [AIProviderConfigController::class, 'store']);
    Route::get('/{id}', [AIProviderConfigController::class, 'show']);
    Route::put('/{id}', [AIProviderConfigController::class, 'update']);
    Route::delete('/{id}', [AIProviderConfigController::class, 'destroy']);
    Route::post('/{id}/test-connection', [AIProviderConfigController::class, 'testConnection']);
});

// API Endpoints for API Tester
Route::get('/api-endpoints', [APIEndpointsController::class, 'index']);
