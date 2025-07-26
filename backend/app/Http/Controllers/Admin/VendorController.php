<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Vendeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VendorApproved;
use App\Mail\VendorRejected;
use Illuminate\Support\Facades\Log;

class VendorController extends Controller
{
    public function pendingVendors()
    {
        try {
            Log::info('Récupération des vendeurs en attente');
            $pendingVendors = Vendeur::where('verifie', false)
                ->with('user')
                ->get();
            Log::info('Vendeurs récupérés', ['count' => $pendingVendors->count()]);

            return response()->json($pendingVendors);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des vendeurs', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Erreur lors de la récupération des vendeurs en attente',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function approveVendor($id)
    {
        $vendor = Vendeur::findOrFail($id);
        $vendor->status = 'active';
        $vendor->save();

        // Envoi d'email de notification
        Mail::to($vendor->email)->send(new VendorApproved($vendor));

        return response()->json([
            'success' => true,
            'message' => 'Vendeur approuvé avec succès'
        ]);
    }

    // Nouvelle méthode pour afficher tous les vendeurs avec pagination et recherche
    public function index(Request $request)
    {
        try {
            $query = Vendeur::query()->with('utilisateur');

            // Filtrer par statut si demandé (ex: active, rejected, etc.)
            if ($request->has('status')) {
                $query->where('status', $request->input('status'));
            }

            // Recherche par nom, email, ou autre champ lié au vendeur ou utilisateur
            if ($request->has('search')) {
                $search = $request->input('search');
                $query->whereHas('utilisateur', function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                        ->orWhere('prenom', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Pagination (10 par page par défaut)
            $vendors = $query->latest()->paginate(10);

            return response()->json([
                'success' => true,
                'data' => $vendors->items(),
                'current_page' => $vendors->currentPage(),
                'last_page' => $vendors->lastPage(),
                'per_page' => $vendors->perPage(),
                'total' => $vendors->total()
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la récupération des vendeurs', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des vendeurs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function rejectVendor($id)
    {
        $vendor = Vendeur::findOrFail($id);
        $vendor->status = 'rejected';
        $vendor->save();

        // Envoi d'email de notification
        Mail::to($vendor->email)->send(new VendorRejected($vendor));

        return response()->json([
            'success' => true,
            'message' => 'Vendeur rejeté'
        ]);
    }
}
