<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

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
        'birth_date',
        'gender',
        'color',
        'markings',
        'confinement_status',
        'photo_path',
        'age_months',
    ];

    protected $casts = [
        'date_registered' => 'date',
        'birth_date' => 'date',
    ];
    protected $appends = ['age_label'];

    public function owner()
    {
        return $this->belongsTo(\App\Models\Owner::class);
    }

    public function vaccines()
    {
        return $this->hasMany(\App\Models\Vaccine::class);
    }

    // ✅ months/years format


    public function getAgeLabelAttribute()
    {
        if (!$this->birth_date)
            return null;

        $birth = Carbon::parse($this->birth_date)->startOfDay();
        $now = now()->startOfDay();

        if ($birth->greaterThan($now))
            return "0 days";

        $diff = $birth->diff($now); // DateInterval: y, m, d are INTEGERS

        // < 1 month -> show days
        if ($diff->y === 0 && $diff->m === 0) {
            return $diff->d . " day" . ($diff->d !== 1 ? "s" : "");
        }

        // < 1 year -> show months only
        if ($diff->y === 0) {
            return $diff->m . " month" . ($diff->m !== 1 ? "s" : "");
        }

        // years + remaining months
        $result = $diff->y . " year" . ($diff->y !== 1 ? "s" : "");
        if ($diff->m > 0) {
            $result .= " " . $diff->m . " month" . ($diff->m !== 1 ? "s" : "");
        }

        return $result;
    }



    // public function owner()
    // {
    //     return $this->belongsTo(Owner::class);
    // }

}
