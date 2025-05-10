
<?php

namespace App\Services;

use App\Models\WidgetSetting;
use App\Repositories\WidgetSettingRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class WidgetSettingService
{
    protected $widgetSettingRepository;

    public function __construct(WidgetSettingRepository $widgetSettingRepository)
    {
        $this->widgetSettingRepository = $widgetSettingRepository;
    }

    /**
     * Get all widget settings
     *
     * @return Collection
     */
    public function getAllSettings(): Collection
    {
        return $this->widgetSettingRepository->getAll();
    }

    /**
     * Get widget setting by ID
     *
     * @param int $id
     * @return WidgetSetting
     */
    public function getSettingById(int $id): WidgetSetting
    {
        return $this->widgetSettingRepository->findById($id);
    }

    /**
     * Get widget settings for an AI model
     *
     * @param int $aiModelId
     * @return Collection
     */
    public function getSettingsByAiModelId(int $aiModelId): Collection
    {
        return $this->widgetSettingRepository->findByAiModelId($aiModelId);
    }

    /**
     * Create a new widget setting
     *
     * @param array $data
     * @return WidgetSetting
     */
    public function createSetting(array $data): WidgetSetting
    {
        try {
            return $this->widgetSettingRepository->create($data);
        } catch (\Exception $e) {
            Log::error('Error creating widget setting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Update an existing widget setting
     *
     * @param int $id
     * @param array $data
     * @return WidgetSetting
     */
    public function updateSetting(int $id, array $data): WidgetSetting
    {
        try {
            return $this->widgetSettingRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating widget setting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Delete a widget setting
     *
     * @param int $id
     * @return bool
     */
    public function deleteSetting(int $id): bool
    {
        try {
            return $this->widgetSettingRepository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting widget setting: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Generate embed code for a widget setting
     *
     * @param int $id
     * @return string
     */
    public function generateEmbedCode(int $id): string
    {
        try {
            $setting = $this->widgetSettingRepository->findById($id);
            return $setting->generateEmbedCode();
        } catch (\Exception $e) {
            Log::error('Error generating embed code: ' . $e->getMessage());
            throw $e;
        }
    }
}
