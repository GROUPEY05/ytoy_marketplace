<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Avis;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    /**
     * Afficher la liste des avis pour les produits du vendeur
     */
    public function index(Request $request)
    {
        // Récupérer les IDs des produits du vendeur
        $productIds = Produit::where('vendeur_id', Auth::id())->pluck('id');
        
        // Requête pour récupérer les avis sur les produits du vendeur
        $query = Avis::whereIn('produit_id', $productIds)
            ->with(['user', 'produit']);
        
        // Filtre par type d'avis
        if ($request->has('filter') && !empty($request->filter)) {
            switch ($request->filter) {
                case 'positive':
                    $query->whereIn('rating', [4, 5]);
                    break;
                case 'neutral':
                    $query->where('rating', 3);
                    break;
                case 'negative':
                    $query->whereIn('rating', [1, 2]);
                    break;
                case 'unanswered':
                    $query->whereNull('vendor_reply');
                    break;
            }
        }
        
        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Pagination
        $perPage = $request->per_page ?? 10;
        $reviews = $query->paginate($perPage);
        
        // Formater les avis pour l'affichage
        $reviews->getCollection()->transform(function ($review) {
            return [
                'id' => $review->id,
                'produit_id' => $review->produit_id,
                'produit_nom' => $review->produit->titre,
                'client_id' => $review->user_id,
                'client_nom' => $review->user->prenom . ' ' . $review->user->nom,
                'rating' => $review->rating,
                'commentaire' => $review->commentaire,
                'vendor_reply' => $review->vendor_reply,
                'has_reply' => !is_null($review->vendor_reply),
                'created_at' => $review->created_at
            ];
        });
        
        // Calculer les statistiques
        $stats = [
            'average_rating' => Avis::whereIn('produit_id', $productIds)->avg('rating') ?? 0,
            'total_reviews' => Avis::whereIn('produit_id', $productIds)->count(),
            'five_stars' => Avis::whereIn('produit_id', $productIds)->where('rating', 5)->count(),
            'four_stars' => Avis::whereIn('produit_id', $productIds)->where('rating', 4)->count(),
            'three_stars' => Avis::whereIn('produit_id', $productIds)->where('rating', 3)->count(),
            'two_stars' => Avis::whereIn('produit_id', $productIds)->where('rating', 2)->count(),
            'one_star' => Avis::whereIn('produit_id', $productIds)->where('rating', 1)->count(),
        ];
        
        // Ajouter les statistiques à la réponse
        $response = $reviews->toArray();
        $response['stats'] = $stats;
        
        return response()->json($response);
    }
    
    /**
     * Répondre à un avis
     */
    public function reply(Request $request, $id)
    {
        // Validation
        $validated = $request->validate([
            'reply' => 'required|string|max:1000',
        ]);
        
        $review = Avis::with('produit')->findOrFail($id);
        
        // Vérifier que l'avis concerne un produit du vendeur
        if ($review->produit->vendeur_id !== Auth::id()) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à répondre à cet avis'], 403);
        }
        
        try {
            $review->vendor_reply = $validated['reply'];
            $review->vendor_reply_at = now();
            $review->save();
            
            return response()->json([
                'message' => 'Réponse enregistrée avec succès',
                'review' => [
                    'id' => $review->id,
                    'produit_id' => $review->produit_id,
                    'produit_nom' => $review->produit->titre,
                    'client_id' => $review->user_id,
                    'client_nom' => $review->user->prenom . ' ' . $review->user->nom,
                    'rating' => $review->rating,
                    'commentaire' => $review->commentaire,
                    'vendor_reply' => $review->vendor_reply,
                    'has_reply' => true,
                    'created_at' => $review->created_at,
                    'vendor_reply_at' => $review->vendor_reply_at
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement de la réponse',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
