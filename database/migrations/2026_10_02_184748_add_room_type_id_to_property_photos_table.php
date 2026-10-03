<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('property_photos', function (Blueprint $table) {
            $table->foreignId('property_room_type_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('property_photos', function (Blueprint $table) {
            $table->dropForeign(['property_room_type_id']);
            $table->dropColumn('property_room_type_id');
        });
    }
};
