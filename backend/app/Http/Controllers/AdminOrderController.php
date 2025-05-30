<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'panier'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with(['user', 'panier'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'adresse_livraison' => 'required|string',
            'panier_id' => 'required|exists:paniers,id',
            'montant_total' => 'required|numeric|min:0',
            'statut' => 'required|in:en_attente,en_cours,termine,annule'
        ]);

        $order = Order::create($validated);

        return response()->json($order, 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:en_attente,en_cours,termine,annule'
        ]);

        $order->update(['statut' => $validated['status']]);

        return response()->json($order);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['statut' => 'annule']);

        return response()->json(['message' => 'Commande annulée avec succès']);
    }
}
