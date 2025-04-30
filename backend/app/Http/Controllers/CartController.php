<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::where('utilisateur_id', Auth::id())
            ->with(['produits' => function ($query) {
                $query->select('produits.id', 'nom', 'prix', 'quantite_stock', 'images');
            }])
            ->first();

        if (!$cart) {
            return response()->json([]);
        }

        return response()->json($cart->produits);
    }

    public function add(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Produit::findOrFail($request->produit_id);
        
        if ($product->quantite_stock < $request->quantity) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Cart::firstOrCreate([
            'utilisateur_id' => Auth::id()
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
            'produit_id' => 'required|exists:produits,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Produit::findOrFail($request->produit_id);
        
        if ($product->quantite_stock < $request->quantity) {
            return response()->json([
                'message' => 'Stock insuffisant'
            ], 400);
        }

        $cart = Cart::where('utilisateur_id', Auth::id())->firstOrFail();
        
        $cart->produits()->updateExistingPivot($request->produit_id, [
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Quantité mise à jour'
        ]);
    }

    public function remove($productId)
    {
        $cart = Cart::where('utilisateur_id', Auth::id())->firstOrFail();
        
        $cart->products()->detach($productId);

        return response()->json([
            'message' => 'Produit retiré du panier'
        ]);
    }
}
