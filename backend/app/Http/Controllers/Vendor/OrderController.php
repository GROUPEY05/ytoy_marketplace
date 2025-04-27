<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Afficher la liste des commandes du vendeur
     */
    public function index(Request $request)
    {
        // On récupère les commandes qui contiennent au moins un article du vendeur connecté
        $query = Order::whereHas('items', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendor_id', Auth::id());
            });
        })
        ->with(['customer', 'shippingAddress']);

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('order_number', 'like', "%{$searchTerm}%")
                  ->orWhereHas('customer', function ($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%");
                  });
            });
        }

        // Filtre par statut
        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->per_page ?? 10;
        $orders = $query->paginate($perPage);

        // Formater les résultats pour inclure seulement les informations pertinentes
        $orders->getCollection()->transform(function ($order) {
            // Calculer le nombre d'articles du vendeur dans cette commande
            $vendorItems = $order->items()->whereHas('produit', function ($query) {
                $query->where('vendor_id', Auth::id());
            })->get();
            
            // Calculer le montant total pour ce vendeur uniquement
            $vendorTotal = $vendorItems->sum(function ($item) {
                return $item->unit_price * $item->quantity;
            });
            
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer_name' => $order->customer->name,
                'customer_email' => $order->customer->email,
                'total_amount' => $vendorTotal,
                'item_count' => $vendorItems->count(),
                'status' => $order->status,
                'created_at' => $order->created_at,
                'invoice_id' => $order->invoice_id
            ];
        });

        return response()->json($orders);
    }

    /**
     * Afficher les détails d'une commande spécifique
     */
    public function show($id)
    {
        $order = Order::with(['customer', 'shippingAddress'])->findOrFail($id);
        
        // Vérifier que le vendeur a des articles dans cette commande
        $vendorItems = OrderItem::where('order_id', $order->id)
            ->whereHas('produit', function ($query) {
                $query->where('vendor_id', Auth::id());
            })
            ->with(['produit', 'produit.images'])
            ->get();
        
        if ($vendorItems->isEmpty()) {
            return response()->json(['message' => 'Aucun produit de ce vendeur dans cette commande'], 403);
        }
        
        // Calculer le sous-total pour ce vendeur
        $subtotal = $vendorItems->sum(function ($item) {
            return $item->unit_price * $item->quantity;
        });
        
        // Calculer les taxes proportionnelles (si applicable)
        $taxRate = $order->tax_rate ?? 0.2; // 20% par défaut
        $tax = $subtotal * $taxRate;
        
        // Si les frais de livraison sont partagés entre les vendeurs
        $totalItems = OrderItem::where('order_id', $order->id)->count();
        $vendorItemsCount = $vendorItems->count();
        $shippingCost = $order->shipping_cost * ($vendorItemsCount / $totalItems);
        
        // Formater les items pour l'affichage
        $formattedItems = $vendorItems->map(function ($item) {
            return [
                'produit_id' => $item->produit_id,
                'produit_name' => $item->produit->title,
                'produit_image' => $item->produit->images->first()->url ?? null,
                'unit_price' => $item->unit_price,
                'quantity' => $item->quantity
            ];
        });
        
        // Construire la réponse
        $response = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'customer_name' => $order->customer->name,
            'customer_email' => $order->customer->email,
            'customer_phone' => $order->customer->phone,
            'status' => $order->status,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shippingCost,
            'total_amount' => $subtotal + $tax + $shippingCost,
            'shipping_address' => $order->shippingAddress,
            'items' => $formattedItems,
            'created_at' => $order->created_at,
            'invoice_id' => $order->invoice_id
        ];
        
        return response()->json($response);
    }

    /**
     * Mettre à jour le statut d'une commande
     */
    public function updateStatus(Request $request, $id)
    {
        // Validation
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
        ]);

        $order = Order::findOrFail($id);
        
        // Vérifier que le vendeur a des articles dans cette commande
        $hasItems = OrderItem::where('order_id', $order->id)
            ->whereHas('produit', function ($query) {
                $query->where('vendor_id', Auth::id());
            })
            ->exists();
        
        if (!$hasItems) {
            return response()->json(['message' => 'Aucun produit de ce vendeur dans cette commande'], 403);
        }
        
        try {
            // Dans une marketplace multi-vendeurs, il serait plus logique d'avoir un statut par vendeur
            // Mais pour simplifier, nous mettons à jour le statut global de la commande
            $order->status = $validated['status'];
            $order->save();
            
            // Si la commande est annulée, remettre les articles en stock
            if ($validated['status'] === 'cancelled') {
                $this->restoreStock($order->id);
            }
            
            return response()->json([
                'message' => 'Statut mis à jour avec succès',
                'status' => $order->status
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remettre les produits en stock pour les commandes annulées
     */
    private function restoreStock($orderId)
    {
        // Ne restaurer le stock que pour les produits du vendeur connecté
        $orderItems = OrderItem::where('order_id', $orderId)
            ->whereHas('produit', function ($query) {
                $query->where('vendor_id', Auth::id());
            })
            ->get();
        
        foreach ($orderItems as $item) {
            $produit = Produit::find($item->produit_id);
            if ($produit) {
                $produit->stock += $item->quantity;
                $produit->save();
            }
        }
    }
}