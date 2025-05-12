<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class AIProviderConfig extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'display_name',
        'description',
        'api_url',
        'api_key',
        'headers',
        'default_params',
        'endpoints',
        'is_dynamic',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'headers' => 'array',
        'default_params' => 'array',
        'endpoints' => 'array',
        'is_dynamic' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the decrypted API key.
     *
     * @return string|null
     */
    public function getDecryptedApiKeyAttribute(): ?string
    {
        if (empty($this->api_key)) {
            return null;
        }
        
        return Crypt::decrypt($this->api_key);
    }

    /**
     * Set the API key, encrypting it.
     *
     * @param string|null $value
     * @return void
     */
    public function setApiKeyAttribute(?string $value): void
    {
        if (empty($value)) {
            $this->attributes['api_key'] = null;
            return;
        }
        
        $this->attributes['api_key'] = Crypt::encrypt($value);
    }
}
