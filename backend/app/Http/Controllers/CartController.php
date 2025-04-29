<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())
            ->with(['products' => function ($query) {
                $query->select('products.id', 'title', 'price', 'stock', 'images');
            }])
            ->first();

        if (!$cart) {
            return response()->json([]);
        }

        return response()->json($cart->products);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Cart::firstOrCreate([
            'user_id' => Auth::id()
        ]);

        $cart->products()->syncWithoutDetaching([
            $request->product_id => ['quantity' => $request->quantity]
        ]);

        return response()->json([
            'message' => 'Produit ajouté au panier'
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($request->product_id);
        
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Cart::where('user_id', Auth::id())->firstOrFail();
        
        $cart->products()->updateExistingPivot($request->product_id, [
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Quantité mise à jour'
        ]);
    }

    public function remove($productId)
    {
        $cart = Cart::where('user_id', Auth::id())->firstOrFail();
        
        $cart->products()->detach($productId);

        return response()->json([
            'message' => 'Produit retiré du panier'
        ]);
    }
}
