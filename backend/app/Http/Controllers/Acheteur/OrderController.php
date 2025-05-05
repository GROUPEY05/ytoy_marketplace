<?php


// app/Http/Controllers/Acheteur/OrderController.php
namespace App\Http\Controllers\Acheteur;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\Panier;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Commande::class, 'order');
    }
    
    public function index(Request $request)
    {
        $orders = Commande::where('utilisateur_id', $request->user()->id)
                ->with(['lignes.produit'])
                ->latest()
                ->paginate(10);
                
        return response()->json($orders);
    }
    
    public function show(Commande $order)
    {
        $order->load(['lignes.produit', 'paiements']);
        return response()->json($order);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresse_livraison' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'panier_id' => 'required|exists:paniers,id'
        ]);
        
        // Récupérer le panier
        $panier = Panier::findOrFail($validated['panier_id']);
        
        // Calculer le montant total
        $montant_total = 0;
        foreach ($validated['items'] as $item) {
            $produit = Produit::findOrFail($item['produit_id']);
            $montant_total += $produit->prix * $item['quantite'];
        }
        
        // Créer la commande avec les champs présents dans fillable
        $order = Commande::create([
            'utilisateur_id' => $request->user()->id,
            'statut' => 'en_attente',
            'montant_total' => $montant_total,
            'adresse_livraison' => $validated['adresse_livraison'],
            'date_commande' => now()
        ]);
        
        // Créer les lignes de commande
        foreach ($validated['items'] as $item) {
            $produit = Produit::findOrFail($item['produit_id']);
            $order->lignes()->create([
                'produit_id' => $produit->id,
                'quantite' => $item['quantite'],
                'prix_unitaire' => $produit->prix,
                'panier_id' => $validated['panier_id']
            ]);
        }
        
        $order->load(['lignes.produit']);
        return response()->json([
            'success' => true,
            'message' => 'Commande créée avec succès',
            'order' => $order
        ], 201);
    }
}