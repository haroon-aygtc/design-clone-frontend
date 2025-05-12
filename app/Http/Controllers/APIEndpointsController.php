<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class APIEndpointsController extends Controller
{
    /**
     * Get all available API endpoints
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all registered routes
        $routes = Route::getRoutes();
        $apiEndpoints = [];
        
        foreach ($routes as $route) {
            // Only include API routes
            if (strpos($route->uri, 'api/') === 0) {
                $apiEndpoints[] = '/' . $route->uri;
            }
        }
        
        // Add some external APIs for testing
        $externalApis = [
            'https://jsonplaceholder.typicode.com/posts',
            'https://jsonplaceholder.typicode.com/users',
            'https://jsonplaceholder.typicode.com/comments',
            'https://api.github.com/users',
            'https://api.publicapis.org/entries',
        ];
        
        return response()->json(array_merge($apiEndpoints, $externalApis));
    }
}
