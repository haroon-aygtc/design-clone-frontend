
<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Redirect to API documentation
Route::get('/docs', function () {
    return redirect('/api/documentation');
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});
