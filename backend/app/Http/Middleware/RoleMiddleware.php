<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        \Log::info('RoleMiddleware - Roles requis:', $roles);
        $user = Auth::user();
        
        if (!$user) {
            \Log::error('RoleMiddleware - Utilisateur non authentifié');
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        \Log::info('RoleMiddleware - Role utilisateur:', ['role' => $user->role]);

        if (!in_array($user->role, $roles)) {
            \Log::error('RoleMiddleware - Role non autorisé', [
                'user_role' => $user->role,
                'required_roles' => $roles
            ]);
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return $next($request);
    }
}