<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Panier;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Commande::where('utilisateur_id', Auth::id())
            ->with(['items.produit']);

        // Filtrage par statut
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filtrage par date
        if ($request->has('date_debut')) {
            $query->whereDate('created_at', '>=', $request->date_debut);
        }
        if ($request->has('date_fin')) {
            $query->whereDate('created_at', '<=', $request->date_fin);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }
    
    public function show($id)
    {
        $order = Commande::where('utilisateur_id', Auth::id())
            ->with(['items.produit'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'adresse_livraison' => 'required|string',
            'methode_paiement' => 'required|in:carte,especes,mobile_money'
        ]);

        $cart = Panier::where('utilisateur_id', Auth::id())
            ->with('produits')
            ->firstOrFail();

        if ($cart->produits->isEmpty()) {
            return response()->json([
                'message' => 'Le panier est vide'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Créer la commande
            $order = Commande::create([
                'utilisateur_id' => Auth::id(),
                'status' => 'en_attente',
                'adresse_livraison' => $request->adresse_livraison,
                'methode_paiement' => $request->methode_paiement,
                'total' => $cart->produits->sum(function ($produit) {
                    return $produit->prix * $produit->pivot->quantite;
                })
            ]);

            // Ajouter les produits à la commande
            foreach ($cart->produits as $produit) {
                if ($produit->quantite_stock < $produit->pivot->quantite) {
                    throw new \Exception("Stock insuffisant pour {$produit->nom}");
                }

                // Créer l'item de commande
                $order->items()->create([
                    'produit_id' => $produit->id,
                    'quantite' => $produit->pivot->quantite,
                    'prix_unitaire' => $produit->prix
                ]);

                // Mettre à jour le stock
                $produit->decrement('quantite_stock', $produit->pivot->quantite);
            }

            // Vider le panier
            $cart->produits()->detach();

            DB::commit();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'commande' => $order->load('items.produit')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function cancel($id)
    {
        $order = Commande::where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        if (!in_array($order->status, ['en_attente', 'confirme'])) {
            return response()->json([
                'message' => 'Cette commande ne peut plus être annulée'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Remettre les produits en stock
            foreach ($order->items as $item) {
                $item->produit->increment('quantite_stock', $item->quantite);
            }

            $order->update(['status' => 'annule']);

            DB::commit();

            return response()->json([
                'message' => 'Commande annulée avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:en_attente,confirme,en_preparation,expedie,livre,annule'
        ]);

        $order = Commande::where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        // Vérifier les transitions de statut valides
        $validTransitions = [
            'en_attente' => ['confirme', 'annule'],
            'confirme' => ['en_preparation', 'annule'],
            'en_preparation' => ['expedie'],
            'expedie' => ['livre'],
            'livre' => [],
            'annule' => []
        ];

        if (!in_array($request->status, $validTransitions[$order->status])) {
            return response()->json([
                'message' => 'Transition de statut non autorisée'
            ], 400);
        }

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut de la commande mis à jour',
            'commande' => $order->load('items.produit')
        ]);
    }
    
    public function update(Request $request, $id)
    {
        $order = Commande::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded'
        ]);
        
        $order->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Statut de commande mis à jour avec succès',
            'order' => $order
        ]);
    }
}
