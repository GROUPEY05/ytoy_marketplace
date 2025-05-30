<?php

namespace App\Http\Controllers;

use App\Models\Vendeur;
use App\Models\Produit;
use App\Models\Avis;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    public function show($id)
    {
        $vendeur = Vendeur::with([
            'utilisateur',
            'avis' => function($query) {
                $query->with('client')->latest();
            }
        ])->findOrFail($id);

        // Calculer la moyenne des avis
        $moyenneAvis = $vendeur->avis->avg('rating') ?? 0;
        $nombreAvis = $vendeur->avis->count();

        return response()->json([
            'nom_boutique' => $vendeur->nom_boutique,
            'description' => $vendeur->description,
            'ville' => $vendeur->ville,
            'verifie' => $vendeur->verifie,
            'date_verification' => $vendeur->date_verification,
            'moyenne_avis' => $moyenneAvis,
            'nombre_avis' => $nombreAvis,
            'avis' => $vendeur->avis->map(function($avis) {
                return [
                    'id' => $avis->id,
                    'client' => [
                        'nom' => $avis->client->nom . ' ' . $avis->client->prenom,
                    ],
                    'rating' => $avis->rating,
                    'commentaire' => $avis->commentaire,
                    'created_at' => $avis->created_at
                ];
            })
        ]);
    }

    public function index()
    {
        $vendeurs = Vendeur::with([
            'utilisateur',
            'produits' => function($query) {
                $query->select('id', 'nom_boutique', 'description', 'ville', 'verifie', );
            }
        ])
        ->select('id', 'nom_boutique', 'description', 'ville', 'verifie', 'logo')
        ->where('verifie', true)
        ->orderBy('nom_boutique')
        ->paginate(12);

        return response()->json($vendeurs);
    }

    public function products($id)
    {
        $products = Produit::where('vendeur_id', $id)
            ->with(['images', 'categorie'])
            ->paginate(12);

        return response()->json($products);
    }
}
