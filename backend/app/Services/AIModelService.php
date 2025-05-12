<?php

namespace App\Services;

use App\Models\AIModel;
use App\Repositories\AIModelRepository;
use App\Services\AI\AIProviderService;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class AIModelService
{
    protected $modelRepository;
    protected $providerService;

    public function __construct(
        AIModelRepository $modelRepository,
        AIProviderService $providerService
    ) {
        $this->modelRepository = $modelRepository;
        $this->providerService = $providerService;
    }

    /**
     * Get all AI models
     *
     * @return Collection
     */
    public function getAllModels(): Collection
    {
        return $this->modelRepository->getAll();
    }

    /**
     * Get model by ID
     *
     * @param int $id
     * @return AIModel
     */
    public function getModelById(int $id): AIModel
    {
        return $this->modelRepository->findById($id);
    }

    /**
     * Create a new AI model
     *
     * @param array $data
     * @return AIModel
     */
    public function createModel(array $data): AIModel
    {
        try {
            return $this->modelRepository->create($data);
        } catch (\Exception $e) {
            Log::error('Error creating AI model: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an existing AI model
     *
     * @param int $id
     * @param array $data
     * @return AIModel
     */
    public function updateModel(int $id, array $data): AIModel
    {
        try {
            return $this->modelRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating AI model: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete an AI model
     *
     * @param int $id
     * @return bool
     */
    public function deleteModel(int $id): bool
    {
        try {
            return $this->modelRepository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting AI model: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update model configuration
     *
     * @param int $id
     * @param array $configuration
     * @return AIModel
     */
    public function updateConfiguration(int $id, array $configuration): AIModel
    {
        try {
            $model = $this->modelRepository->findById($id);
            $model->configuration = $configuration;
            $model->save();
            return $model;
        } catch (\Exception $e) {
            Log::error('Error updating AI model configuration: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Toggle active status
     *
     * @param int $id
     * @return AIModel
     */
    public function toggleActive(int $id): AIModel
    {
        try {
            $model = $this->modelRepository->findById($id);
            $model->is_active = !$model->is_active;
            $model->save();
            return $model;
        } catch (\Exception $e) {
            Log::error('Error toggling AI model active status: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Test connection to AI model API
     *
     * @param int $id
     * @return array
     */
    public function testConnection(int $id): array
    {
        try {
            $model = $this->modelRepository->findById($id);
            $apiKey = $model->getDecryptedApiKeyAttribute();

            if (empty($apiKey)) {
                return [
                    'success' => false,
                    'message' => 'Invalid or missing API key'
                ];
            }

            // Use the provider service to test the connection
            $result = $this->providerService->testConnection($model);

            // Log the connection attempt
            $model->last_used = now();
            $model->save();

            return $result;
        } catch (\Exception $e) {
            Log::error('Error testing AI model connection: ' . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Connection failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get usage logs for a model
     *
     * @param int $id
     * @return array
     */
    public function getModelLogs(int $id): array
    {
        try {
            $model = $this->modelRepository->findById($id);

            // In a real application, this would fetch actual logs from a logs table
            // This is just a mock implementation
            return [
                [
                    'id' => 1,
                    'timestamp' => now()->subHours(1)->format('Y-m-d H:i:s'),
                    'type' => 'Usage',
                    'message' => 'API call successful',
                    'details' => 'Generated 256 tokens in 2.3 seconds'
                ],
                [
                    'id' => 2,
                    'timestamp' => now()->subHours(2)->format('Y-m-d H:i:s'),
                    'type' => 'Usage',
                    'message' => 'API call successful',
                    'details' => 'Generated 512 tokens in 4.1 seconds'
                ],
                [
                    'id' => 3,
                    'timestamp' => now()->subHours(3)->format('Y-m-d H:i:s'),
                    'type' => 'Error',
                    'message' => 'Rate limit exceeded',
                    'details' => 'Too many requests in 1 minute'
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Error getting AI model logs: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get models for widget usage
     *
     * @return Collection
     */
    public function getWidgetModels(): Collection
    {
        return $this->modelRepository->getActiveModels();
    }

    /**
     * Assign model to a widget
     *
     * @param int $modelId
     * @param int $widgetId
     * @return bool
     */
    public function assignModelToWidget(int $modelId, int $widgetId): bool
    {
        try {
            $model = $this->modelRepository->findById($modelId);
            // In a full implementation, there would be a widget_ai_model pivot table
            // This is a placeholder for that relationship assignment
            return true;
        } catch (\Exception $e) {
            Log::error('Error assigning AI model to widget: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Update model usage count
     *
     * @param int $id
     * @return AIModel
     */
    public function incrementUsageCount(int $id): AIModel
    {
        try {
            $model = $this->modelRepository->findById($id);
            $model->usage_count += 1;
            $model->last_used = now();
            $model->save();
            return $model;
        } catch (\Exception $e) {
            Log::error('Error incrementing AI model usage count: ' . $e->getMessage());
            throw $e;
        }
    }
}
