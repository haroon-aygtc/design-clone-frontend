
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

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
        'configuration' => 'json', // Using json instead of array for MySQL compatibility
    ];

    /**
     * Set the API key attribute.
     * 
     * @param string $value
     * @return void
     */
    public function setApiKeyAttribute($value)
    {
        $this->attributes['api_key'] = $value ? Crypt::encryptString($value) : null;
    }

    /**
     * Get a decrypted API key.
     *
     * @return string|null
     */
    public function getDecryptedApiKeyAttribute()
    {
        try {
            return $this->api_key ? Crypt::decryptString($this->api_key) : null;
        } catch (\Exception $e) {
            return null;
        }
    }
}

