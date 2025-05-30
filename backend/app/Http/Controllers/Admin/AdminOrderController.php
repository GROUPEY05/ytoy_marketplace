<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Commande::with(['utilisateur', 'lignes.produit'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Commande::with(['utilisateur', 'lignes.produit'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'utilisateur_id' => 'required|exists:users,id',
            'adresse_livraison' => 'required|string',
            'panier_id' => 'required|exists:paniers,id',
            'montant_total' => 'required|numeric|min:0',
            'statut' => 'required|in:en_attente,en_cours,termine,annule'
        ]);

        $order = Commande::create($validated);

        return response()->json($order, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Commande::findOrFail($id);

        $validated = $request->validate([
            'statut' => 'required|in:en_attente,en_cours,termine,annule'
        ]);

        $order->update(['statut' => $validated['statut']]);

        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Commande::findOrFail($id);
        $order->update(['statut' => 'annule']);

        return response()->json(['message' => 'Commande annulée avec succès']);
    }
}
