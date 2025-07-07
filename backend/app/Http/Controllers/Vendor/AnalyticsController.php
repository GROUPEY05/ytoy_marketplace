<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\LigneCommande;
use App\Models\Produit;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Récupérer les statistiques et analyses pour le vendeur
     */
    public function index(Request $request)
    {
        // Déterminer la période d'analyse
        $period = $request->period ?? 'month';
        $startDate = $this->getStartDate($period);
        
        // Récupérer les IDs des produits du vendeur
        $productIds = Produit::where('vendeur_id', Auth::id())->pluck('id');
        
        // Statistiques générales
        $totalRevenue = $this->calculateTotalRevenue($productIds, $startDate);
        $totalOrders = $this->calculateTotalOrders($productIds, $startDate);
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;
        
        // Taux de conversion (simulé - dans un vrai système, on comparerait les vues de produits aux achats)
        $conversionRate = rand(2, 8); // Simulé entre 2% et 8%
        
        // Graphique d'évolution des ventes
        $salesChart = $this->generateSalesChart($productIds, $period, $startDate);
        
        // Performance des produits (top 10)
        $productPerformance = $this->generateProductPerformance($productIds, $startDate);
        
        // Distribution par catégorie
        $categoryDistribution = $this->generateCategoryDistribution($productIds);
        
        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
            'average_order_value' => $averageOrderValue,
            'conversion_rate' => $conversionRate,
            'sales_chart' => $salesChart,
            'product_performance' => $productPerformance,
            'category_distribution' => $categoryDistribution
        ]);
    }
    
    /**
     * Déterminer la date de début en fonction de la période
     */
    private function getStartDate($period)
    {
        switch ($period) {
            case 'week':
                return Carbon::now()->subDays(7);
            case 'month':
                return Carbon::now()->subDays(30);
            case 'quarter':
                return Carbon::now()->subMonths(3);
            case 'year':
                return Carbon::now()->subYear();
            default:
                return Carbon::now()->subDays(30);
        }
    }
    
    /**
     * Calculer le chiffre d'affaires total pour la période
     */
    private function calculateTotalRevenue($productIds, $startDate)
    {
        return DB::table('lignes_commande')
            ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
            ->whereIn('lignes_commande.produit_id', $productIds)
            ->where('commandes.created_at', '>=', $startDate)
            ->where('commandes.statut', '!=', 'annulee')
            ->sum(DB::raw('lignes_commande.prix_unitaire * lignes_commande.quantite'));
    }
    
    /**
     * Calculer le nombre total de commandes pour la période
     */
    private function calculateTotalOrders($productIds, $startDate)
    {
        return Commande::whereHas('items', function ($query) use ($productIds) {
            $query->whereIn('produit_id', $productIds);
        })
        ->where('created_at', '>=', $startDate)
        ->where('statut', '!=', 'annulee')
        ->count();
    }
    
    /**
     * Générer les données pour le graphique d'évolution des ventes
     */
    private function generateSalesChart($productIds, $period, $startDate)
    {
        $format = 'Y-m-d';
        $groupBy = 'day';
        $interval = '1 day';
        
        if ($period === 'quarter') {
            $groupBy = 'week';
            $interval = '1 week';
        } elseif ($period === 'year') {
            $groupBy = 'month';
            $format = 'Y-m';
            $interval = '1 month';
        }
        
        // Générer les dates pour l'axe X
        $dates = [];
        $current = clone $startDate;
        $now = Carbon::now();
        
        while ($current <= $now) {
            $dates[] = $current->format($format);
            $current->add($interval);
        }
        
        // Récupérer les données de revenus par jour/semaine/mois
        $revenueData = DB::table('lignes_commande')
            ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
            ->whereIn('lignes_commande.produit_id', $productIds)
            ->where('commandes.created_at', '>=', $startDate)
            ->where('commandes.statut', '!=', 'annulee')
            ->select(
                DB::raw("DATE_FORMAT(commandes.created_at, '%Y-%m-%d') as date"),
                DB::raw('SUM(lignes_commande.prix_unitaire * lignes_commande.quantite) as revenue')
            )
            ->groupBy('date')
            ->get()
            ->pluck('revenue', 'date')
            ->toArray();
        
        // Récupérer les données de commandes par jour/semaine/mois
        $orderData = Commande::whereHas('items', function ($query) use ($productIds) {
            $query->whereIn('produit_id', $productIds);
        })
        ->where('created_at', '>=', $startDate)
        ->where('statut', '!=', 'annulee')
        ->select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m-%d') as date"),
            DB::raw('COUNT(*) as count')
        )
        ->groupBy('date')
        ->get()
        ->pluck('count', 'date')
        ->toArray();
        
        // Préparer les données pour le graphique
        $revenue = [];
        $orders = [];
        
        foreach ($dates as $date) {
            $revenue[] = $revenueData[$date] ?? 0;
            $orders[] = $orderData[$date] ?? 0;
        }
        
        return [
            'labels' => $dates,
            'revenue' => $revenue,
            'orders' => $orders
        ];
    }
    
    /**
     * Générer les données pour le graphique de performance des produits
     */
    private function generateProductPerformance($productIds, $startDate)
    {
        $topProducts = DB::table('lignes_commande')
            ->join('commandes', 'lignes_commande.commande_id', '=', 'commandes.id')
            ->join('produits', 'lignes_commande.produit_id', '=', 'produits.id')
            ->whereIn('lignes_commande.produit_id', $productIds)
            ->where('commandes.created_at', '>=', $startDate)
            ->where('commandes.statut', '!=', 'annulee')
            ->select(
                'produits.id',
                'produits.nom',
                DB::raw('SUM(lignes_commande.quantite) as total_quantity')
            )
            ->groupBy('produits.id', 'produits.nom')
            ->orderBy('total_quantity', 'desc')
            ->limit(10)
            ->get();

        $labels = $topProducts->pluck('nom')->toArray();
        $sales = $topProducts->pluck('total_quantity')->toArray();
        
        return [
            'labels' => $labels,
            'sales' => $sales
        ];
    }
    
    /**
     * Générer les données pour le graphique de distribution par catégorie
     */
    private function generateCategoryDistribution($productIds)
    {
        $categoryData = DB::table('produits')
            ->join('categories', 'produits.categorie_id', '=', 'categories.id')
            ->whereIn('produits.id', $productIds)
            ->select(
                'categories.id',
                'categories.nom',
                DB::raw('COUNT(produits.id) as product_count')
            )
            ->groupBy('categories.id', 'categories.nom')
            ->orderBy('product_count', 'desc')
            ->get();
        
        $labels = $categoryData->pluck('nom')->toArray();
        $values = $categoryData->pluck('product_count')->toArray();
        
        return [
            'labels' => $labels,
            'values' => $values
        ];
    }
}
