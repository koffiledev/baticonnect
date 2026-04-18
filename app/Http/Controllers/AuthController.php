<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //Crée un compte Particulier par défaut (Role 1)
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'telephone' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
            'required' => 'Le champ :attribute est obligatoire.'
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => 1,
        ]);

        return response()->json([
                'status' => 'success',
                'message' => 'Inscription réussie',
                    'token' => $user->createToken('auth_token')->plainTextToken,
                    'user' => ['nom' => $user->nom, 'prenom' => $user->prenom, 'role' => $user->role]
            ], 201);
    }

    //connexion
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'L\'email est obligatoire pour se connecter.',
            'password.required' => 'Le mot de passe est obligatoire.'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vérifiez votre email ou votre mot de pass de connexion'], 401);
        }

        return response()->json([
            'status' =>'success',
            'message' => 'Connexion avec succès',
            'token' => $user->createToken('auth_token')->plainTextToken,
            'user' => [
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'role' => $user->role
            ]
        ], 200);
    }

    //Passage en "Mode Artisan" (Role 2)
    
    public function switchToArtisan(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Utilisateur non reconnu. Veuillez vous reconnecter.'
            ], 401);
        }
        
        if ($user->role === 1) {
            $request->validate([
                'competences' => 'required|array',
                'rayon_action' => 'required|integer',
                'presentation' => 'required|string',
            ],[
                'competences.required' => 'Veuillez sélectionner au moins une compétence.',
                'rayon_action.required' => 'Le rayon d\'action est obligatoire.',
                'presentation.required' => 'La présentation est nécessaire pour vos futurs clients.'
            ]);

            $user->update(['role' => 2,]);


                return response()->json([
                    'status' => 'success',
                    'message' => 'Félicitations, Votre profil Artisan est désormais actif.',
                    'role' => 2
                ]);
        }

        return response()->json([
                'status' => 'info',
                'message' => 'Vous possédez déjà un profil Artisan.'
        ], 200);
    }
}
