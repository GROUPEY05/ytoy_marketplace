<?php

namespace App\Http\Controllers\Vendor;

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
        $query = Produit::where('vendor_id', Auth::id())
            ->with(['categorie', 'images' => function ($query) {
                $query->select('id', 'produit_id', 'url')->limit(1);
            }]);

        // Recherche
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', "%{$searchTerm}%")
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
        $products = $query->paginate($perPage);

        // Ajouter l'URL de la miniature pour faciliter l'affichage côté client
        $products->getCollection()->transform(function ($product) {
            $product->thumbnail = $product->images->first()->url ?? null;
            unset($product->images);
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Afficher le formulaire de création
     */
    public function create()
    {
        $categories = Categorie::all(['id', 'name']);
        return response()->json($categories);
    }

    /**
     * Enregistrer un nouveau produit
     */
    public function store(Request $request)
    {
        // Validation
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'categorie_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'images.*' => 'file|image|mimes:jpeg,png,jpg,gif|max:2048',
            
        ]);

        try {
            DB::beginTransaction();

            // Créer le produit
            $produit = new Produit();
            $produit->title = $validated['title'];
            $produit->description = $validated['description'];
            $produit->price = $validated['price'];
            $produit->categorie_id = $validated['categorie_id'];
            $produit->stock = $validated['stock'];
            $produit->vendor_id = Auth::id();
            $produit->slug = Str::slug($validated['title']) . '-' . Str::random(5);
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
        $produit = Produit::with(['categorie', 'images'])
            ->where('vendor_id', Auth::id())
            ->findOrFail($id);
        
        return response()->json($produit);
    }

    /**
     * Afficher le formulaire d'édition
     */
    public function edit($id)
    {
        $produit = Produit::with(['categorie', 'images'])
            ->where('vendor_id', Auth::id())
            ->findOrFail($id);
        
        $categories = Categorie::all(['id', 'name']);
        
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
        // Validation
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'images_to_delete.*' => 'nullable|exists:product_images,id',
        ]);

        // Vérifier que le produit appartient bien au vendeur
        $produit = Produit::where('vendor_id', Auth::id())->findOrFail($id);

        try {
            DB::beginTransaction();

            // Mettre à jour le produit
            $produit->title = $validated['title'];
            $produit->description = $validated['description'];
            $produit->price = $validated['price'];
            $produit->categorie_id = $validated['categorie_id'];
            $produit->stock = $validated['stock'];
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
        $produit = Produit::where('vendor_id', Auth::id())->findOrFail($id);

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

   
}
