<?php

namespace App\Repositories;

use App\Models\WidgetSetting;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class WidgetSettingRepository
{
    /**
     * Get all widget settings
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return WidgetSetting::all();
    }

    /**
     * Find widget setting by ID
     *
     * @param int $id
     * @return WidgetSetting
     * @throws ModelNotFoundException
     */
    public function findById(int $id): WidgetSetting
    {
        return WidgetSetting::findOrFail($id);
    }

    /**
     * Find widget settings by AI Model ID
     *
     * @param int $aiModelId
     * @return Collection
     */
    public function findByAiModelId(int $aiModelId): Collection
    {
        return WidgetSetting::where('ai_model_id', $aiModelId)->get();
    }

    /**
     * Create a new widget setting
     *
     * @param array $data
     * @return WidgetSetting
     */
    public function create(array $data): WidgetSetting
    {
        return WidgetSetting::create($data);
    }

    /**
     * Update a widget setting
     *
     * @param int $id
     * @param array $data
     * @return WidgetSetting
     * @throws ModelNotFoundException
     */
    public function update(int $id, array $data): WidgetSetting
    {
        $setting = $this->findById($id);
        $setting->update($data);
        return $setting;
    }

    /**
     * Delete a widget setting
     *
     * @param int $id
     * @return bool
     * @throws ModelNotFoundException
     */
    public function delete(int $id): bool
    {
        $setting = $this->findById($id);
        return $setting->delete();
    }
}
