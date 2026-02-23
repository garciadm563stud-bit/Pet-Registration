<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Owner extends Model
{

    use HasFactory;
    protected $fillable = [
        'owner_uid',
        'first_name',
        'middle_name',
        'last_name',
        'address',
        'barangay',
        'civil_status',
        'sex',
        'contact_number',
        'photo_path',
    ];

    public function pets(): HasMany
    {
        return $this->hasMany(Pet::class);
    }
}
