<?php

namespace Database\Seeders;

use App\Models\AIModel;
use Illuminate\Database\Seeder;

class AIModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $models = [
            [
                'name' => 'GPT-4',
                'provider' => 'OpenAI',
                'type' => 'Large Language Model',
                'description' => 'Latest GPT model with improved reasoning and instruction following',
                'status' => 'Available',
            ],
            [
                'name' => 'Claude 3',
                'provider' => 'Anthropic',
                'type' => 'Large Language Model',
                'description' => 'Advanced conversation model with strong reasoning abilities',
                'status' => 'Available',
            ],
            [
                'name' => 'Gemini Pro',
                'provider' => 'Google',
                'type' => 'Multimodal',
                'description' => 'Multimodal model supporting text, images, and video inputs',
                'status' => 'Available',
            ],
            [
                'name' => 'DALL-E 3',
                'provider' => 'OpenAI',
                'type' => 'Image Generation',
                'description' => 'Creates high-quality images from textual descriptions',
                'status' => 'Available',
            ],
            [
                'name' => 'Whisper',
                'provider' => 'OpenAI',
                'type' => 'Speech Recognition',
                'description' => 'Accurate speech-to-text transcription and translation',
                'status' => 'Available',
            ],
        ];

        foreach ($models as $model) {
            AIModel::create($model);
        }
    }
}
