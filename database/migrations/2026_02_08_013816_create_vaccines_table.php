<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vaccines', function (Blueprint $table) {
            $table->id();

            $table->foreignId('pet_id')->constrained()->cascadeOnDelete();

            $table->date('date_administered');

            // ✅ dropdown choice + custom
            $table->string('vaccine_choice'); // Anti-Rabies / Other
            $table->string('custom_vaccine_name')->nullable(); // if Other
            $table->string('vaccine_name'); // final name saved

            $table->string('lot_batch_no')->nullable();
            $table->date('next_schedule')->nullable();
            $table->string('administering_personnel')->nullable();
    $table->string('vaccine_brand')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vaccines');
    }
};
