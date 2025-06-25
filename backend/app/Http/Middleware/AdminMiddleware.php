<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        \Log::info('AdminMiddleware - User:', ['user' => $request->user()]);
        if (!$request->user() || $request->user()->role !== 'administrateur') {
            \Log::warning('Accès refusé - Role:', ['role' => $request->user() ? $request->user()->role : 'non authentifié']);
            return response()->json(['message' => 'Accès non autorisé. Vous devez être administrateur.', 'role' => $request->user() ? $request->user()->role : 'non authentifié'], 403);
        }

        return $next($request);
    }
}
