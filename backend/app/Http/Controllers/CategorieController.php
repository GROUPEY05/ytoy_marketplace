<?php

namespace App\Http\Controllers; // Ajout du namespace correct

use App\Models\Categorie; // Import du modèle Categorie
use Illuminate\Http\Request; // Import de la classe Request
use Illuminate\Support\Facades\Gate;

class CategorieController extends Controller
{
    // 🔓 Méthodes publiques (visibles par tous les utilisateurs)
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }

    // 🔐 Méthodes admin (CRUD protégées par auth + role)
    public function store(Request $request)
    {
        Gate::authorize('create', Categorie::class);

        $request->validate([
            'nom' => 'required|string|max:255',
        ]);
    
        $categorie = Categorie::create([
            'nom' => $request->nom,
        ]);
    
        return response()->json($categorie, 201);
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->update($request->only('nom'));
        return $categorie;
    }

    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();
        return response()->json(['message' => 'Catégorie supprimée']);
    }

    public function show($id)
    {
        return Categorie::findOrFail($id);
    }
}
