<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Produit::with(['vendeur', 'categorie', 'images'])
                ->where('actif', true)
                ->orderBy('date_ajout', 'desc')
                ->get();

            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des produits', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la récupération des produits',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Produit::with(['vendeur', 'categorie', 'images', 'avis'])
                ->findOrFail($id);

            return response()->json($product);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération du produit', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la récupération du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 