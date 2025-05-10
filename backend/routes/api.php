
<?php

use App\Http\Controllers\AIModelController;
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
});
