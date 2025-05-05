<?php
// app/Models/Commande.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Utilisateur;
use App\Models\User;
use App\Models\LigneCommande;
use App\Models\Paiement;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Commande extends Model
{
    use HasFactory;
    protected $fillable = [
        'date_commande',
        'statut',
        'montant_total',
        'adresse_livraison',
        'utilisateur_id'
    ];

    protected $casts = [
        'montant_total' => 'decimal:2'
    ];
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class);
    }
    
    /**
     * Relation avec le modèle User pour compatibilité
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'utilisateur_id');
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
