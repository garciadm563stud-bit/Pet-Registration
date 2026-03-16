<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {

            $table->id();

            // Link to Owner
            $table->foreignId('owner_id')
                ->constrained('owners')
                ->cascadeOnDelete();

            // CUSTOM IDENTIFIERS
            $table->string('pet_uid')->unique();           // DOG-2026-00001 or CAT-2026-00001
            $table->string('registration_no')->unique();   // 2026-00001 (global per year)

            // BASIC DETAILS
            $table->string('pet_name');
            $table->string('or_number')->nullable();       // Paid Under OR No
            $table->date('date_registered');

            // OFFICIAL FIELDS
            $table->enum('species', ['Dog', 'Cat']);
            $table->string('breed')->nullable();


            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->string('color')->nullable();
            $table->string('markings')->nullable();
            $table->string('age')->nullable();
            $table->enum('confinement_status', ['Bound', 'Sometimes', 'Free'])->nullable();
$table->string('sterilized')->nullable();
            // PET PHOTO
            $table->string('photo_path')->nullable();

            $table->timestamps();

            // ✅ indexes (recommended)
            $table->index(['pet_name']);
            $table->index(['pet_uid']);
            $table->index(['species']);
            $table->index(['breed']);
            $table->index(['date_registered']);
            
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};
