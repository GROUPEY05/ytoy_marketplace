<?php
// app/Models/Commande.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $fillable = [
        'date_commande',
        'statut',
        'montant_total',
        'adresse_livraison',
        'acheteur_id'
    ];
    
    public function acheteur()
    {
        return $this->belongsTo(Acheteur::class);
    }
    
    public function lignes()
    {
        return $this->hasMany(LigneCommande::class);
    }
    
    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
    
    public function changerStatut($statut)
    {
        $this->statut = $statut;
        return $this->save();
    }
}
