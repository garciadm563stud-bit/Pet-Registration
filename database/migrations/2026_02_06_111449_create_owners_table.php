<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('owners', function (Blueprint $table) {
            $table->id(); // internal pk
            $table->string('owner_uid')->unique(); // ✅ OWNER-YYYY-00001

            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');

            $table->string('address');
            $table->string('barangay');     // dropdown
            $table->string('civil_status'); // dropdown
            $table->string('sex');          // dropdown

            $table->string('contact_number')->nullable();
            $table->string('photo_path')->nullable();

            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owners');
    }
};
