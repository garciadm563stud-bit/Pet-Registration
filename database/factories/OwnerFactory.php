<?php

namespace Database\Factories;

use App\Models\Owner;
use Illuminate\Database\Eloquent\Factories\Factory;

class OwnerFactory extends Factory
{
    protected $model = Owner::class;

    public function definition(): array
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
            'Ventinilla'
        ];

        $firstNames = [
            'Juan',
            'Jose',
            'Maria',
            'Ana',
            'Pedro',
            'Miguel',
            'Carlo',
            'Ramon',
            'Andres',
            'Gabriel',
            'Mark',
            'Angela',
            'Joy',
            'Grace',
            'Liza',
            'Marites',
            'Rodel',
            'Jomar',
            'Bryan',
            'Kevin',
            'Kimberly',
            'Joshua',
            'Christian'
        ];

        $lastNames = [
            'Santos',
            'Reyes',
            'Cruz',
            'Bautista',
            'Garcia',
            'Mendoza',
            'Torres',
            'Aquino',
            'Ramos',
            'Fernandez',
            'Villanueva',
            'Gonzales',
            'Lopez',
            'Castro',
            'Domingo',
            'Rivera',
            'Mercado',
            'Flores',
            'Perez',
            'Morales'
        ];

        return [
            'owner_uid' => 'OWNER-' . date('Y') . '-' . $this->faker->unique()->numberBetween(10000, 99999),

            'first_name' => $this->faker->randomElement($firstNames),
            'middle_name' => $this->faker->optional()->randomElement($lastNames),
            'last_name' => $this->faker->randomElement($lastNames),

            'address' => $this->faker->buildingNumber() . ' ' . $this->faker->streetName(),

            'barangay' => $this->faker->randomElement($barangays),

            'civil_status' => $this->faker->randomElement(['Single', 'Married', 'Widowed', 'Separated']),

            'sex' => $this->faker->randomElement(['Male', 'Female']),

            'contact_number' => '09' . $this->faker->numberBetween(100000000, 999999999),

            'photo_path' => null,   // 👈 manual upload later
        ];
    }
}
