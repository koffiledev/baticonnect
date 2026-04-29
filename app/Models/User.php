<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['nom', 'prenom', 'email', 'telephone', 'password', 'role', 'competences', 'ville', 'rayon_action', 'presentation', 'experience'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
 
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'competences' => 'array',
            'rayon_action' => 'integer',
            'experience' => 'integer',
            'role' => 'integer',
            
        ];
    }
}
