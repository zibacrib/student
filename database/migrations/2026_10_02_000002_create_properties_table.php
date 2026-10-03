<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('users')->onDelete('cascade');

            // Core info
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('type', ['HOSTEL', 'APARTMENT', 'OFFICE']);
            $table->text('description')->nullable();

            // Location
            $table->string('address');
            $table->string('city');
            $table->string('area')->nullable();       // neighbourhood/campus-adjacent area
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();

            // Pricing
            $table->decimal('price_from', 10, 2);     // lowest unit/bed price
            $table->string('price_label')->default('per month');

            // Listing status
            $table->enum('status', ['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED'])->default('DRAFT');
            $table->text('rejection_reason')->nullable();

            // Metadata
            $table->integer('total_units')->default(0);
            $table->integer('available_units')->default(0);
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'type', 'city']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
