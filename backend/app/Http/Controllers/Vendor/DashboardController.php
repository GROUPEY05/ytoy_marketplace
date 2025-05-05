<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\User;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Retourne les statistiques du tableau de bord.
     */
    public function getStats()
    {
        $vendeurId = Auth::id();
        
        // Nombre total de produits du vendeur
        $totalProducts = Produit::where('vendeur_id', $vendeurId)->count();
        
        // Commandes contenant des produits du vendeur
        $commandes = Commande::whereHas('lignes', function($query) use ($vendeurId) {
            $query->whereHas('produit', function($q) use ($vendeurId) {
                $q->where('vendeur_id', $vendeurId);
            });
        })->get();
        
        $totalOrders = $commandes->count();
        
        // Calculer le revenu total du vendeur
        $totalRevenue = 0;
        foreach ($commandes as $commande) {
            $lignes = $commande->lignes()->whereHas('produit', function($q) use ($vendeurId) {
                $q->where('vendeur_id', $vendeurId);
            })->get();
            
            foreach ($lignes as $ligne) {
                $totalRevenue += $ligne->prix_unitaire * $ligne->quantite;
            }
        }
        
        // Commandes en attente
        $pendingOrders = Commande::where('statut', 'en_attente')
            ->whereHas('lignes', function($query) use ($vendeurId) {
                $query->whereHas('produit', function($q) use ($vendeurId) {
                    $q->where('vendeur_id', $vendeurId);
                });
            })->count();
        
        // Ventes récentes (30 derniers jours)
        $recentSales = Commande::where('created_at', '>=', Carbon::now()->subDays(30))
            ->whereHas('lignes', function($query) use ($vendeurId) {
                $query->whereHas('produit', function($q) use ($vendeurId) {
                    $q->where('vendeur_id', $vendeurId);
                });
            })->count();
        
        $stats = [
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_revenue' => $totalRevenue,
            'pending_orders' => $pendingOrders,
            'recent_sales' => $recentSales
        ];

        return response()->json($stats);
    }
    
    /**
     * Récupère les commandes récentes pour le dashboard
     */
    public function getRecentOrders()
    {
        $vendeurId = Auth::id();
        
        // Log pour débogage
        \Log::info('Récupération des commandes récentes pour le vendeur ID: ' . $vendeurId);
        
        $commandes = Commande::whereHas('lignes', function($query) use ($vendeurId) {
            $query->whereHas('produit', function($q) use ($vendeurId) {
                $q->where('vendeur_id', $vendeurId);
            });
        })
        ->with(['utilisateur', 'user', 'lignes.produit'])
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();
        
        \Log::info('Nombre de commandes trouvées: ' . $commandes->count());
        
        $formattedOrders = $commandes->map(function($commande) use ($vendeurId) {
            // Calculer le montant total pour ce vendeur uniquement
            $montantVendeur = 0;
            foreach ($commande->lignes as $ligne) {
                if ($ligne->produit && $ligne->produit->vendeur_id == $vendeurId) {
                    $montantVendeur += $ligne->prix_unitaire * $ligne->quantite;
                }
            }
            
            // Convertir le statut en format lisible
            $statusMap = [
                'en_attente' => 'En attente',
                'validee' => 'Validée',
                'en_preparation' => 'En préparation',
                'expediee' => 'Expédiée',
                'livree' => 'Livrée',
                'annulee' => 'Annulée'
            ];
            
            $status = isset($statusMap[$commande->statut]) ? $statusMap[$commande->statut] : $commande->statut;
            
            // Déterminer le nom du client
            $customerName = 'Client';
            if ($commande->utilisateur) {
                $customerName = $commande->utilisateur->prenom . ' ' . $commande->utilisateur->nom;
            } elseif ($commande->user) {
                $customerName = $commande->user->name ?: ($commande->user->prenom . ' ' . $commande->user->nom);
            }
            
            // Format attendu par le frontend
            return [
                'id' => $commande->id,
                'customer' => $customerName,
                'date' => $commande->created_at->format('d/m/Y'),
                'status' => $status,
                'total' => $montantVendeur
            ];
        });
        
        \Log::info('Données formatées: ' . json_encode($formattedOrders));
        
        return response()->json($formattedOrders);
    }
    
    /**
     * Récupère les produits les plus vendus
     */
    public function getTopProducts()
    {
        $vendeurId = Auth::id();
        
        $topProducts = Produit::where('vendeur_id', $vendeurId)
            ->withCount(['lignes as ventes_totales' => function($query) {
                $query->select(DB::raw('SUM(quantite)'));
            }])
            ->with('images')
            ->orderBy('ventes_totales', 'desc')
            ->take(5)
            ->get()
            ->map(function($produit) {
                return [
                    'id' => $produit->id,
                    'nom' => $produit->nom,
                    'prix' => $produit->prix,
                    'ventes' => $produit->ventes_totales ?: 0,
                    'image' => $produit->images->first() ? $produit->images->first()->url : null
                ];
            });
        
        return response()->json($topProducts);
    }
    
    /**
     * Récupère les revenus par période
     */
    public function getRevenue(Request $request)
    {
        $vendeurId = Auth::id();
        $period = $request->input('period', 'month'); // 'week', 'month', 'year'
        
        $startDate = null;
        $groupFormat = null;
        
        switch ($period) {
            case 'week':
                $startDate = Carbon::now()->subDays(7);
                $groupFormat = 'Y-m-d';
                break;
            case 'month':
                $startDate = Carbon::now()->subDays(30);
                $groupFormat = 'Y-m-d';
                break;
            case 'year':
                $startDate = Carbon::now()->subYear();
                $groupFormat = 'Y-m';
                break;
            default:
                $startDate = Carbon::now()->subDays(30);
                $groupFormat = 'Y-m-d';
        }
        
        // Récupérer toutes les commandes avec des produits du vendeur dans la période
        $commandes = Commande::where('created_at', '>=', $startDate)
            ->whereHas('lignes', function($query) use ($vendeurId) {
                $query->whereHas('produit', function($q) use ($vendeurId) {
                    $q->where('vendeur_id', $vendeurId);
                });
            })
            ->with(['lignes' => function($query) use ($vendeurId) {
                $query->whereHas('produit', function($q) use ($vendeurId) {
                    $q->where('vendeur_id', $vendeurId);
                });
            }, 'lignes.produit'])
            ->get();
        
        // Grouper les revenus par jour/mois
        $revenueData = [];
        
        foreach ($commandes as $commande) {
            $date = $commande->created_at->format($groupFormat);
            
            if (!isset($revenueData[$date])) {
                $revenueData[$date] = 0;
            }
            
            foreach ($commande->lignes as $ligne) {
                $revenueData[$date] += $ligne->prix_unitaire * $ligne->quantite;
            }
        }
        
        // Formater pour le frontend
        $formattedData = [];
        foreach ($revenueData as $date => $amount) {
            $formattedData[] = [
                'date' => $date,
                'amount' => $amount
            ];
        }
        
        // Trier par date
        usort($formattedData, function($a, $b) {
            return strcmp($a['date'], $b['date']);
        });
        
        return response()->json($formattedData);
    }
}
