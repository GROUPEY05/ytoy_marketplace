<?php
// app/Models/Panier.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Panier extends Model
{
    use HasFactory;
    
    protected $table = 'paniers';
    
    protected $fillable = [
        'utilisateur_id'
    ];
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
    
    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'paniers_produit', 'panier_id', 'produit_id')
            ->withPivot('quantite', 'prix_unitaire')
            ->select('produits.*') // Sélectionner toutes les colonnes de produits
            ->withTimestamps();
    }
    
    public function calculerTotal()
    {
        return $this->produits->sum(function($produit) {
            return $produit->pivot->prix_unitaire * $produit->pivot->quantite;
        });
    }
}
