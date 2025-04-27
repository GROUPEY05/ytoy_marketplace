<?php


namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs;
}



// app/Http/Controllers/Acheteur/OrderController.php
namespace App\Http\Controllers\Acheteur;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Produit;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Order::class, 'order');
    }
    
    public function index(Request $request)
    {
        $orders = Order::where('utilisateur_id', $request->user()->id)
                ->with(['items.produit'])
                ->latest()
                ->paginate(10);
                
        return response()->json($orders);
    }
    
    public function show(Order $order)
    {
        $order->load(['items.produit', 'payment']);
        return response()->json($order);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array',
            'items.*.produit_id' => 'required|exists:produits,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);
        
        // Calculer le montant total
        $total_amount = 0;
        foreach ($validated['items'] as $item) {
            $produit = Produit::findOrFail($item['produit_id']);
            $total_amount += $produit->price * $item['quantity'];
        }
        
        // Créer la commande avec les champs présents dans fillable
        $order = Order::create([
            'utilisateur_id' => $request->user()->id,
            'status' => 'pending',
            'total_amount' => $total_amount
        ]);
        
        // Si vous voulez stocker les autres informations, il faudra ajouter ces champs au modèle
        // Pour l'instant, nous ne les incluons pas car ils ne sont pas dans $fillable
        
        // Créer les éléments de commande
        foreach ($validated['items'] as $item) {
            $produit = Produit::findOrFail($item['produit_id']);
            $order->items()->create([
                'produit_id' => $produit->id,
                'quantity' => $item['quantity'],
                'price' => $produit->price
            ]);
        }
        
        $order->load(['items.produit']);
        return response()->json([
            'success' => true,
            'message' => 'Commande créée avec succès',
            'order' => $order
        ], 201);
    }
}