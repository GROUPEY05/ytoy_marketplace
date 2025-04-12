<?php
// app/Models/Utilisateur.php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;         
use Laravel\Sanctum\HasApiTokens; //pour l'authentification avec sanctum
use Spatie\Permission\Traits\HasRoles;

class Utilisateur extends Authenticatable
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
        'actif'
    ];

    protected $hidden = [
        'mot_de_passe',
        'token_reinitialisation',
        'remember_token',
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
}
