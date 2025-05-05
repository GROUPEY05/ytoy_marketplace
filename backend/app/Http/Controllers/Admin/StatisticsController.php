<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Commande;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->input('period', 'month');
        
        // Ventes par période
        $sales = $this->getSalesByPeriod($period);
        
        // Top produits
        $topProduits = Produit::select('produit.id', 'produit.nom', DB::raw('SUM(order_items.quantity) as total_quantity'))
                        ->join('order_items', 'produit.id', '=', 'order_items.produit_id')
                        ->join('commande', 'order_items.commande_id', '=', 'orders.id')
                        ->where('orders.status', 'completed')
                        ->groupBy('produit.id', 'produit.nom')
                        ->orderByDesc('total_quantity')
                        ->limit(5)
                        ->get();
        
        // Répartition des ventes par catégorie
        $salesByCategory = Produit::select('categories.nom', DB::raw('SUM(order_items.quantity * order_items.price) as total_sales'))
                          ->join('order_items', 'produit.id', '=', 'order_items.produit_id')
                          ->join('orders', 'order_items.order_id', '=', 'orders.id')
                          ->join('categories', 'products.category_id', '=', 'categories.id')
                          ->where('orders.status', 'completed')
                          ->groupBy('categories.nom')
                          ->orderByDesc('total_sales')
                          ->get();
        
        return response()->json([
            'sales' => $sales,
            'topProduits' => $topProduits,
            'salesByCategory' => $salesByCategory
        ]);
    }
    
    private function getSalesByPeriod($period)
    {
        $today = Carbon::today();
        
        switch ($period) {
            case 'week':
                $startDate = Carbon::today()->subDays(7);
                $groupBy = 'DATE(created_at)';
                $format = 'Y-m-d';
                break;
            case 'month':
                $startDate = Carbon::today()->subDays(30);
                $groupBy = 'DATE(created_at)';
                $format = 'Y-m-d';
                break;
            case 'year':
                $startDate = Carbon::today()->subMonths(12);
                $groupBy = 'MONTH(created_at)';
                $format = 'Y-m';
                break;
            default:
                $startDate = Carbon::today()->subDays(30);
                $groupBy = 'DATE(created_at)';
                $format = 'Y-m-d';
        }
        
        $sales = Commande::select(
                DB::raw("$groupBy as date"),
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_amount) as total_sales')
            )
            ->where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw($groupBy))
            ->orderBy('date')
            ->get()
            ->map(function ($item) use ($format) {
                return [
                    'date' => Carbon::parse($item->date)->format($format),
                    'total_orders' => $item->total_orders,
                    'total_sales' => $item->total_sales
                ];
            });
            
        return $sales;
    }
}
