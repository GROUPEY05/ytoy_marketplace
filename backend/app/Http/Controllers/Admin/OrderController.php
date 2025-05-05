<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Commande::with(['utilisateur'])
                    ->latest()
                    ->paginate(10);
                    
        return response()->json($orders);
    }
    
    public function show($id)
    {
        $order = Commande::with(['items.produit', 'utilisateur', 'payment'])
                ->findOrFail($id);
                
        return response()->json($order);
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
