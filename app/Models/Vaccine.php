<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vaccine extends Model
{
    protected $fillable = [
        'pet_id',
        'date_administered',
        'vaccine_choice',
        'custom_vaccine_name',
        'vaccine_name',
        'lot_batch_no',
        'next_schedule',
        'administering_personnel',
    ];

    public function pet()
    {
        return $this->belongsTo(\App\Models\Pet::class);
    }
}
