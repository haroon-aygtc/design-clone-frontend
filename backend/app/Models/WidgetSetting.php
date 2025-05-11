<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WidgetSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'ai_model_id',
        'name',
        'primary_color',
        'secondary_color',
        'font_family',
        'border_radius',
        'chat_icon_size',
        'response_delay',
        'auto_open',
        'position',
        'allow_attachments',
        'initial_message',
        'placeholder_text',
        'suggested_questions'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'border_radius' => 'integer',
        'chat_icon_size' => 'integer',
        'response_delay' => 'integer',
        'auto_open' => 'boolean',
        'allow_attachments' => 'boolean',
        'suggested_questions' => 'json'
    ];

    /**
     * Get the AI model that owns the widget setting.
     */
    public function aiModel()
    {
        return $this->belongsTo(AIModel::class);
    }

    /**
     * Generate embed code based on widget settings
     *
     * @return string
     */
    public function generateEmbedCode()
    {
        // Get the associated AI model for additional information
        $aiModel = $this->aiModel;
        
        $code = "<script>\n";
        $code .= "  window.chatWidgetSettings = {\n";
        $code .= "    widgetId: \"{$this->id}\",\n";
        $code .= "    primaryColor: \"{$this->primary_color}\",\n";
        $code .= "    secondaryColor: \"{$this->secondary_color}\",\n";
        $code .= "    fontFamily: \"{$this->font_family}\",\n";
        $code .= "    borderRadius: {$this->border_radius},\n";
        $code .= "    chatIconSize: {$this->chat_icon_size},\n";
        $code .= "    position: \"{$this->position}\",\n";
        $code .= "    autoOpen: " . ($this->auto_open ? 'true' : 'false') . ",\n";
        $code .= "    initialMessage: \"" . addslashes($this->initial_message) . "\",\n";
        $code .= "    placeholderText: \"" . addslashes($this->placeholder_text) . "\",\n";
        $code .= "    allowAttachments: " . ($this->allow_attachments ? 'true' : 'false') . ",\n";
        $code .= "    responseDelay: {$this->response_delay},\n";
        $code .= "    aiModelId: {$this->ai_model_id},\n";
        if ($aiModel) {
            $code .= "    aiModelName: \"" . addslashes($aiModel->name) . "\",\n";
            $code .= "    aiModelProvider: \"" . addslashes($aiModel->provider) . "\",\n";
            
            // Include model capabilities if available
            if (isset($aiModel->configuration) && is_array($aiModel->configuration)) {
                if (isset($aiModel->configuration['capabilities'])) {
                    $code .= "    aiModelCapabilities: " . json_encode($aiModel->configuration['capabilities']) . ",\n";
                }
            }
        }
        $code .= "    apiEndpoint: \"" . url('/api/widget/chat') . "\"\n";
        $code .= "  };\n";
        $code .= "</script>\n";
        $code .= "<script src=\"" . url('/js/chat-widget.js') . "\" async></script>";

        return $code;
    }
}
