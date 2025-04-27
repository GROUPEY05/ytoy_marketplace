<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Retourne les statistiques du tableau de bord.
     */
    public function stats()
    {
        // Exemple de données simulées
        $stats = [
            'total_orders' => 120,
            'total_revenue' => 15000.75,
            'pending_orders' => 5,
        ];

        return response()->json($stats);
    }
}
