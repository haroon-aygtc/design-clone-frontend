
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AIModel extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ai_models';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'provider',
        'type',
        'description',
        'status',
        'api_key',
        'is_active',
        'usage_count',
        'last_used',
        'configuration',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'api_key',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'is_active' => 'boolean',
        'usage_count' => 'integer',
        'last_used' => 'datetime',
        'configuration' => 'array',
    ];

    /**
     * Get a decrypted API key.
     *
     * @return string
     */
    public function getDecryptedApiKeyAttribute()
    {
        return $this->api_key ? decrypt($this->api_key) : null;
    }
}
