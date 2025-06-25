<?php
namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

use App\Models\Produit; // Import du modèle Produit

class CategoriePublicController extends Controller
{
    /**
     * Retourne toutes les catégories pour l'affichage public
     * Cet endpoint ne nécessite pas d'authentification
     */
    public function index(Request $request)
    {
        $query = Categorie::query();

        // Inclure le comptage des produits si demandé
        if ($request->has('with_count') && $request->with_count) {
            $query->withCount('produits');
        }

        // Trier les catégories par nom
        $categories = $query->orderBy('nom')->get();

        return response()->json($categories);
    }

    public function show($id)
    {
        $categorie = Categorie::findOrFail($id);
        return response()->json($categorie);
    }
    public function showByNom($nom)
    {
        $categorie = Categorie::where('nom', $nom)->first();

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        return response()->json($categorie);
    }
    public function getProduitsByNom($nom, Request $request)
    {
        $categorie = Categorie::where('nom', $nom)->first();

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie non trouvée'], 404);
        }

        // Réutiliser la logique existante
        return $this->getProduits($categorie->id, $request);
    }

    /**
     * Récupérer tous les produits d'une catégorie spécifique
     */
    public function getProduits($id, Request $request)
    {
        $categorie = Categorie::findOrFail($id);

        $query = Produit::with([
            'images' => function ($query) {
                $query->select('id', 'produit_id', 'url')->limit(1);
            }
        ])
            ->where('categorie_id', $id)
            ->where('actif', true); // Seulement les produits actifs

        // Filtres supplémentaires si nécessaire
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nom', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->per_page ?? 12;
        $produits = $query->paginate($perPage);

        // Ajouter l'URL de la miniature pour faciliter l'affichage côté client
        $produits->getCollection()->transform(function ($produit) {
            $produit->thumbnail = $produit->images->first()->url ?? null;
            unset($produit->images);
            return $produit;
        });

        return response()->json([
            'categorie' => $categorie,
            'produits' => $produits
        ]);
    }
    /**
     * Récupérer 04 produits d'une catégorie spécifique qui seront affichés sur la page d'accueil
     */
    public function categoriesAvecProduits()
    {
        $categories = Categorie::with([
            'produits' => function ($query) {
                $query->select('id', 'nom', 'prix', 'categorie_id');
            },
            'produits.thumbnail'  // Charger la relation thumbnail des produits
        ])->get();

        return response()->json($categories);
    }

}