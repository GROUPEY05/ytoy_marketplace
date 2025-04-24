<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Utilisateur;
use App\Models\Vendor;
use App\Models\Produit;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Statistiques pour le tableau de bord
        $stats = [
            'users' => Utilisateur::count(),
            'vendors' => Utilisateur::where('role', 'vendeur')->count(),
            'products' => Produit::count(),
            'orders' => Order::count(),
            'revenue' => Order::where('status', 'completed')->sum('total_amount')
        ];
        
        // Vendeurs en attente d'approbation
        $pendingVendors = Utilisateur::where('role', 'vendeur')
                            ->where('status', 'pending')
                            ->select('id', 'nom', 'nom_boutique', 'created_at as date')
                            ->latest()
                            ->take(4)
                            ->get();
        
        // Utilisateurs récents
        $recentUsers = Utilisateur::select('id', 'nom', 'email', 'role', 'created_at as date')
                         ->latest()
                         ->take(5)
                         ->get();
        
        return response()->json([
            'stats' => $stats,
            'pendingVendors' => $pendingVendors,
            'recentUsers' => $recentUsers
        ]);
    }
}
