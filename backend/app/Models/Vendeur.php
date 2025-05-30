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
        'ville',
        'description',
        'verifie',
        'date_verification',
        'adresse',
        'telephone',
        'email_contact',
        'siret',
        'statut'
    ];

    protected $casts = [
        'verifie' => 'boolean',
        'date_verification' => 'datetime'
    ];

    protected $attributes = [
        'verifie' => false,
        'statut' => 'en_attente'
    ];
    
    public function utilisateur()
    {
        return $this->belongsTo(Utilisateur::class, 'id');
    }
    
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }

    public function commandes()
    {
        return $this->hasManyThrough(
            Commande::class,
            Produit::class,
            'vendeur_id',
            'id',
            'id',
            'id'
        );
    }

    public function isVerified()
    {
        return $this->verifie;
    }

    public function verify()
    {
        $this->verifie = true;
        $this->date_verification = now();
        $this->statut = 'actif';
        return $this->save();
    }

    public function reject()
    {
        $this->verifie = false;
        $this->statut = 'rejete';
        return $this->save();
    }

    public function suspend()
    {
        $this->statut = 'suspendu';
        return $this->save();
    }

    public function activate()
    {
        $this->statut = 'actif';
        return $this->save();
    }
}
