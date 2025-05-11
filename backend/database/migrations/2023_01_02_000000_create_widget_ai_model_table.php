<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWidgetAiModelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('widget_ai_model', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('widget_id');
            $table->unsignedBigInteger('ai_model_id');
            $table->json('model_settings')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->timestamps();
            
            // In a full implementation, there would be a widgets table
            // $table->foreign('widget_id')->references('id')->on('widgets')->onDelete('cascade');
            $table->foreign('ai_model_id')->references('id')->on('ai_models')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('widget_ai_model');
    }
}
