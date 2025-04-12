<?php
// app/Models/Vendeur.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendeur extends Model
{
    protected $table = 'vendeurs';
    
    protected $primaryKey = 'id';
    
    public $incrementing = false;
    
    protected $fillable = [
        'nom_boutique',
        'description',
        'verifie',
        'date_verification'
    ];
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }
    
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }
}
