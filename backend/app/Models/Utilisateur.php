<?php
// app/Models/Utilisateur.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;         
use Laravel\Sanctum\HasApiTokens; //pour l'authentification avec sanctum
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Contracts\Auth\MustVerifyEmail;//pour une verification plus approfondie de l'email

class Utilisateur extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable;

    use HasRoles; // Pour la gestion des rôles et permissions

    protected $table = 'utilisateurs';

    protected $fillable = [
        'email', 
        'nom', 
        'prenom', 
        'telephone', 
        'adresse', 
        'role', 
        'mot_de_passe',
        'actif'
    ];

    protected $hidden = [
        'mot_de_passe',
        'token_reinitialisation',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getAuthPassword()
    {
        return $this->mot_de_passe;
    }

    public function acheteur()
    {
        return $this->hasOne(Acheteur::class, 'id');
    }

    public function vendeur()
    {
        return $this->hasOne(Vendeur::class, 'id');
    }

    public function administrateur()
    {
        return $this->hasOne(Administrateur::class, 'id');
    }
    
    public function isAcheteur()
    {
        return $this->role === 'acheteur';
    }
    
    public function isVendeur()
    {
        return $this->role === 'vendeur';
    }
    
    public function isAdmin()
    {
        return $this->role === 'administrateur';
    }

    public function commande()
    {
        return $this->hasMany(Commande::class, 'utilisateur_id');
    }
    
    public function produits()
    {
        return $this->hasMany(Produit::class, 'vendeur_id');
    }
}
