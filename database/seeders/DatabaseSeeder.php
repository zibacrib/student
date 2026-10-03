<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Seed amenities
        $this->call(AmenitySeeder::class);

        // Admin account
        User::firstOrCreate(['email' => 'admin@zibacrib.com'], [
            'name' => 'ZibaCrib Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Demo agent
        User::firstOrCreate(['email' => 'agent@zibacrib.com'], [
            'name' => 'Demo Agent',
            'password' => Hash::make('password'),
            'role' => 'agent',
            'agency_name' => 'Prime Properties',
        ]);

        // Demo student
        User::firstOrCreate(['email' => 'student@zibacrib.com'], [
            'name' => 'Demo Student',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
    }
}
