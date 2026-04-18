<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, int $role): Response
    {
        //Vérifier si l'utilisateur est connecté
        if (!$request->user()) {
            return response()->json(['message' => 'Non authentifié'], 401);
        }

        
        if ($request->user()->role !== $role) {
            return response()->json([
                'message' => 'Accès refusé : vous n\'avez pas le rôle nécessaire.'
            ], 403);
        }

        return $next($request);
    }
}