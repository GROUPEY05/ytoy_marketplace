<?php
namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;

class CategoriePublicController extends Controller
{
    /**
     * Retourne toutes les catégories pour l'affichage public
     * Cet endpoint ne nécessite pas d'authentification
     */
    public function index()
    {
        $categories = Categorie::all();
        return response()->json($categories);
    }
}