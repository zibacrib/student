<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Photos
        Schema::create('property_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('path');              // storage path
            $table->string('caption')->nullable();
            $table->boolean('is_cover')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Amenities master list (seeded)
        Schema::create('amenities', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();    // WiFi, Water, Security, etc.
            $table->string('icon')->nullable();  // icon class/name for UI
            $table->string('category')->nullable(); // utilities, safety, comfort, etc.
            $table->timestamps();
        });

        // Pivot: which amenities a property has
        Schema::create('property_amenity', function (Blueprint $table) {
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('amenity_id')->constrained()->onDelete('cascade');
            $table->primary(['property_id', 'amenity_id']);
        });

        // Fees & what's included
        Schema::create('property_fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('label');             // e.g. "Security Deposit", "Water Bill"
            $table->decimal('amount', 10, 2)->nullable();
            $table->boolean('is_included')->default(false); // included in rent?
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_fees');
        Schema::dropIfExists('property_amenity');
        Schema::dropIfExists('amenities');
        Schema::dropIfExists('property_photos');
    }
};
