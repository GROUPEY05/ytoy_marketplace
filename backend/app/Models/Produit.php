<?php
// app/Models/Produit.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
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
    
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function images()
    {
        return $this->hasMany(ImageProduit::class);
    }
    
    public function avis()
    {
        return $this->hasMany(Avis::class);
    }
    
    public function imagePrincipale()
    {
        return $this->hasOne(ImageProduit::class)->where('principale', true);
    }
    
    public function verifierDisponibilite($quantite)
    {
        return $this->quantite_stock >= $quantite;
    }
    
}
