<?php
// app/Models/LignePanier.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PanierProduit extends Model
{
    protected $table = 'PanierProduit';
    
    protected $fillable = [
        'panier_id',
        'produit_id',
        'quantite',
        'prix_unitaire'
    ];
    
    public function panier()
    {
        return $this->belongsTo(Panier::class);
    }
    
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
