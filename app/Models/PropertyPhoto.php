<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyPhoto extends Model
{
    protected $fillable = ['property_id', 'property_room_type_id', 'path', 'caption', 'is_cover', 'sort_order'];

    protected $casts = ['is_cover' => 'boolean'];

    protected $appends = ['url'];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->path);
    }

    public function roomType()
    {
        return $this->belongsTo(PropertyRoomType::class, 'property_room_type_id');
    }
}
