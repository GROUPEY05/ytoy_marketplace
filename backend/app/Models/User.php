<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * La table associée au modèle.
     *
     * @var string
     */
    protected $table = 'utilisateurs';

    /**
     * Les attributs qui sont mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'mot_de_passe',
        'telephone',
        'adresse',
        'role',
        'actif'
    ];

    /**
     * Les attributs qui doivent être cachés pour la sérialisation.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'mot_de_passe',
        'remember_token',
        'token_reinitialisation'
    ];

    /**
     * Les attributs qui doivent être castés.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Obtenir le mot de passe pour l'authentification.
     *
     * @return string
     */
    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    /**
     * Relation avec les commandes.
     */
    public function commandes()
    {
        return $this->hasMany(Commande::class, 'utilisateur_id');
    }

    /**
     * Relation avec les produits (pour les vendeurs).
     */
    public function produits()
    {
        return $this->hasMany(Produit::class, 'vendeur_id');
    }

    /**
     * Relation avec le profil vendeur.
     */
    public function vendeur()
    {
        return $this->hasOne(Vendeur::class, 'utilisateur_id');
    }

    /**
     * Vérifier si l'utilisateur est un vendeur.
     */
    public function isVendeur()
    {
        return $this->role === 'vendeur';
    }
    
    /**
     * Relation avec les promotions (pour les vendeurs).
     */
    public function promotions()
    {
        return $this->hasMany(Promotion::class, 'vendeur_id');
    }

    /**
     * Vérifier si l'utilisateur est un acheteur.
     */
    public function isAcheteur()
    {
        return $this->role === 'acheteur';
    }

    /**
     * Vérifier si l'utilisateur est un administrateur.
     */
    public function isAdmin()
    {
        return $this->role === 'administrateur';
    }
}
