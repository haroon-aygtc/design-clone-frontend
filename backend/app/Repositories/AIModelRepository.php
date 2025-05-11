<?php

namespace App\Repositories;

use App\Models\AIModel;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class AIModelRepository
{
    /**
     * Get all AI models
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return AIModel::all();
    }

    /**
     * Find AI model by ID
     *
     * @param int $id
     * @return AIModel
     * @throws ModelNotFoundException
     */
    public function findById(int $id): AIModel
    {
        return AIModel::findOrFail($id);
    }

    /**
     * Create a new AI model
     *
     * @param array $data
     * @return AIModel
     */
    public function create(array $data): AIModel
    {
        return AIModel::create($data);
    }

    /**
     * Update an AI model
     *
     * @param int $id
     * @param array $data
     * @return AIModel
     * @throws ModelNotFoundException
     */
    public function update(int $id, array $data): AIModel
    {
        $model = $this->findById($id);
        $model->update($data);
        return $model;
    }

    /**
     * Delete an AI model
     *
     * @param int $id
     * @return bool
     * @throws ModelNotFoundException
     */
    public function delete(int $id): bool
    {
        $model = $this->findById($id);
        return $model->delete();
    }

    /**
     * Get active AI models
     *
     * @return Collection
     */
    public function getActiveModels(): Collection
    {
        return AIModel::where('is_active', true)->get();
    }

    /**
     * Get models by provider
     *
     * @param string $provider
     * @return Collection
     */
    public function getByProvider(string $provider): Collection
    {
        return AIModel::where('provider', $provider)->get();
    }

    /**
     * Get models by type
     *
     * @param string $type
     * @return Collection
     */
    public function getByType(string $type): Collection
    {
        return AIModel::where('type', $type)->get();
    }
}
