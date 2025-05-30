<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdministrateurMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Vérifiez si l'utilisateur est un administrateur
        if (auth()->check() && auth()->user()->role === 'administrateur') {


            \Log::info('Accès administrateur accordé à l\'utilisateur: ' . auth()->user()->id);
            return $next($request);
        }

        return response()->json(['error' => 'Accès non autorisé'], 403);
    }
}