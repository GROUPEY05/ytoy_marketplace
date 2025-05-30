<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Commande::class, 'order');
    }
    public function index(Request $request)
    {
        $orders = Commande::where('utilisateur_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Commande::where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'adresse_livraison' => 'required|string',
            'panier_id' => 'required|exists:paniers,id',
            'montant_total' => 'required|numeric|min:0',
        ]);

        $order = Commande::create([
            'utilisateur_id' => Auth::id(),
            'adresse_livraison' => $validated['adresse_livraison'],
            'panier_id' => $validated['panier_id'],
            'montant_total' => $validated['montant_total'],
            'statut' => 'en_attente'
        ]);

        return response()->json($order, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Commande::where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:en_attente,en_cours,termine,annule'
        ]);

        $order->update(['statut' => $validated['status']]);

        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Commande::where('utilisateur_id', Auth::id())
            ->findOrFail($id);

        if ($order->statut !== 'en_attente') {
            return response()->json([
                'message' => 'Impossible d\'annuler une commande qui n\'est pas en attente'
            ], 400);
        }

        $order->update(['statut' => 'annule']);

        return response()->json(['message' => 'Commande annulée avec succès']);
    }
}
