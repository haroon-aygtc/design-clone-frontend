<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWidgetSettingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('widget_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_model_id')->constrained('ai_models')->onDelete('cascade');
            $table->string('name');
            $table->string('primary_color')->default('#6366F1');
            $table->string('secondary_color')->default('#6366F1');
            $table->string('font_family')->default('Inter');
            $table->integer('border_radius')->default(8);
            $table->integer('chat_icon_size')->default(40);
            $table->integer('response_delay')->default(1);
            $table->boolean('auto_open')->default(false);
            $table->string('position')->default('bottom-right');
            $table->boolean('allow_attachments')->default(true);
            $table->text('initial_message')->nullable();
            $table->string('placeholder_text')->default('Ask me anything...');
            $table->json('suggested_questions')->nullable();
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
        Schema::dropIfExists('widget_settings');
    }
}
