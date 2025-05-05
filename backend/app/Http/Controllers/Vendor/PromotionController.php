<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PromotionController extends Controller
{
    /**
     * Afficher la liste des promotions du vendeur
     */
    public function index(Request $request)
    {
        $vendeurId = Auth::id();
        
        $query = Promotion::where('vendeur_id', $vendeurId)
            ->with(['produit', 'produit.images']);
        
        // Filtrer par type de promotion
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type_promo', $request->type);
        }
        
        // Filtrer par statut (actif/inactif)
        if ($request->has('actif')) {
            $actif = filter_var($request->actif, FILTER_VALIDATE_BOOLEAN);
            $query->where('actif', $actif);
        }
        
        // Filtrer par date (en cours, à venir, terminées)
        if ($request->has('statut')) {
            switch ($request->statut) {
                case 'en_cours':
                    $query->where('date_debut', '<=', now())
                        ->where(function ($q) {
                            $q->where('date_fin', '>=', now())
                                ->orWhereNull('date_fin');
                        });
                    break;
                case 'a_venir':
                    $query->where('date_debut', '>', now());
                    break;
                case 'terminees':
                    $query->where('date_fin', '<', now());
                    break;
            }
        }
        
        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Pagination
        $perPage = $request->per_page ?? 10;
        $promotions = $query->paginate($perPage);
        
        return response()->json($promotions);
    }
    
    /**
     * Créer une nouvelle promotion
     */
    public function store(Request $request)
    {
        $vendeurId = Auth::id();
        
        // Validation des données
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'produit_id' => 'required|exists:produits,id',
            'prix_promo' => 'required|numeric|min:0',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'type_promo' => 'required|in:promotion,super_deal,nouveau,top_deal,le_njoh,offre_special',
            'actif' => 'boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Vérifier que le produit appartient au vendeur
        $produit = Produit::findOrFail($request->produit_id);
        if ($produit->vendeur_id != $vendeurId) {
            return response()->json(['message' => 'Ce produit ne vous appartient pas'], 403);
        }
        
        // Calculer le pourcentage de réduction
        $prixNormal = $produit->prix;
        $prixPromo = $request->prix_promo;
        $pourcentageReduction = 0;
        
        if ($prixNormal > 0) {
            $pourcentageReduction = (($prixNormal - $prixPromo) / $prixNormal) * 100;
        }
        
        // Créer la promotion
        $promotion = new Promotion([
            'titre' => $request->titre,
            'description' => $request->description,
            'produit_id' => $request->produit_id,
            'prix_normal' => $prixNormal,
            'prix_promo' => $prixPromo,
            'pourcentage_reduction' => $pourcentageReduction,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'type_promo' => $request->type_promo,
            'actif' => $request->has('actif') ? $request->actif : true,
            'vendeur_id' => $vendeurId
        ]);
        
        $promotion->save();
        
        return response()->json([
            'message' => 'Promotion créée avec succès',
            'promotion' => $promotion->load('produit')
        ], 201);
    }
    
    /**
     * Afficher les détails d'une promotion
     */
    public function show($id)
    {
        $vendeurId = Auth::id();
        
        $promotion = Promotion::where('vendeur_id', $vendeurId)
            ->with(['produit', 'produit.images'])
            ->findOrFail($id);
        
        return response()->json($promotion);
    }
    
    /**
     * Mettre à jour une promotion
     */
    public function update(Request $request, $id)
    {
        $vendeurId = Auth::id();
        
        // Récupérer la promotion
        $promotion = Promotion::where('vendeur_id', $vendeurId)->findOrFail($id);
        
        // Validation des données
        $validator = Validator::make($request->all(), [
            'titre' => 'string|max:255',
            'description' => 'nullable|string',
            'prix_promo' => 'numeric|min:0',
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'type_promo' => 'in:promotion,super_deal,nouveau,top_deal,le_njoh,offre_special',
            'actif' => 'boolean'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Mettre à jour les champs
        if ($request->has('titre')) {
            $promotion->titre = $request->titre;
        }
        
        if ($request->has('description')) {
            $promotion->description = $request->description;
        }
        
        if ($request->has('prix_promo')) {
            $promotion->prix_promo = $request->prix_promo;
            
            // Recalculer le pourcentage de réduction
            if ($promotion->prix_normal > 0) {
                $promotion->pourcentage_reduction = (($promotion->prix_normal - $promotion->prix_promo) / $promotion->prix_normal) * 100;
            }
        }
        
        if ($request->has('date_debut')) {
            $promotion->date_debut = $request->date_debut;
        }
        
        if ($request->has('date_fin')) {
            $promotion->date_fin = $request->date_fin;
        }
        
        if ($request->has('type_promo')) {
            $promotion->type_promo = $request->type_promo;
        }
        
        if ($request->has('actif')) {
            $promotion->actif = $request->actif;
        }
        
        $promotion->save();
        
        return response()->json([
            'message' => 'Promotion mise à jour avec succès',
            'promotion' => $promotion->load('produit')
        ]);
    }
    
    /**
     * Supprimer une promotion
     */
    public function destroy($id)
    {
        $vendeurId = Auth::id();
        
        $promotion = Promotion::where('vendeur_id', $vendeurId)->findOrFail($id);
        $promotion->delete();
        
        return response()->json(['message' => 'Promotion supprimée avec succès']);
    }
    
    /**
     * Activer/désactiver une promotion
     */
    public function toggleStatus($id)
    {
        $vendeurId = Auth::id();
        
        $promotion = Promotion::where('vendeur_id', $vendeurId)->findOrFail($id);
        $promotion->actif = !$promotion->actif;
        $promotion->save();
        
        return response()->json([
            'message' => 'Statut de la promotion mis à jour',
            'actif' => $promotion->actif
        ]);
    }
}
