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
