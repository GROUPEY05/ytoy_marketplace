<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionPublicController extends Controller
{
    /**
     * Récupérer toutes les promotions actives pour la page d'accueil
     */
    public function index()
    {
        try {
            // Récupérer toutes les promotions actives
            $promotions = Promotion::where('actif', true)
                ->with(['produit', 'produit.images', 'vendeur'])
                ->get();
            
            // Grouper les promotions par type
            $groupedPromotions = $promotions->groupBy('type_promo');
            
            $formattedPromotions = [];
            
            // Mapper les types de promotions pour l'affichage
            $typeMapping = [
                'promotion' => 'Promotions !!',
                'super_deal' => 'Super Deal !!',
                'nouveau' => 'Nouveau!!!',
                'top_deal' => 'Top Deals !!',
                'le_njoh' => 'Le Njoh!!',
                'offre_special' => 'Offre Special'
            ];
            
            foreach ($typeMapping as $type => $label) {
                if (isset($groupedPromotions[$type])) {
                    $items = [];
                    
                    foreach ($groupedPromotions[$type]->take(4) as $promo) {
                        $imageUrl = null;
                        if ($promo->produit && $promo->produit->images && $promo->produit->images->count() > 0) {
                            $imageUrl = $promo->produit->images->first()->url;
                        }
                        
                        $items[] = [
                            'id' => $promo->id,
                            'titre' => $promo->titre,
                            'description' => $promo->produit ? $promo->produit->description : $promo->description,
                            'prix_normal' => (float) $promo->prix_normal,
                            'prix_promo' => (float) $promo->prix_promo,
                            'pourcentage_reduction' => (float) $promo->pourcentage_reduction,
                            'produit_id' => $promo->produit_id,
                            'produit_nom' => $promo->produit ? ($promo->produit->nom ?? $promo->produit->titre ?? '') : '',
                            'image_url' => $imageUrl,
                            'vendeur_nom' => $promo->vendeur ? $promo->vendeur->nom : ''
                        ];
                    }
                    
                    $formattedPromotions[$type] = [
                        'label' => $label,
                        'items' => $items
                    ];
                }
            }
            
            return response()->json($formattedPromotions);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur dans PromotionPublicController@index: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Retourner une réponse vide plutôt qu'une erreur 500
            return response()->json([]);
        }
    }
    
    /**
     * Récupérer les promotions d'un type spécifique
     */
    public function getByType($type)
    {
        try {
            if (!in_array($type, ['promotion', 'super_deal', 'nouveau', 'top_deal', 'le_njoh', 'offre_special'])) {
                return response()->json(['message' => 'Type de promotion invalide'], 400);
            }
            
            $promotions = Promotion::where('actif', true)
                ->where('type_promo', $type)
                ->with(['produit', 'produit.images', 'vendeur'])
                ->get();
            
            $formattedPromotions = [];
            
            foreach ($promotions as $promo) {
                $imageUrl = null;
                if ($promo->produit && $promo->produit->images && $promo->produit->images->count() > 0) {
                    $imageUrl = $promo->produit->images->first()->url;
                }
                
                $formattedPromotions[] = [
                    'id' => $promo->id,
                    'titre' => $promo->titre,
                    'description' => $promo->produit ? $promo->produit->description : $promo->description,
                    'prix_normal' => (float) $promo->prix_normal,
                    'prix_promo' => (float) $promo->prix_promo,
                    'pourcentage_reduction' => (float) $promo->pourcentage_reduction,
                    'produit_id' => $promo->produit_id,
                    'produit_nom' => $promo->produit ? ($promo->produit->nom ?? $promo->produit->titre ?? '') : '',
                    'image_url' => $imageUrl,
                    'vendeur_nom' => $promo->vendeur ? $promo->vendeur->nom : ''
                ];
            }
            
            return response()->json($formattedPromotions);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur dans PromotionPublicController@getByType: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Retourner une réponse vide plutôt qu'une erreur 500
            return response()->json([]);
        }
    }
    
    /**
     * Afficher les détails d'une promotion
     */
    public function show($id)
    {
        try {
            $promotion = Promotion::where('actif', true)
                ->with(['produit', 'produit.images', 'vendeur'])
                ->find($id);
            
            if (!$promotion) {
                return response()->json(['message' => 'Promotion non trouvée'], 404);
            }
            
            $imageUrl = null;
            if ($promotion->produit && $promotion->produit->images && $promotion->produit->images->count() > 0) {
                $imageUrl = $promotion->produit->images->first()->url;
            }
            
            $formattedPromotion = [
                'id' => $promotion->id,
                'titre' => $promotion->titre,
                'description' => $promotion->produit ? $promotion->produit->description : $promotion->description,
                'prix_normal' => (float) $promotion->prix_normal,
                'prix_promo' => (float) $promotion->prix_promo,
                'pourcentage_reduction' => (float) $promotion->pourcentage_reduction,
                'produit_id' => $promotion->produit_id,
                'produit_nom' => $promotion->produit ? ($promotion->produit->nom ?? $promotion->produit->titre ?? '') : '',
                'image_url' => $imageUrl,
                'vendeur_nom' => $promotion->vendeur ? $promotion->vendeur->nom : '',
                'type_promo' => $promotion->type_promo,
            'date_debut' => $promotion->date_debut,
            'date_fin' => $promotion->date_fin
        ];
        
        return response()->json($formattedPromotion);
        } catch (\Exception $e) {
            // Log l'erreur pour le débogage
            \Log::error('Erreur dans PromotionPublicController@show: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            // Retourner une réponse d'erreur
            return response()->json(['message' => 'Une erreur est survenue lors de la récupération de la promotion'], 500);
        }
    }
}
