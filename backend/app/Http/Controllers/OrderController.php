<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::where('user_id', Auth::id())
            ->with(['items.product'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'payment_method' => 'required|in:card,cash'
        ]);

        $cart = Cart::where('user_id', Auth::id())
            ->with('products')
            ->firstOrFail();

        if ($cart->products->isEmpty()) {
            return response()->json([
                'message' => 'Le panier est vide'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Créer la commande
            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
                'total' => $cart->products->sum(function ($product) {
                    return $product->price * $product->pivot->quantity;
                })
            ]);

            // Ajouter les produits à la commande
            foreach ($cart->products as $product) {
                if ($product->stock < $product->pivot->quantity) {
                    throw new \Exception("Stock insuffisant pour {$product->title}");
                }

                // Créer l'item de commande
                $order->items()->create([
                    'product_id' => $product->id,
                    'quantity' => $product->pivot->quantity,
                    'price' => $product->price
                ]);

                // Mettre à jour le stock
                $product->decrement('stock', $product->pivot->quantity);
            }

            // Vider le panier
            $cart->products()->detach();

            DB::commit();

            return response()->json([
                'message' => 'Commande créée avec succès',
                'order' => $order->load('items.product')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
