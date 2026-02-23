<?php

namespace Database\Seeders;

use App\Models\Owner;
use App\Models\Pet;
use Illuminate\Database\Seeder;

class PetSeeder extends Seeder
{
    public function run(): void
    {
        if (Owner::count() === 0) {
            $this->call(OwnerSeeder::class);
        }

        $targetPets = 5;
        $created = 0;

        $owners = Owner::all();

        foreach ($owners as $owner) {

            if ($created >= $targetPets)
                break;

            $petsForThisOwner = rand(1, 4);

            if ($created + $petsForThisOwner > $targetPets) {
                $petsForThisOwner = $targetPets - $created;
            }

            Pet::factory()
                ->count($petsForThisOwner)
                ->create([
                    'owner_id' => $owner->id,
                ]);

            $created += $petsForThisOwner;
        }

        while ($created < $targetPets) {
            Pet::factory()->create([
                'owner_id' => $owners->random()->id,
            ]);
            $created++;
        }
    }
}
