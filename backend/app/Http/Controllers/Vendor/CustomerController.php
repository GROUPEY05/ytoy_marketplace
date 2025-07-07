<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Afficher la liste des clients qui ont acheté des produits du vendeur
     */
    public function index(Request $request)
    {
        // Récupérer les IDs des clients qui ont acheté des produits du vendeur
        $customerIds = Commande::whereHas('items', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            });
        })
        ->pluck('utilisateur_id')
        ->unique();
        
        // Requête pour récupérer les clients avec leurs informations
        $query = User::whereIn('id', $customerIds)
            ->where('role', 'acheteur');
        
        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nom', 'like', "%{$searchTerm}%")
                  ->orWhere('prenom', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%")
                  ->orWhere('telephone', 'like', "%{$searchTerm}%");
            });
        }
        
        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);
        
        // Pagination
        $perPage = $request->per_page ?? 10;
        $customers = $query->paginate($perPage);
        
        // Enrichir les données des clients avec des informations supplémentaires
        $customers->getCollection()->transform(function ($customer) {
            // Calculer le nombre total de commandes pour ce client contenant des produits du vendeur
            $totalOrders = Commande::whereHas('items', function ($query) {
                $query->whereHas('produit', function ($query) {
                    $query->where('vendeur_id', Auth::id());
                });
            })
            ->where('utilisateur_id', $customer->id)
            ->count();
            
            // Calculer le montant total dépensé par ce client pour les produits du vendeur
            $totalSpent = DB::table('lignes_commande')
                ->join('produits', 'lignes_commande.produit_id', '=', 'produits.id')
                ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
                ->where('produits.vendeur_id', Auth::id())
                ->where('commandes.utilisateur_id', $customer->id)
                ->sum(DB::raw('lignes_commande.prix_unitaire * lignes_commande.quantite'));
            
            // Ajouter ces informations au client
            $customer->total_orders = $totalOrders;
            $customer->total_spent = $totalSpent;
            
            return $customer;
        });
        
        // Calculer les statistiques globales
        $stats = [
            'total_customers' => $customerIds->count(),
            'new_customers' => Commande::whereHas('items', function ($query) {
                $query->whereHas('produit', function ($query) {
                    $query->where('vendeur_id', Auth::id());
                });
            })
            ->where('created_at', '>=', now()->subDays(30))
            ->pluck('utilisateur_id')
            ->unique()
            ->count(),
            'returning_customers' => DB::table('commandes')
                ->join('lignes_commande', 'commandes.id', '=', 'lignes_commande.commande_id')
                ->join('produits', 'lignes_commande.produit_id', '=', 'produits.id')
                ->where('produits.vendeur_id', Auth::id())
                ->select('commandes.utilisateur_id')
                ->groupBy('commandes.utilisateur_id')
                ->havingRaw('COUNT(DISTINCT commandes.id) > 1')
                ->count(),
            'average_order_value' => DB::table('lignes_commande')
                ->join('produits', 'lignes_commande.produit_id', '=', 'produits.id')
                ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
                ->where('produits.vendeur_id', Auth::id())
                ->select('commandes.id')
                ->groupBy('commandes.id')
                ->avg(DB::raw('lignes_commande.prix_unitaire * lignes_commande.quantite'))
        ];
        
        // Ajouter les statistiques à la réponse
        $response = $customers->toArray();
        $response['stats'] = $stats;
        
        return response()->json($response);
    }
    
    /**
     * Afficher les détails d'un client spécifique
     */
    public function show($id)
    {
        $customer = User::findOrFail($id);
        
        // Vérifier que ce client a acheté des produits du vendeur
        $hasOrders = Commande::whereHas('items', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            });
        })
        ->where('utilisateur_id', $id)
        ->exists();
        
        if (!$hasOrders) {
            return response()->json(['message' => 'Ce client n\'a pas acheté vos produits'], 403);
        }
        
        // Récupérer les commandes du client contenant des produits du vendeur
        $orders = Commande::whereHas('items', function ($query) {
            $query->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            });
        })
        ->where('user_id', $id)
        ->orderBy('created_at', 'desc')
        ->get();
        
        // Calculer le montant total dépensé par ce client pour les produits du vendeur
        $totalSpent = DB::table('lignes_commande')
            ->join('produits', 'lignes_commande.produit_id', '=', 'produits.id')
            ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
            ->where('produits.vendeur_id', Auth::id())
            ->where('commandes.user_id', $id)
            ->sum(DB::raw('lignes_commande.prix_unitaire * lignes_commande.quantite'));
        
        // Formater les commandes pour l'affichage
        $formattedOrders = $orders->map(function ($order) {
            // Récupérer uniquement les articles du vendeur dans cette commande
            $vendorItems = $order->items()->whereHas('produit', function ($query) {
                $query->where('vendeur_id', Auth::id());
            })->get();
            
            // Calculer le montant total pour ce vendeur uniquement
            $vendorTotal = $vendorItems->sum(function ($item) {
                return $item->unit_price * $item->quantity;
            });
            
            return [
                'id' => $order->id,
                'commande_numero' => $order->order_number,
                'date' => $order->created_at,
                'statut' => $order->status,
                'montant' => $vendorTotal,
                'produits' => $vendorItems->count()
            ];
        });
        
        // Construire la réponse
        $response = [
            'id' => $customer->id,
            'nom' => $customer->nom,
            'prenom' => $customer->prenom,
            'email' => $customer->email,
            'telephone' => $customer->telephone,
            'created_at' => $customer->created_at,
            'total_orders' => $orders->count(),
            'total_spent' => $totalSpent,
            'orders' => $formattedOrders
        ];
        
        return response()->json($response);
    }
}
