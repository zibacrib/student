<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role',
        'phone', 'avatar', 'bio', 'is_suspended', 'agency_name',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'is_suspended'      => 'boolean',
    ];

    // ──────────────────────────────────────────────────────────────
    // Role helpers
    // ──────────────────────────────────────────────────────────────

    public function isAdmin(): bool   { return $this->role === 'admin'; }
    public function isAgent(): bool   { return $this->role === 'agent'; }
    public function isStudent(): bool { return $this->role === 'student'; }

    // ──────────────────────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────────────────────

    /** Properties listed by this agent */
    public function properties()
    {
        return $this->hasMany(Property::class, 'agent_id');
    }

    public function favourites()
    {
        return $this->hasMany(Favourite::class);
    }

    public function enquiries()
    {
        return $this->hasMany(Enquiry::class);
    }

    public function favouriteProperties()
    {
        return $this->belongsToMany(Property::class, 'favourites');
    }
}
