<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Campagne;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class CampagneController extends Controller
{
    
    public function index()
    {
        $campagnes = Campagne::where('vendeur_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($campagnes);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'target_platforms' => 'required|array',
            'target_platforms.*' => 'in:facebook,instagram,twitter,tiktok',
            'produit_images' => 'required|array',
            'produit_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'produit_descriptions' => 'required|array',
            'produit_prix' => 'required|array',
            'produit_prix.*' => 'numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Upload images
        $uploadedImages = [];
        if ($request->hasFile('produit_images')) {
            foreach ($request->file('produit_images') as $image) {
                $path = $image->store('campagne-images', 'public');
                $uploadedImages[] = $path;
            }
        }

        $campagne = Campagne::create([
            'vendeur_id' => Auth::id(),
            'titre' => $request->titre,
            'description' => $request->description,
            'budget' => $request->budget,
            'target_platforms' => $request->target_platforms,
            'produit_images' => $uploadedImages,
            'produit_descriptions' => $request->produit_descriptions,
            'produit_prix' => $request->produit_prix,
            'status' => Campagne::STATUS_PENDING
        ]);

        return response()->json([
            'message' => 'Campagne créée avec succès',
            'campagne' => $campagne
        ], 201);
    }

    public function show(Campagne $campagne)
    {
        if ($campagne->vendeur_id !== Auth::id()) {
            return response()->json(['error' => 'Non autorisé'], 403);
        }

        return response()->json($campagne);
    }

    // Admin methods
    public function adminIndex()
    {
        $campagnes = Campagne::with('vendeur')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($campagnes);
    }

    public function updateStatus(Request $request, Campagne $campagne)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected,active,completed',
            'admin_notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $campagne->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes
        ]);

        return response()->json([
            'message' => 'Statut de la campagne mis à jour',
            'campagne' => $campagne
        ]);
    }
}
