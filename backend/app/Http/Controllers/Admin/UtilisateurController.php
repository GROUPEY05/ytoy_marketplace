<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;

class UtilisateurController extends Controller
{
    /**
     * Affiche la liste de tous les utilisateurs
     */
    public function index()
    {
        try {
            $users = Utilisateur::when(request('role'), function($query, $role) {
                return $query->where('role', $role);
            })
            ->when(request('search'), function($query, $search) {
                return $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des utilisateurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function show($id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non trouvé',
                'error' => $e->getMessage()
            ], 404);
        }
    }
    
    public function update(Request $request, $id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:utilisateurs,email,'.$id,
                'role' => 'required|in:acheteur,vendeur,administrateur',
                'telephone' => 'nullable|string',
                'adresse' => 'nullable|string'
            ]);
            
            $user->update($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur mis à jour avec succès',
                'data' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function banUser($id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            $user->actif = !$user->actif;
            $user->save();
            
            $message = $user->actif ? 'Utilisateur réactivé avec succès' : 'Utilisateur désactivé avec succès';
            
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => ['actif' => $user->actif]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la modification du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        try {
            $keyword = $request->input('search');
            $users = Utilisateur::where('nom', 'like', "%$keyword%")
                          ->orWhere('prenom', 'like', "%$keyword%")
                          ->orWhere('email', 'like', "%$keyword%")
                          ->paginate(10);
            
            return response()->json([
                'success' => true,
                'data' => $users->items(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la recherche',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function destroy($id)
    {
        try {
            $user = Utilisateur::findOrFail($id);
            $user->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Utilisateur supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
