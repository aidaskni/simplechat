<?php
namespace Aidaskni\Simplechat;

use Illuminate\Support\ServiceProvider;

/**
 * Created by PhpStorm.
 * User: Aidas
 */
class SimpleChatServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {

    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        $this->publishes([
            __DIR__ . '/resources/views' => resource_path('views/simplechat'),
        ]);

        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
        $this->loadRoutesFrom(__DIR__ . '/routes/routes.php');
    }
}