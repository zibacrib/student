<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // role: admin | agent | student
            $table->enum('role', ['admin', 'agent', 'student'])
                  ->default('student')
                  ->after('email');

            // Extra profile fields
            $table->string('phone')->nullable()->after('role');
            $table->string('avatar')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('avatar');

            // Agent-specific: suspend flag managed by admin
            $table->boolean('is_suspended')->default(false)->after('bio');

            // Agent-specific: agency/company name
            $table->string('agency_name')->nullable()->after('is_suspended');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'avatar', 'bio', 'is_suspended', 'agency_name']);
        });
    }
};
