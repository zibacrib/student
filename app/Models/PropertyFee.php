<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyFee extends Model
{
    protected $fillable = ['property_id', 'label', 'amount', 'is_included', 'notes'];

    protected $casts = [
        'amount'      => 'decimal:2',
        'is_included' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
