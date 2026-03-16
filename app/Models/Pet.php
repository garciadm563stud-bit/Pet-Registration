<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Pet extends Model
{

    use HasFactory;
    protected $fillable = [
        'owner_id',
        'pet_uid',
        'registration_no',
        'pet_name',
        'or_number',
        'date_registered',
        'species',
        'breed',
        'age',
        'gender',
        'color',
        'markings',
        'confinement_status',
        'photo_path',
        'age_months',
        'sterilized',
    ];

    protected $casts = [
        'date_registered' => 'date',

    ];


    public function owner()
    {
        return $this->belongsTo(\App\Models\Owner::class);
    }

    public function vaccines()
    {
        return $this->hasMany(\App\Models\Vaccine::class);
    }



}
