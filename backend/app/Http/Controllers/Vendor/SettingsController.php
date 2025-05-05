<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Vendeur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SettingsController extends Controller
{
    /**
     * Récupérer les paramètres du vendeur
     */
    public function index()
    {
        $user = Auth::user();
        $vendeur = $user->vendeur;
        
        if (!$vendeur) {
            return response()->json(['message' => 'Profil vendeur non trouvé'], 404);
        }
        
        // Récupérer les paramètres de paiement
        $payment = json_decode($vendeur->payment_settings ?? '{}');
        
        // Récupérer les paramètres de notification
        $notifications = json_decode($vendeur->notification_settings ?? '{}');
        
        return response()->json([
            'profile' => [
                'nom_boutique' => $vendeur->nom_boutique,
                'description' => $vendeur->description,
                'email' => $user->email,
                'telephone' => $user->telephone,
                'adresse' => $vendeur->adresse,
                'ville' => $vendeur->ville,
                'code_postal' => $vendeur->code_postal,
                'pays' => $vendeur->pays,
                'logo_url' => $vendeur->logo ? Storage::url($vendeur->logo) : null,
                'banner_url' => $vendeur->banner ? Storage::url($vendeur->banner) : null
            ],
            'payment' => $payment,
            'notifications' => $notifications
        ]);
    }
    
    /**
     * Mettre à jour les paramètres du vendeur
     */
    public function update(Request $request)
    {
        $user = Auth::user();
        $vendeur = $user->vendeur;
        
        if (!$vendeur) {
            return response()->json(['message' => 'Profil vendeur non trouvé'], 404);
        }
        
        // Valider les données du profil
        $validator = Validator::make($request->all(), [
            'nom_boutique' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'required|email|max:255',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:255',
            'ville' => 'nullable|string|max:100',
            'code_postal' => 'nullable|string|max:20',
            'pays' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:2048',
            'payment' => 'nullable|json',
            'notifications' => 'nullable|json'
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        
        // Mettre à jour les informations de l'utilisateur
        $user->email = $request->email;
        $user->telephone = $request->telephone;
        $user->save();
        
        // Mettre à jour les informations du vendeur
        $vendeur->nom_boutique = $request->nom_boutique;
        $vendeur->description = $request->description;
        $vendeur->adresse = $request->adresse;
        $vendeur->ville = $request->ville;
        $vendeur->code_postal = $request->code_postal;
        $vendeur->pays = $request->pays;
        
        // Traiter le logo
        if ($request->hasFile('logo')) {
            // Supprimer l'ancien logo s'il existe
            if ($vendeur->logo) {
                Storage::delete($vendeur->logo);
            }
            
            // Stocker le nouveau logo
            $logoPath = $request->file('logo')->store('public/vendeurs/logos');
            $vendeur->logo = $logoPath;
        }
        
        // Traiter la bannière
        if ($request->hasFile('banner')) {
            // Supprimer l'ancienne bannière si elle existe
            if ($vendeur->banner) {
                Storage::delete($vendeur->banner);
            }
            
            // Stocker la nouvelle bannière
            $bannerPath = $request->file('banner')->store('public/vendeurs/banners');
            $vendeur->banner = $bannerPath;
        }
        
        // Mettre à jour les paramètres de paiement
        if ($request->has('payment')) {
            $vendeur->payment_settings = $request->payment;
        }
        
        // Mettre à jour les paramètres de notification
        if ($request->has('notifications')) {
            $vendeur->notification_settings = $request->notifications;
        }
        
        $vendeur->save();
        
        // Récupérer l'utilisateur mis à jour avec son profil vendeur
        $updatedUser = User::with('vendeur')->find($user->id);
        
        return response()->json([
            'message' => 'Paramètres mis à jour avec succès',
            'user' => $updatedUser
        ]);
    }
}
