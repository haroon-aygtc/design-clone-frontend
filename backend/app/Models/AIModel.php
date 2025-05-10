
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
        'default_parameters',
        'widget_settings',
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
        'default_parameters' => 'json',
        'widget_settings' => 'json',
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
    
    /**
     * Get the model usage logs.
     * This would be a real relationship in a full implementation
     * 
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function logs()
    {
        // This is a placeholder for a real relationship
        // In a complete implementation, you'd have a ModelLog model
        // return $this->hasMany(ModelLog::class);
    }
    
    /**
     * Get widgets that use this model.
     * This would be a real relationship in a full implementation
     * 
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function widgets()
    {
        // This is a placeholder for a real relationship
        // In a complete implementation, you'd have a Widget model
        // return $this->belongsToMany(Widget::class, 'widget_ai_model');
    }
    
    /**
     * Scope a query to only include active models.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
    
    /**
     * Scope a query to only include models from a specific provider.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $provider
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }
    
    /**
     * Scope a query to only include models of a specific type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }
}
