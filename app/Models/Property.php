<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'agent_id', 'name', 'slug', 'type', 'description',
        'address', 'city', 'area', 'latitude', 'longitude',
        'price_from', 'price_label', 'status', 'rejection_reason',
        'total_units', 'available_units', 'is_featured',
    ];

    protected $casts = [
        'price_from' => 'decimal:2',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_featured' => 'boolean',
        'total_units' => 'integer',
        'available_units' => 'integer',
    ];

    // ──────────────────────────────────────────────────────────────
    // Auto-generate slug from name
    // ──────────────────────────────────────────────────────────────

    protected static function booted(): void
    {
        static::creating(function (Property $property) {
            if (empty($property->slug)) {
                $property->slug = Str::slug($property->name).'-'.Str::random(5);
            }
        });
    }

    // ──────────────────────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────────────────────

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function photos()
    {
        return $this->hasMany(PropertyPhoto::class)->orderBy('sort_order');
    }

    public function coverPhoto()
    {
        return $this->hasOne(PropertyPhoto::class)->where('is_cover', true);
    }

    public function roomTypes()
    {
        return $this->hasMany(PropertyRoomType::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'property_amenity');
    }

    public function fees()
    {
        return $this->hasMany(PropertyFee::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function favouritedBy()
    {
        return $this->belongsToMany(User::class, 'favourites');
    }

    // ──────────────────────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────────────────────

    public function scopePublished($q)
    {
        return $q->where('status', 'PUBLISHED');
    }

    public function scopeOfType($q, string $type)
    {
        return $q->where('type', strtoupper($type));
    }

    public function scopeInCity($q, string $city)
    {
        return $q->where('city', 'like', "%{$city}%");
    }
}
