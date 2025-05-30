<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Produit;
use App\Models\Categorie;
use App\Models\ProduitImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProduitController extends Controller  
{
    /**
     * Afficher la liste des produits du vendeur 
     */
    public function index(Request $request)
    {
        $query = Produit::where('vendeur_id', Auth::id())
            ->with(['categorie', 'images']);

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('nom', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Filtres supplémentaires si nécessaire
        if ($request->has('categorie') && !empty($request->categorie)) {
            $query->where('categorie_id', $request->categorie);
        }

        // Tri
        $sortField = $request->sort_by ?? 'created_at';
        $sortDirection = $request->sort_direction ?? 'desc';
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->per_page ?? 10;
        $produits = $query->paginate($perPage);

        // Transformer les données pour inclure les URLs complètes des images
        $produits->getCollection()->transform(function ($produit) {
            $produit->images->transform(function ($image) {
                // S'assurer que l'URL commence par /storage/
                if (!str_starts_with($image->url, '/storage/')) {
                    $image->url = '/storage/' . $image->url;
                }
                \Log::info('Image URL after transformation:', ['url' => $image->url]);
                return $image;
            });
            return $produit;
        });

        return response()->json($produits);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');
        
        // Recherche par nom de produit et catégorie
        $products = Produit::with('categorie')
            ->where('nom', 'LIKE', "%{$query}%")
            ->orWhereHas('categorie', function($q) use ($query) {
                $q->where('nom', 'LIKE', "%{$query}%");
            })
            ->get();
        
        return response()->json($products);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        $categories = Categorie::all(['id', 'nom']);
        return response()->json($categories);
    }

    /**
     * Enregistrer un nouveau produit
     */
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'quantite_stock' => 'required|integer|min:0',
            'images.*' => 'file|image|mimes:jpeg,png,jpg,gif|max:2048',
            
        ]);

        try {
            DB::beginTransaction();

            // Créer le produit
            $produit = new Produit();
            $produit->nom = $validated['nom'];
            $produit->description = $validated['description'];
            $produit->prix = $validated['prix'];
            $produit->categorie_id = $validated['categorie_id'];
            $produit->quantite_stock = $validated['quantite_stock'];
            $produit->vendeur_id = Auth::id();
            $produit->date_ajout = now();
            $produit->actif = true;
            $produit->save();

            // Traitement des images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $path = $imageFile->store('produits', 'public');
                    
                    $produitImage = new ProduitImage();
                    $produitImage->produit_id = $produit->id;
                    $produitImage->url = Storage::url($path);
                    $produitImage->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Produit créé avec succès',
                'produit' => $produit->load('images')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la création du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    

    /**
     * Afficher un produit spécifique
     */
    public function show($id)
    {
        try {
            \Log::info('Tentative de récupération du produit', ['id' => $id]);
            
            $produit = Produit::with(['vendeur', 'categorie', 'images', 'avis'])
                ->where('id', $id)
                ->first();
            
            if (!$produit) {
                \Log::warning('Produit non trouvé', ['id' => $id]);
                return response()->json([
                    'message' => 'Produit non trouvé'
                ], 404);
            }
            
            \Log::info('Produit trouvé', ['produit' => $produit]);
            return response()->json($produit);
            
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la récupération du produit', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de la récupération du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit($id)
    {
        $produit = Produit::with(['categorie', 'images'])
            ->where('vendeur_id', Auth::id())
            ->findOrFail($id);
        
        $categories = Categorie::all(['id', 'nom']);
        
        return response()->json([
            'produit' => $produit,
            'categories' => $categories
        ]);
    }

    /**
     * Mettre à jour un produit
     */
    public function update(Request $request, $id)
    {
        // Règles de validation pour chaque champ
        $rules = [
            'nom' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'prix' => 'sometimes|numeric|min:0',
            'categorie_id' => 'sometimes|exists:categories,id',
            'quantite_stock' => 'sometimes|integer|min:0',
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images_to_delete.*' => 'sometimes|exists:produit_images,id',
        ];

        // Ne valider que les champs présents dans la requête
        $validated = $request->validate($rules);

        // Vérifier que le produit appartient bien au vendeur
        $produit = Produit::where('vendeur_id', Auth::id())->findOrFail($id);

        try {
            DB::beginTransaction();

            // Mettre à jour uniquement les champs présents dans la requête
            foreach ($validated as $field => $value) {
                if ($field !== 'images' && $field !== 'images_to_delete') {
                    $produit->$field = $value;
                }
            }
            $produit->save();

            // Supprimer les images si demandé
            if ($request->has('images_to_delete') && is_array($request->images_to_delete)) {
                $imagesToDelete = ProduitImage::where('produit_id', $produit->id)
                    ->whereIn('id', $request->images_to_delete)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    // Supprimer le fichier physique
                    $filePath = str_replace('/storage/', '', $image->url);
                    if (Storage::disk('public')->exists($filePath)) {
                        Storage::disk('public')->delete($filePath);
                    }
                    
                    // Supprimer l'enregistrement
                    $image->delete();
                }
            }

            // Ajouter de nouvelles images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $path = $imageFile->store('produits', 'public');
                    
                    $produitImage = new ProduitImage();
                    $produitImage->produit_id = $produit->id;
                    $produitImage->url = Storage::url($path);
                    $produitImage->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Produit mis à jour avec succès',
                'produit' => $produit->load('images')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la mise à jour du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un produit
     */
    public function destroy($id)
    {
        // Vérifier que le produit appartient bien au vendeur
        $produit = Produit::where('vendeur_id', Auth::id())->findOrFail($id);

        try {
            DB::beginTransaction();

            // Supprimer les images associées
            $images = ProduitImage::where('produit_id', $produit->id)->get();
            foreach ($images as $image) {
                // Supprimer le fichier physique
                $filePath = str_replace('/storage/', '', $image->url);
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->delete($filePath);
                }
                
                // Supprimer l'enregistrement
                $image->delete();
            }

            // Supprimer le produit
            $produit->delete();

            DB::commit();

            return response()->json([
                'message' => 'Produit supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erreur lors de la suppression du produit',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
 * Récupérer les produits en vedette ou récents
 */
    public function getFeatured(Request $request)
    {
        $perPage = $request->per_page ?? 8;
        
        $produits = Produit::with(['images' => function ($query) {
                $query->select('id', 'produit_id', 'url')->limit(1);
            }])
            ->where('actif', true)
            ->orderBy('date_ajout', 'desc')
            ->limit($perPage)
            ->get();
        
        // Ajouter l'URL de la miniature pour faciliter l'affichage côté client
        $produits->transform(function ($produit) {
            $produit->thumbnail = $produit->images->first()->url ?? null; 
            unset($produit->images);
            return $produit;
        });
        
        return response()->json($produits);
    }

   
}