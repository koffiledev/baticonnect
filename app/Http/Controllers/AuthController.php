<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    //Crée un compte Particulier par défaut (Role 1)
    public function register(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'telephone' => 'required|string|unique:users,telephone',
            'password' => [
                    'required',
                    'string',
                    'confirmed',
                    Password::min(8)->letters()->numbers(),
],
        ], [
            'email.unique' => 'Cet email est déjà utilisé.',
            'required' => 'Le champ :attribute est obligatoire.',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé.',
        ]);

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => 1,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
                'status' => 'success',
                'message' => 'Inscription réussie',
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => ['nom' => $user->nom, 'prenom' => $user->prenom, 'role' => $user->role]
            ], 201);
    }

    //connexion
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->numbers() 
            ],
        ], [
            'email.required' => 'L\'email est obligatoire pour se connecter.',
            'password.required' => 'Le mot de passe est obligatoire.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vérifiez votre email ou votre mot de pass de connexion'], 401);
        }

        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' =>'success',
            'message' => 'Connexion avec succès',
            'access_token' => $token,
            'token_type' => 'Bearer',
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
            $validatedData = $request->validate([
                'competences' => 'required|array',
                'ville' => 'required|string',
                'rayon_action' => 'required|integer',
                'presentation' => 'required|string',
                'experience' => 'required|integer',
            ],[
                'competences.required' => 'Veuillez sélectionner au moins une compétence.',
                'ville.required' => 'La ville est obligatoire.',
                'rayon_action.required' => 'Le rayon d\'action est obligatoire.',
                'presentation.required' => 'La présentation est nécessaire pour vos futurs clients.',
                'experience.required' => 'L\'expérience est obligatoire.',
            ]);

            $user->update(array_merge($validatedData, ['role' => 2]));


                return response()->json([
                    'status' => 'success',
                    'message' => 'Félicitations, Votre profil Artisan est désormais actif.',
                    'user' => $user
                ]);
        }

        return response()->json([
                'status' => 'info',
                'message' => 'Vous possédez déjà un profil Artisan.'
        ], 400);
    }
}
