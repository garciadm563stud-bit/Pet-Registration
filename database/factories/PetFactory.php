<?php

namespace Database\Factories;

use App\Models\Pet;
use App\Models\Owner;
use Illuminate\Database\Eloquent\Factories\Factory;

class PetFactory extends Factory
{
    protected $model = Pet::class;

    public function definition(): array
    {
        $species = $this->faker->randomElement(['Dog', 'Cat']);
        $year = date('Y');

        $petNames = [
            'Bantay',
            'Brownie',
            'Muning',
            'Tiger',
            'Lucky',
            'Bruno',
            'Choco',
            'Milo',
            'Bubbles',
            'Coco',
            'Kopi',
            'Simba',
            'Oreo',
            'Snowy',
            'Blackie',
            'Tisay',
            'Rocky',
            'Shadow',
            'Princess',
            'Pogi'
        ];

        $breedsDog = ['Aspin', 'Shih Tzu', 'Labrador', 'Golden Retriever', 'Chihuahua', 'Poodle'];
        $breedsCat = ['Puspin', 'Siamese', 'Persian', 'Bengal'];

        return [
            'owner_id' => Owner::inRandomOrder()->first()->id ?? 1,

            'pet_uid' => strtoupper($species) . '-' . $year . '-' . $this->faker->unique()->numberBetween(10000, 99999),

            'registration_no' => $year . '-' . $this->faker->unique()->numberBetween(10000, 99999),

            'pet_name' => $this->faker->randomElement($petNames),

            'or_number' => $this->faker->optional()->numerify('OR-#####'),

            'date_registered' => now(),

            'species' => $species,

            'breed' => $species == 'Dog'
                ? $this->faker->randomElement($breedsDog)
                : $this->faker->randomElement($breedsCat),

            'birth_date' => $this->faker->dateTimeBetween('-5 years', '-2 months'),

            'gender' => $this->faker->randomElement(['Male', 'Female']),

            'color' => $this->faker->randomElement(['Brown', 'Black', 'White', 'Golden', 'Gray']),

            'markings' => $this->faker->optional()->randomElement(['With spot', 'None', 'Striped']),

            'confinement_status' => $this->faker->randomElement(['Bound', 'Sometimes', 'Free']),

            'photo_path' => null,
        ];
    }
}
