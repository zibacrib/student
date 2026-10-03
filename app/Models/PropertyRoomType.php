<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyRoomType extends Model
{
    protected $fillable = [
        'property_id',
        'type',
        'price'
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
