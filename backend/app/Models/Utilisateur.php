<?php
// app/Models/Utilisateur.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;

class Utilisateur extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use CanResetPasswordTrait;
    use HasApiTokens, Notifiable;

    protected $table = 'utilisateurs';

    protected $fillable = [
        'email',
        'nom',
        'prenom',
        'telephone',
        'adresse',
        'role',
        'mot_de_passe',
        'actif',
        'reset_token',
        'reset_token_expiry'
    ];

    protected $hidden = [
        'mot_de_passe',
        'token_reinitialisation',
        'remember_token',
        'reset_token',
        'reset_token_expiry'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'mot_de_passe' => 'hashed',
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

    public function campagnes()
    {
        return $this->hasMany(Campagne::class, 'vendeur_id');
    }

}
