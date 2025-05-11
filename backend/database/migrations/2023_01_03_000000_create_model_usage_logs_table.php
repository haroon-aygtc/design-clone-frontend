<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModelUsageLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('model_usage_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ai_model_id');
            $table->string('type'); // 'Usage', 'Error', 'Warning', etc.
            $table->string('message');
            $table->text('details')->nullable();
            $table->integer('tokens_generated')->nullable();
            $table->float('processing_time')->nullable();
            $table->json('request_data')->nullable();
            $table->json('response_data')->nullable();
            $table->timestamps();
            
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
        Schema::dropIfExists('model_usage_logs');
    }
}
