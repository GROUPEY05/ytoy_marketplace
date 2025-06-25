<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\Utilisateur;
use App\Models\Vendor;
use App\Models\Produit;
use App\Models\Commande;
use App\Models\Avis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            if (!$user) {
                \Log::error('Aucun utilisateur authentifié');
                return response()->json(['error' => 'Non authentifié'], 401);
            }
            \Log::info('Utilisateur authentifié:', ['id' => $user->id, 'role' => $user->role]);
            if ($user->role !== 'administrateur') {
                \Log::error('Utilisateur non administrateur:', ['role' => $user->role]);
                return response()->json(['error' => 'Accès non autorisé'], 403);
            }
            \Log::info('Début de la récupération des statistiques');
            // Statistiques pour le tableau de bord
            \Log::info('Début du calcul des statistiques');
            \Log::info('Calcul du nombre d\'utilisateurs...');
            $totalUsers = Utilisateur::count();
            
            \Log::info('Calcul du nombre de vendeurs...');
            $totalVendors = Utilisateur::where('role', 'vendeur')->count();
            
            \Log::info('Calcul du nombre de produits...');
            $totalProducts = Produit::count();
            
            \Log::info('Calcul du nombre de commandes...');
            $totalOrders = Commande::count();
            
            \Log::info('Calcul du revenu...');
            $totalRevenue = DB::table('commandes')
                             ->whereIn('statut', ['livree', 'expediee'])
                             ->sum('montant_total') ?? 0;
            
            \Log::info('Calcul des commandes récentes...');
            $recentOrdersCount = Commande::whereDate('created_at', today())->count();
            
            \Log::info('Calcul des commandes en attente...');
            $pendingOrdersCount = Commande::where('statut', 'en_attente')->count();
            
            \Log::info('Calcul des produits actifs...');
            $activeProductsCount = Produit::where('actif', true)->count();
            
            \Log::info('Calcul des vendeurs en attente...');
            $pendingVendorsCount = Utilisateur::where('role', 'vendeur')
                                           ->where('actif', false)
                                           ->count();
            
            $stats = [
                'users' => $totalUsers,
                'vendors' => $totalVendors,
                'products' => $totalProducts,
                'orders' => $totalOrders,
                'revenue' => $totalRevenue,
                'recent_orders' => $recentOrdersCount,
                'pending_orders' => $pendingOrdersCount,
                'active_products' => $activeProductsCount,
                'pending_vendors' => $pendingVendorsCount
            ];
            
            \Log::info('Toutes les statistiques ont été calculées avec succès');
        
        // Vendeurs en attente d'approbation
        $pendingVendors = Utilisateur::where('role', 'vendeur')
                            ->where('actif', false)
                            ->select('id', 'nom', 'prenom', 'email', 'created_at as date')
                            ->latest()
                            ->take(5)
                            ->get();
        
        // Utilisateurs récents
        $recentUsers = Utilisateur::select('id', 'nom', 'prenom', 'email', 'role', 'created_at as date')
                         ->whereDate('created_at', '>=', now()->subDays(7))
                         ->latest()
                         ->take(5)
                         ->get();
        
        return response()->json([
            'stats' => $stats,
            'pendingVendors' => $pendingVendors,
            'recentUsers' => $recentUsers
        ]);
        } catch (\Exception $e) {
            \Log::error('Erreur dans le dashboard admin: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
