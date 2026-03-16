<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\Owner;
use App\Models\Pet;
use App\Models\Vaccine;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {

        $barangays = [
            'Alibago',
            'Balingueo',
            'Banaoang',
            'Banzal',
            'Botao',
            'Cablong',
            'Carusocan',
            'Dalongue',
            'Erfe',
            'Gueguesangen',
            'Leet',
            'Malanay',
            'Maningding',
            'Maronong',
            'Maticmatic',
            'Minien East',
            'Minien West',
            'Nilombot',
            'Patayac',
            'Payas',
            'Poblacion Norte',
            'Poblacion Sur',
            'Primicias',
            'Sapang',
            'Sonquil',
            'Tebag East',
            'Tebag West',
            'Tuliao',
            'Ventinilla',
            'Villa ph. 112',
            'Camella'
        ];

        $breedsDog = [
            'Aspin',
            'Shih Tzu',
            'Labrador',
            'Golden Retriever',
            'Pomeranian',
            'Chihuahua',
            'Bulldog'
        ];

        $breedsCat = [
            'Puspin',
            'Persian',
            'Siamese',
            'Maine Coon',
            'Bengal',
            'British Shorthair'
        ];

        $vaccines = [
            'Anti-Rabies',
            '5-in-1 (DHPP)',
            '6-in-1 (DHPPiL)',
            'Parvo',
            'Distemper',
            'Feline 3-in-1 (FVRCP)',
            'Feline Leukemia (FeLV)'
        ];

        $currentYear = now()->year;

        $ownerCounter = 1;

        foreach ($barangays as $barangay) {

            $petsCreated = 0;

            while ($petsCreated < 160) {

                $owner = Owner::create([
                    'owner_uid' => 'OWNER-' . $currentYear . '-' . str_pad($ownerCounter++, 5, '0', STR_PAD_LEFT),

                    'first_name' => fake()->firstName(),
                    'middle_name' => fake()->optional()->firstName(),
                    'last_name' => fake()->lastName(),

                    'address' => fake()->streetAddress(),
                    'barangay' => $barangay,

                    'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed']),
                    'sex' => fake()->randomElement(['Male', 'Female']),

                    'contact_number' => '09' . fake()->numberBetween(100000000, 999999999),

                    'photo_path' =>
                        'https://randomuser.me/api/portraits/' .
                        (rand(0, 1) ? 'men' : 'women') .
                        '/' . rand(1, 99) . '.jpg'
                ]);

                $petCount = rand(3, 5);

                for ($p = 0; $p < $petCount; $p++) {

                    if ($petsCreated >= 160)
                        break;

                    $species = fake()->randomElement(['Dog', 'Cat']);

                    $breed = $species === 'Dog'
                        ? fake()->randomElement($breedsDog)
                        : fake()->randomElement($breedsCat);

                    $petPhoto = $species === 'Dog'
                        ? 'https://place.dog/200/200?random=' . rand(1, 100000)
                        : 'https://cataas.com/cat?width=200&height=200&random=' . rand(1, 100000);

                    $pet = Pet::create([
                        'owner_id' => $owner->id,

                        'pet_uid' => ($species === 'Dog' ? 'DOG' : 'CAT')
                            . '-' . $currentYear . '-' . Str::random(5),

                        'registration_no' => $currentYear . '-' . Str::random(6),

                        'pet_name' => fake()->firstName(),
                        'or_number' => rand(10000, 99999),

                        'date_registered' => fake()->dateTimeBetween('-1 year', 'now'),

                        'species' => $species,
                        'breed' => $breed,

                        'gender' => fake()->randomElement(['Male', 'Female']),
                        'color' => fake()->safeColorName(),
                        'markings' => fake()->optional()->word(),

                        'age' => rand(1, 10) . ' years',

                        'confinement_status' => fake()->randomElement([
                            'Bound',
                            'Sometimes',
                            'Free'
                        ]),

                        'sterilized' => fake()->randomElement(['Yes', 'No']),

                        'photo_path' => $petPhoto
                    ]);

                    $year = fake()->randomElement([2026, 2027]);

                    Vaccine::create([
                        'pet_id' => $pet->id,

                        'date_administered' => Carbon::create($year, rand(1, 12), rand(1, 28)),

                        'vaccine_choice' => 'Anti-Rabies',
                        'custom_vaccine_name' => null,

                        'vaccine_name' => fake()->randomElement($vaccines),

                        'lot_batch_no' => strtoupper(Str::random(6)),

                        'next_schedule' => Carbon::create($year + 1, rand(1, 12), rand(1, 28)),

                        'administering_personnel' => fake()->name(),

                        'vaccine_brand' => fake()->randomElement([
                            'Pfizer Vet',
                            'Zoetis',
                            'Boehringer',
                            'Nobivac'
                        ])
                    ]);

                    $petsCreated++;
                }
            }
        }
    }
    // public function run(): void
    // {

    //     $barangays = [
    //         'Alibago',
    //         'Balingueo',
    //         'Banaoang',
    //         'Banzal',
    //         'Botao',
    //         'Cablong',
    //         'Carusocan',
    //         'Dalongue',
    //         'Erfe',
    //         'Gueguesangen',
    //         'Leet',
    //         'Malanay',
    //         'Maningding',
    //         'Maronong',
    //         'Maticmatic',
    //         'Minien East',
    //         'Minien West',
    //         'Nilombot',
    //         'Patayac',
    //         'Payas',
    //         'Poblacion Norte',
    //         'Poblacion Sur',
    //         'Primicias',
    //         'Sapang',
    //         'Sonquil',
    //         'Tebag East',
    //         'Tebag West',
    //         'Tuliao',
    //         'Ventinilla',
    //         'Villa ph. 112',
    //         'Camella'
    //     ];

    //     $breedsDog = [
    //         'Aspin',
    //         'Shih Tzu',
    //         'Labrador',
    //         'Golden Retriever',
    //         'Pomeranian',
    //         'Chihuahua',
    //         'Bulldog'
    //     ];

    //     $breedsCat = [
    //         'Puspin',
    //         'Persian',
    //         'Siamese',
    //         'Maine Coon',
    //         'Bengal',
    //         'British Shorthair'
    //     ];

    //     $vaccines = [
    //         'Anti-Rabies',
    //         '5-in-1 (DHPP)',
    //         '6-in-1 (DHPPiL)',
    //         'Parvo',
    //         'Distemper',
    //         'Feline 3-in-1 (FVRCP)',
    //         'Feline Leukemia (FeLV)'
    //     ];

    //     $currentYear = now()->year;
    //     $ownerCounter = 1;

    //     foreach ($barangays as $barangay) {

    //         $ownersPerBrgy = rand(30, 40);

    //         for ($o = 0; $o < $ownersPerBrgy; $o++) {

    //             $owner = Owner::create([
    //                 'owner_uid' => 'OWNER-' . $currentYear . '-' . str_pad($ownerCounter++, 5, '0', STR_PAD_LEFT),

    //                 'first_name' => fake()->firstName(),
    //                 'middle_name' => fake()->optional()->firstName(),
    //                 'last_name' => fake()->lastName(),

    //                 'address' => fake()->streetAddress(),
    //                 'barangay' => $barangay,

    //                 'civil_status' => fake()->randomElement(['Single', 'Married', 'Widowed']),
    //                 'sex' => fake()->randomElement(['Male', 'Female']),

    //                 'contact_number' => '09' . fake()->numberBetween(100000000, 999999999),

    //                 // OWNER IMAGE
    //                 'photo_path' =>
    //                     'https://randomuser.me/api/portraits/' .
    //                     (rand(0, 1) ? 'men' : 'women') .
    //                     '/' . rand(1, 99) . '.jpg'
    //             ]);


    //             $petCount = rand(3, 5);

    //             for ($p = 0; $p < $petCount; $p++) {

    //                 $species = fake()->randomElement(['Dog', 'Cat']);

    //                 $breed = $species === 'Dog'
    //                     ? fake()->randomElement($breedsDog)
    //                     : fake()->randomElement($breedsCat);

    //                 // ONLY DOG OR CAT IMAGES
    //                 $petPhoto = $species === 'Dog'
    //                     ? 'https://place.dog/200/200?random=' . rand(1, 100000)
    //                     : 'https://cataas.com/cat?width=200&height=200&random=' . rand(1, 100000);

    //                 $pet = Pet::create([
    //                     'owner_id' => $owner->id,

    //                     'pet_uid' => ($species === 'Dog' ? 'DOG' : 'CAT')
    //                         . '-' . $currentYear . '-' . Str::random(5),

    //                     'registration_no' => $currentYear . '-' . Str::random(6),

    //                     'pet_name' => fake()->firstName(),
    //                     'or_number' => rand(10000, 99999),

    //                     'date_registered' => fake()->dateTimeBetween('-1 year', 'now'),

    //                     'species' => $species,
    //                     'breed' => $breed,

    //                     'gender' => fake()->randomElement(['Male', 'Female']),
    //                     'color' => fake()->safeColorName(),
    //                     'markings' => fake()->optional()->word(),

    //                     'age' => rand(1, 10) . ' years',

    //                     'confinement_status' => fake()->randomElement([
    //                         'Bound',
    //                         'Sometimes',
    //                         'Free'
    //                     ]),

    //                     'sterilized' => fake()->randomElement(['Yes', 'No']),

    //                     'photo_path' => $petPhoto
    //                 ]);

    //                 $year = fake()->randomElement([2026, 2027]);

    //                 Vaccine::create([
    //                     'pet_id' => $pet->id,

    //                     'date_administered' => Carbon::create($year, rand(1, 12), rand(1, 28)),

    //                     'vaccine_choice' => 'Anti-Rabies',
    //                     'custom_vaccine_name' => null,

    //                     'vaccine_name' => fake()->randomElement($vaccines),

    //                     'lot_batch_no' => strtoupper(Str::random(6)),

    //                     'next_schedule' => Carbon::create($year + 1, rand(1, 12), rand(1, 28)),

    //                     'administering_personnel' => fake()->name(),

    //                     'vaccine_brand' => fake()->randomElement([
    //                         'Pfizer Vet',
    //                         'Zoetis',
    //                         'Boehringer',
    //                         'Nobivac'
    //                     ])
    //                 ]);

    //             }

    //         }

    //     }

    // }
}