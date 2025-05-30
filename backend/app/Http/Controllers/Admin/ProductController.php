<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Produit::with(['vendeur', 'categorie']);

            // Filtrage par recherche
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Pagination
            $products = $query->orderBy('created_at', 'desc')->get();
            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des produits: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération des produits'], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Produit::with(['vendeur', 'categorie', 'images'])->findOrFail($id);
            return response()->json($product);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du produit: ' . $e->getMessage());
            return response()->json(['message' => 'Produit non trouvé'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = Produit::findOrFail($id);
            
            $validated = $request->validate([
                'nom' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'prix' => 'sometimes|numeric|min:0',
                'quantite_stock' => 'sometimes|integer|min:0',
                'categorie_id' => 'sometimes|exists:categories,id',
                'statut' => 'sometimes|in:actif,inactif'
            ]);

            $product->update($validated);
            return response()->json($product);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la mise à jour du produit: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la mise à jour du produit'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $product = Produit::findOrFail($id);
            $product->delete();
            return response()->json(['message' => 'Produit supprimé avec succès']);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la suppression du produit: ' . $e->getMessage());
            return response()->json(['message' => 'Une erreur est survenue lors de la suppression du produit'], 500);
        }
    }
} 