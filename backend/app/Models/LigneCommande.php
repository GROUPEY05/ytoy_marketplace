<?php
// app/Models/LigneCommande.php
namespace App\Models;
use App\Models\Commande;
use App\Models\Produit;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    use HasFactory;
    protected $table = 'lignes_commande';
    
    protected $fillable = [
        'commande_id',
        'panier_id',
        'produit_id',
        'quantite',
        'prix_unitaire'
    ];
    
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
    
    public function produit()
    {
        return $this->belongsTo(Produit::class, 'produit_id');
    }
    public function panier()
    {
        return $this->belongsTo(Panier::class, 'panier_id');
    }
}
