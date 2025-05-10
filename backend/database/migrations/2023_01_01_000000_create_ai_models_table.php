
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAiModelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ai_models', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('provider');
            $table->string('type');
            $table->text('description')->nullable();
            $table->string('status')->default('Available');
            $table->text('api_key')->nullable();
            $table->boolean('is_active')->default(false);
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used')->nullable();
            $table->json('configuration')->nullable();
            $table->json('default_parameters')->nullable();
            $table->json('widget_settings')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ai_models');
    }
}
