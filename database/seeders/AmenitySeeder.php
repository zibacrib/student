<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AmenitySeeder extends Seeder
{
    public function run(): void
    {
        $amenities = [
            // Utilities
            ['name' => 'WiFi',           'icon' => 'wifi',          'category' => 'utilities'],
            ['name' => 'Water',          'icon' => 'droplets',      'category' => 'utilities'],
            ['name' => 'Electricity',    'icon' => 'zap',           'category' => 'utilities'],
            ['name' => 'Generator',      'icon' => 'battery-charging', 'category' => 'utilities'],
            ['name' => 'DSTV',           'icon' => 'tv',            'category' => 'utilities'],

            // Safety
            ['name' => 'Security Guard', 'icon' => 'shield',        'category' => 'safety'],
            ['name' => 'CCTV',           'icon' => 'camera',        'category' => 'safety'],
            ['name' => 'Perimeter Wall', 'icon' => 'building-2',    'category' => 'safety'],
            ['name' => 'Electric Fence', 'icon' => 'zap',           'category' => 'safety'],

            // Comfort
            ['name' => 'Air Conditioning', 'icon' => 'wind',        'category' => 'comfort'],
            ['name' => 'Furnished',        'icon' => 'sofa',        'category' => 'comfort'],
            ['name' => 'Laundry Room',     'icon' => 'washing-machine', 'category' => 'comfort'],
            ['name' => 'Parking',          'icon' => 'car',         'category' => 'comfort'],
            ['name' => 'Kitchen',          'icon' => 'utensils',    'category' => 'comfort'],
            ['name' => 'Study Room',       'icon' => 'book-open',   'category' => 'comfort'],

            // Location perks
            ['name' => 'Near University', 'icon' => 'graduation-cap', 'category' => 'location'],
            ['name' => 'Near Hospital',   'icon' => 'cross',          'category' => 'location'],
            ['name' => 'Near Shopping',   'icon' => 'shopping-bag',   'category' => 'location'],
        ];

        foreach ($amenities as $amenity) {
            DB::table('amenities')->insertOrIgnore(array_merge($amenity, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
