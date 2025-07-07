<?php
// app/Models/Commande.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Utilisateur;

use App\Models\LigneCommande;
use App\Models\Paiement;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Commande extends Model
{
    use HasFactory;
    const STATUT_EN_ATTENTE = 'en_attente';
    const STATUT_VALIDEE = 'validee';
    const STATUT_EN_PREPARATION = 'en_preparation';
    const STATUT_EXPEDIEE = 'expediee';
    const STATUT_LIVREE = 'livree';
    const STATUT_ANNULEE = 'annulee';

    protected $fillable = [
        'date_commande',
        'statut',
        'montant_total',
        'adresse_livraison',
        'utilisateur_id',
        'order_number',
        'email',
        'nom',
        'telephone',
        'methode_paiement'
    ];

    protected $casts = [
        'date_commande' => 'datetime',
        'montant_total' => 'decimal:2'
    ];

    protected $attributes = [
        'statut' => self::STATUT_EN_ATTENTE
    ];



    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    public function customer()
    {
        return $this->belongsTo(Utilisateur::class, 'utilisateur_id');
    }

    /**
     * Relation avec le modèle User pour compatibilité
     */


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

    public function produits()
    {
        return $this->belongsToMany(Produit::class, 'lignes_commande')
            ->withPivot(['quantite', 'prix_unitaire'])
            ->withTimestamps();
    }
    public function items()
    {
        return $this->hasMany(LigneCommande::class);
    }

}
