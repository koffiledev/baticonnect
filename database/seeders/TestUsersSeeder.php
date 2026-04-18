<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Création de l'ADMIN
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'nom' => 'Admin',
                'prenom' => 'admin',
                'telephone' => '01010101',
                'password' => Hash::make('admin123'),
                'role' => 3,
                'remember_token' => Str::random(10)
            ]
        );

        // 2. Création d'un Client
        User::firstOrCreate(
            ['email' => 'client@gmail.com'],
            [
                'nom' => 'Koffi',
                'prenom' => 'jean',
                'telephone' => '02020202',
                'password' => Hash::make('client123'),
                'role' => 1,
                'remember_token' => Str::random(10)
            ]
        );

        // 3. Création d'un Artisan
        User::firstOrCreate(
            ['email' => 'artisan@gmail.com'],
            [
                'nom' => 'Ami',
                'prenom' => 'luc',
                'telephone' => '03030303',
                'password' => Hash::make('artisan123'),
                'role' => 2,
                'remember_token' => Str::random(10)
            ]
        );
    }
}