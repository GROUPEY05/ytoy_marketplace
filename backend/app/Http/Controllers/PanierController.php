<?php

namespace App\Http\Controllers;

use App\Models\Panier;
use App\Models\Produit;
use App\Models\ProduitImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class PanierController extends Controller
{
    public function index()
    {
        try {
            Log::info('Début de la requête panier');
            
            $user = request()->user();
            if (!$user) {
                Log::warning('Tentative d\'accès au panier sans authentification');
                return response()->json([
                    'message' => 'Vous devez être connecté pour accéder au panier'
                ], 401);
            }

            
            Log::info('Utilisateur authentifié', ['user_id' => $user->id]);

            try {
                $cart = Panier::where('utilisateur_id', $user->id)->first();
                
                if (!$cart) {
                    Log::info('Panier non trouvé, création d\'un nouveau panier');
                    $cart = Panier::create([
                        'utilisateur_id' => $user->id
                    ]);
                }

                Log::info('Panier récupéré', ['panier_id' => $cart->id]);
                
                // Récupération des produits avec leurs images
                $products = $cart->produits()->with('images')->get();
                Log::info('Produits récupérés', [
                    'nombre_produits' => $products->count(),
                    'produits' => $products->toArray()
                ]);

                return response()->json([
                    'produits' => $products
                ]);
            } catch (\Exception $e) {
                Log::error('Erreur lors de la récupération du panier', [
                    'error' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

        } catch (\Exception $e) {
            Log::error('Erreur critique lors de la récupération du panier', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération du panier',
                'error' => $e->getMessage()
            ], 500);
        }
    }

   

    public function add(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté pour ajouter au panier'
            ], 401);
        }

        $product = Produit::with('images')->findOrFail($request->produit_id);
        Log::info('Produit trouvé: ' . $product->nom);
        if ($product->quantite_stock < $request->quantite) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Panier::firstOrCreate([
            'utilisateur_id' => $user->id
        ]);

        try {
            $cart->produits()->syncWithoutDetaching([
                $request->produit_id => [
                    'quantite' => $request->quantite,
                    'prix_unitaire' => $product->prix
                ]
            ]);

            return response()->json([
                'message' => 'Produit ajouté au panier',
                'produit' => $product
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'ajout au panier: ' . $e->getMessage());
            return response()->json([
                'message' => 'Erreur lors de l\'ajout au panier: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantite' => 'required|integer|min:1'
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté pour mettre à jour la quantité'
            ], 401);
        }

        $product = Produit::findOrFail($request->produit_id);
        
        if ($product->quantite_stock < $request->quantite) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Panier::where('utilisateur_id', $user->id)->firstOrFail();
        
        $cart->produits()->updateExistingPivot($request->produit_id, [
            'quantite' => $request->quantite
        ]);

        return response()->json([
            'message' => 'Quantité mise à jour'
        ]);
    }

    public function remove($productId)
    {
        $user = request()->user();
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté pour retirer un produit du panier'
            ], 401);
        }

        $cart = Panier::where('utilisateur_id', $user->id)->firstOrFail();
        
        $cart->produits()->detach($productId);

        return response()->json([
            'message' => 'Produit retiré du panier'
        ]);
    }

    public function clear()
    {
        $user = request()->user();
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté pour vider le panier'
            ], 401);
        }

        $cart = Panier::where('utilisateur_id', $user->id)->first();
        
        if ($cart) {
            $cart->produits()->detach();
        }

        return response()->json([
            'message' => 'Panier vidé avec succès'
        ]);
    }

    public function getCount()
    {
        try {
            $user = request()->user();
            if (!$user) {
                return response()->json(['count' => 0]);
            }

            $cart = Panier::where('utilisateur_id', $user->id)->first();
            if (!$cart) {
                return response()->json(['count' => 0]);
            }

            $count = $cart->produits()->sum('paniers_produit.quantite');
            return response()->json(['count' => $count]);
        } catch (\Exception $e) {
            Log::error('Erreur lors du comptage des articles du panier', [
                'error' => $e->getMessage()
            ]);
            return response()->json(['count' => 0]);
        }
    }
    
    public function checkout(Request $request)
    {
        try {
            // Valider les données de la requête
            $validated = $request->validate([
                'adresse_livraison' => 'required|string',
                'phone' => 'required|string',
                'notes' => 'nullable|string',
            ]);
            
            // Récupérer l'utilisateur authentifié
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Vous devez être connecté pour passer une commande'
                ], 401);
            }
            
            // Récupérer le panier de l'utilisateur
            $panier = Panier::where('utilisateur_id', $user->id)->first();
            if (!$panier || $panier->produits()->count() === 0) {
                return response()->json([
                    'message' => 'Votre panier est vide'
                ], 400);
            }
            
            // Calculer le montant total de la commande
            $montant_total = 0;
            $produits = $panier->produits()->with('images')->get();
            foreach ($produits as $produit) {
                $montant_total += $produit->prix * $produit->pivot->quantite;
            }
            
            // Créer la commande
            $commande = \App\Models\Commande::create([
                'utilisateur_id' => $user->id,
                'statut' => 'en_attente',
                'montant_total' => $montant_total,
                'adresse_livraison' => $validated['adresse_livraison'],
                'date_commande' => now()
            ]);
            
            // Créer les lignes de commande à partir des produits du panier
            foreach ($produits as $produit) {
                $commande->lignes()->create([
                    'produit_id' => $produit->id,
                    'quantite' => $produit->pivot->quantite,
                    'prix_unitaire' => $produit->prix,
                    'panier_id' => $panier->id
                ]);
            }
            
            // Vider le panier après la création de la commande
            $panier->produits()->detach();
            
            // Retourner la commande créée
            return response()->json([
                'success' => true,
                'message' => 'Commande créée avec succès',
                'commande' => $commande->load('lignes.produit.images')
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la commande', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Une erreur est survenue lors de la création de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Récupère l'historique des commandes de l'utilisateur connecté
     */
    public function orders(Request $request)
    {
        try {
            // Récupérer l'utilisateur authentifié
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'message' => 'Vous devez être connecté pour voir vos commandes'
                ], 401);
            }
            
            // Récupérer les commandes de l'utilisateur
            $commandes = \App\Models\Commande::where('utilisateur_id', $user->id)
                ->with(['lignes.produit.images'])  // Inclure les images des produits
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json($commandes);
            
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des commandes', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Une erreur est survenue lors de la récupération des commandes',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}