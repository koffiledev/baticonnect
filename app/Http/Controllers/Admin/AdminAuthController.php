<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

     
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
               'status' => 'error',
                'message' => 'Identifiants de connexion incorrects.'
            ], 401);
        }

        if ($user->role !== 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Accès refusé. Vous n\'avez pas les droits d\'administration.'
            ], 403);
        }

       $token = $user->createToken('admin_access_token', ['admin:access'])->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Connexion réussie',
            'data' => [
                'token' => $token,
                'admin' => [
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ]
        ]);
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'telephone' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $admin = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'role' => 3, // On force le rôle Admin
        ]);

        return response()->json([
            'message' => 'Nouveau compte administrateur créé avec succès',
            'admin' => $admin
        ], 201);
    }
}
