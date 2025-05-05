<?php

namespace App\Http\Controllers;

use App\Models\ImageProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ImageProduitController extends Controller
{
    public function store(Request $request, $produitId)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $path = $image->store('produits', 'public');

            $imageProduit = new ImageProduit();
            $imageProduit->produit_id = $produitId;
            $imageProduit->chemin = $path;
            $imageProduit->save();

            return response()->json([
                'message' => 'Image uploaded successfully',
                'image' => $imageProduit
            ], 201);
        }

        return response()->json(['error' => 'No image file provided'], 400);
    }

    public function destroy($id)
    {
        $image = ImageProduit::findOrFail($id);
        
        // Supprimer le fichier physique
        if (Storage::disk('public')->exists($image->chemin)) {
            Storage::disk('public')->delete($image->chemin);
        }
        
        $image->delete();
        
        return response()->json(['message' => 'Image deleted successfully']);
    }

    public function reorder(Request $request, $produitId)
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:image_produits,id',
            'images.*.ordre' => 'required|integer|min:0'
        ]);

        foreach ($request->images as $imageData) {
            ImageProduit::where('id', $imageData['id'])
                ->where('produit_id', $produitId)
                ->update(['ordre' => $imageData['ordre']]);
        }

        return response()->json(['message' => 'Images reordered successfully']);
    }
}
