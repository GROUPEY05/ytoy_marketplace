<?php
// app/Models/Panier.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    protected $fillable = [
        'date_creation',
        'date_modification',
        'acheteur_id'
    ];
    
    public function acheteur()
    {
        return $this->belongsTo(Acheteur::class);
    }
    
    public function lignes()
    {
        return $this->hasMany(LignePanier::class);
    }
    
    public function calculerTotal()
    {
        return $this->lignes->sum(function($ligne) {
            return $ligne->prix_unitaire * $ligne->quantite;
        });
    }
}
