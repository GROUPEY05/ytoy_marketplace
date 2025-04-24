<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Utilisateur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\VendorApproved;
use App\Mail\VendorRejected;

class VendorController extends Controller
{
    public function pendingVendors()
    {
        $pendingVendors = Utilisateur::where('role', 'vendeur')
                            ->where('status', 'pending')
                            ->select('id', 'nom', 'nom_boutique', 'created_at as date')
                            ->latest()
                            ->get();
        
        return response()->json($pendingVendors);
    }
    
    public function approveVendor($id)
    {
        $vendor = Utilisateur::findOrFail($id);
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
        $vendor = Utilisateur::findOrFail($id);
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
