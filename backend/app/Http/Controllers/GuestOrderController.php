<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GuestOrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresse_livraison' => 'required|string',
            'email' => 'required|email',
            'nom' => 'required|string',
            'telephone' => 'required|string',
            'items' => 'required|array',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'montant_total' => 'required|numeric|min:0',
            'methode_paiement' => 'required|in:carte,especes,mobile_money'
        ]);

        try {
            DB::beginTransaction();

            // Créer la commande
            $order = Commande::create([
                'date_commande' => now(),
                'statut' => Commande::STATUT_EN_ATTENTE,
                'montant_total' => $validated['montant_total'],
                'adresse_livraison' => $validated['adresse_livraison'],
                'email' => $validated['email'],
                'nom' => $validated['nom'],
                'telephone' => $validated['telephone'],
                'methode_paiement' => $validated['methode_paiement']
            ]);

            // Créer les lignes de commande
            foreach ($validated['items'] as $item) {
                $produit = Produit::findOrFail($item['produit_id']);
                
                LigneCommande::create([
                    'commande_id' => $order->id,
                    'produit_id' => $produit->id,
                    'quantite' => $item['quantite'],
                    'prix_unitaire' => $produit->prix
                ]);

                // Mettre à jour le stock
                $produit->decrement('quantite_stock', $item['quantite']);
            }

            DB::commit();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('lignes.produit')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $order = Commande::with(['lignes.produit'])->findOrFail($id);
        return response()->json($order);
    }
}
