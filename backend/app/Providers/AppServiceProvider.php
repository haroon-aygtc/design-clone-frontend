<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Services\AIModelService;
use App\Repositories\AIModelRepository;
use App\Services\WidgetSettingService;
use App\Repositories\WidgetSettingRepository;
use App\Services\WidgetChatService;
use App\Services\AI\AIProviderService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(AIModelRepository::class, function ($app) {
            return new AIModelRepository();
        });

        $this->app->bind(WidgetSettingRepository::class, function ($app) {
            return new WidgetSettingRepository();
        });

        $this->app->bind(AIProviderService::class, function ($app) {
            return new AIProviderService();
        });

        $this->app->bind(AIModelService::class, function ($app) {
            return new AIModelService(
                $app->make(AIModelRepository::class),
                $app->make(AIProviderService::class)
            );
        });

        $this->app->bind(WidgetSettingService::class, function ($app) {
            return new WidgetSettingService(
                $app->make(WidgetSettingRepository::class)
            );
        });

        $this->app->bind(WidgetChatService::class, function ($app) {
            return new WidgetChatService(
                $app->make(AIModelService::class),
                $app->make(WidgetSettingRepository::class),
                $app->make(AIProviderService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Fix for MySQL < 5.7.7 and MariaDB < 10.2.2
        Schema::defaultStringLength(191);
    }
}
