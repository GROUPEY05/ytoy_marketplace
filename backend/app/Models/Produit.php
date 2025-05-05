<?php
// app/Models/Produit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'description',
        'prix',
        'quantite_stock',
        'date_ajout',
        'actif',
        'vendeur_id',
        'categorie_id'
    ];

    public function vendeur()
    {
        return $this->belongsTo(Utilisateur::class, 'vendeur_id');
    }

    public function paniers()
    {
        return $this->belongsToMany(panier::class, 'paniers_produit', 'produit_id', 'panier_id')
            ->withPivot('quantite')
            ->withTimestamps();
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }

    public function images()
    {
        return $this->hasMany(ProduitImage::class);
    }

    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
    
    /**
     * Relation avec les promotions
     */
    public function promotions()
    {
        return $this->hasMany(Promotion::class);
    }

    public function imagePrincipale()
    {
        return $this->hasOne(ImageProduit::class)->where('principale', true);
    }

    public function verifierDisponibilite($quantite)
    {
        return $this->quantite_stock >= $quantite;
    }

    public function produits()
    {
        return $this->hasMany(Produit::class, 'categorie_id');
    }

}
