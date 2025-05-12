<?php

namespace App\Providers;

use App\Services\AI\AIProviderFactory;
use App\Services\AI\AIProviderService;
use Illuminate\Support\ServiceProvider;

class AIProviderServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(AIProviderFactory::class, function ($app) {
            return new AIProviderFactory();
        });

        $this->app->singleton(AIProviderService::class, function ($app) {
            return new AIProviderService($app->make(AIProviderFactory::class));
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
